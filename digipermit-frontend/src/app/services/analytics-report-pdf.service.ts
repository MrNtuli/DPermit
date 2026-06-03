import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { DashboardChartData } from '../interfaces/models';
import { AnalyticsReportScope } from './analytics-report-scope';

export interface AnalyticsReportPdfInput {
  reportTitle?: string;
  preparedFor: string;
  roleLabel: string;
  organisationName?: string;
  filtersSummary: string;
  generatedAt: string;
  summary: Record<string, number>;
  chartData: DashboardChartData;
  scope: AnalyticsReportScope;
  recentLogs?: Array<{
    permits?: { permit_number?: string };
    scan_type?: string;
    created_at?: string;
    verification_result?: string;
  }>;
}

const SUMMARY_LABELS: Record<string, string> = {
  total_organisations: 'Organisations',
  total_users: 'Active users',
  total_foreign_nationals: 'Foreign nationals',
  total_permits: 'Total permits',
  active_permits: 'Active permits',
  expiring_permits: 'Expiring soon',
  expired_permits: 'Expired permits',
  revoked_permits: 'Revoked permits',
  pending_verification: 'Pending verification',
  renewal_requests: 'Pending renewal requests',
  successful_verifications: 'Successful verifications (period)',
  failed_verifications: 'Failed / invalid verifications (period)',
  unresolved_alerts: 'Unresolved alerts',
  my_scans_in_period: 'My scans (period)',
};

@Injectable({ providedIn: 'root' })
export class AnalyticsReportPdfService {
  private readonly margin = 14;
  private readonly pageW = 210;
  private readonly pageH = 297;
  private readonly contentW = this.pageW - this.margin * 2;

  async download(input: AnalyticsReportPdfInput): Promise<void> {
    const pdf = this.build(input);
    const stamp = new Date().toISOString().slice(0, 10);
    const role = input.roleLabel.replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    pdf.save(`DigiPermit-Analytics-${role}-${stamp}.pdf`);
  }

  build(input: AnalyticsReportPdfInput): jsPDF {
    const scope = input.scope;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    let y = this.drawHeader(pdf, input.reportTitle || scope.title);

    y = this.section(pdf, 'Report details', y);
    y = this.lines(pdf, [
      `Prepared for: ${input.preparedFor}`,
      `Role: ${input.roleLabel}`,
      input.organisationName ? `Organisation scope: ${input.organisationName}` : null,
      `Generated: ${input.generatedAt}`,
      input.filtersSummary ? `Filters: ${input.filtersSummary}` : 'Filters: Default (last 14 days)',
    ].filter(Boolean) as string[], y);

    y = this.section(pdf, 'Key metrics', y);
    y = this.summaryTable(pdf, input.summary, scope, y);

    const d = input.chartData;
    if (scope.sections.permitStatus && d.permit_status?.labels?.length) {
      y = this.ensureSpace(pdf, y, 40);
      y = this.section(pdf, 'Permit status distribution', y);
      y = this.keyValueTable(pdf, d.permit_status.labels, d.permit_status.values, y);
    }

    if (scope.sections.verificationTrend && d.verification_trend?.labels?.length) {
      y = this.ensureSpace(pdf, y, 40);
      y = this.section(pdf, `Verification activity (${d.period_days} days)`, y);
      y = this.trendTable(pdf, d.verification_trend, scope, y);
    }

    if (scope.sections.verificationResults && d.verification_results?.labels?.length) {
      y = this.ensureSpace(pdf, y, 35);
      y = this.section(pdf, `Verification results (${d.period_days} days)`, y);
      y = this.keyValueTable(pdf, d.verification_results.labels, d.verification_results.values, y);
    }

    if (scope.sections.alerts && d.alerts_by_type?.labels?.length) {
      y = this.ensureSpace(pdf, y, 35);
      y = this.section(pdf, 'Alerts by type', y);
      y = this.keyValueTable(pdf, d.alerts_by_type.labels, d.alerts_by_type.values, y);
    }

    if (scope.sections.recentLogs && input.recentLogs?.length) {
      y = this.ensureSpace(pdf, y, 45);
      y = this.section(pdf, 'Recent verifications', y);
      y = this.recentLogsTable(pdf, input.recentLogs, scope.maxRecentLogs, y);
    }

    if (scope.sections.chartImages) {
      this.appendChartImages(pdf, scope.chartSelectors);
    }

    this.drawFooter(pdf);
    return pdf;
  }

  private drawHeader(pdf: jsPDF, title: string): number {
    pdf.setFillColor(15, 61, 46);
    pdf.rect(0, 0, this.pageW, 32, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(15);
    pdf.text('DigiPermit', this.margin, 14);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Government Compliance Portal', this.margin, 21);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text(title, this.margin, 28);
    pdf.setTextColor(30, 41, 59);
    return 40;
  }

  private drawFooter(pdf: jsPDF): void {
    const pages = pdf.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text(
        'DigiPermit capstone prototype — academic simulation. Data sourced from live API at generation time.',
        this.margin,
        this.pageH - 10,
      );
      pdf.text(`Page ${i} of ${pages}`, this.pageW - this.margin - 18, this.pageH - 10);
    }
  }

  private section(pdf: jsPDF, title: string, y: number): number {
    y = this.ensureSpace(pdf, y, 14);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(15, 61, 46);
    pdf.text(title, this.margin, y);
    pdf.setDrawColor(31, 122, 90);
    pdf.setLineWidth(0.4);
    pdf.line(this.margin, y + 2, this.pageW - this.margin, y + 2);
    return y + 10;
  }

  private lines(pdf: jsPDF, lines: string[], y: number): number {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    pdf.setTextColor(51, 65, 85);
    for (const line of lines) {
      y = this.ensureSpace(pdf, y, 6);
      pdf.text(line, this.margin, y);
      y += 5.5;
    }
    return y + 4;
  }

  private summaryTable(
    pdf: jsPDF,
    summary: Record<string, number>,
    scope: AnalyticsReportScope,
    y: number,
  ): number {
    const rows = scope.summaryKeys
      .filter(key => SUMMARY_LABELS[key])
      .filter(key => !scope.omitZeroSummary || (summary[key] ?? 0) > 0)
      .map(key => [SUMMARY_LABELS[key], String(summary[key] ?? 0)]);

    if (!rows.length) {
      return this.lines(pdf, ['No activity recorded for the selected filters in this period.'], y);
    }
    return this.twoColumnTable(pdf, ['Metric', 'Value'], rows, y);
  }

  private keyValueTable(pdf: jsPDF, labels: string[], values: number[], y: number): number {
    const rows = labels.map((l, i) => [this.titleCase(l), String(values[i] ?? 0)]);
    return this.twoColumnTable(pdf, ['Category', 'Count'], rows, y);
  }

  private trendTable(
    pdf: jsPDF,
    trend: DashboardChartData['verification_trend'],
    scope: AnalyticsReportScope,
    y: number,
  ): number {
    let rows = trend.labels.map((label, i) => ({
      label,
      total: trend.total[i] ?? 0,
      valid: trend.valid[i] ?? 0,
      failed: trend.failed[i] ?? 0,
    }));
    if (scope.trendOnlyActiveDays) {
      rows = rows.filter(r => r.total > 0);
    }
    if (scope.maxTrendRows > 0) {
      rows = rows.slice(-scope.maxTrendRows);
    }
    if (!rows.length) {
      return this.lines(pdf, ['No verification scans in the selected period.'], y);
    }
    const tableRows = rows.map(r => [
      r.label,
      String(r.total),
      String(r.valid),
      String(r.failed),
    ]);
    return this.table(pdf, ['Date (UTC)', 'Total', 'Valid', 'Failed'], tableRows, y, [32, 22, 22, 22]);
  }

  private recentLogsTable(
    pdf: jsPDF,
    logs: AnalyticsReportPdfInput['recentLogs'],
    maxRows: number,
    y: number,
  ): number {
    const rows = (logs || []).slice(0, maxRows || 10).map(l => [
      l?.permits?.permit_number || '—',
      this.titleCase(l?.scan_type || ''),
      l?.verification_result?.replace(/_/g, ' ') || '—',
      l?.created_at ? new Date(l.created_at).toLocaleString() : '—',
    ]);
    return this.table(
      pdf,
      ['Permit', 'Scan', 'Outcome', 'When'],
      rows,
      y,
      [42, 28, 38, 52],
    );
  }

  private twoColumnTable(pdf: jsPDF, headers: string[], rows: string[][], y: number): number {
    return this.table(pdf, headers, rows, y, [110, 50]);
  }

  private table(
    pdf: jsPDF,
    headers: string[],
    rows: string[][],
    y: number,
    colWidths: number[],
  ): number {
    const rowH = 7;
    y = this.ensureSpace(pdf, y, rowH * (rows.length + 2));

    pdf.setFillColor(234, 246, 240);
    pdf.rect(this.margin, y - 5, this.contentW, rowH, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    pdf.setTextColor(15, 61, 46);
    let x = this.margin + 2;
    headers.forEach((h, i) => {
      pdf.text(h, x, y);
      x += colWidths[i];
    });
    y += rowH;

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(51, 65, 85);
    for (const row of rows) {
      y = this.ensureSpace(pdf, y, rowH);
      x = this.margin + 2;
      row.forEach((cell, i) => {
        const text = pdf.splitTextToSize(String(cell), colWidths[i] - 2)[0] as string;
        pdf.text(text, x, y);
        x += colWidths[i];
      });
      y += rowH;
    }
    return y + 6;
  }

  private appendChartImages(pdf: jsPDF, selectors: string[]): void {
    const seen = new Set<HTMLCanvasElement>();
    const canvases: HTMLCanvasElement[] = [];
    for (const sel of selectors) {
      document.querySelectorAll<HTMLCanvasElement>(sel).forEach(c => {
        if (!seen.has(c)) {
          seen.add(c);
          canvases.push(c);
        }
      });
    }
    if (!canvases.length) return;

    for (const canvas of canvases) {
      try {
        const img = canvas.toDataURL('image/png', 1.0);
        pdf.addPage();
        let y = this.drawHeader(pdf, 'Chart appendix');
        const maxW = this.contentW;
        const ratio = canvas.height / canvas.width;
        const w = maxW;
        const h = Math.min(w * ratio, 220);
        pdf.addImage(img, 'PNG', this.margin, y, w, h);
      } catch {
        /* skip unreadable canvas */
      }
    }
  }

  private ensureSpace(pdf: jsPDF, y: number, needed: number): number {
    if (y + needed > this.pageH - 20) {
      pdf.addPage();
      return 40;
    }
    return y;
  }

  private titleCase(s: string): string {
    return s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}
