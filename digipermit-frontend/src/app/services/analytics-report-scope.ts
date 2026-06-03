/** What each role includes in a downloaded analytics PDF. */

export interface AnalyticsReportScope {
  title: string;
  summaryKeys: string[];
  sections: {
    permitStatus: boolean;
    verificationTrend: boolean;
    verificationResults: boolean;
    alerts: boolean;
    recentLogs: boolean;
    chartImages: boolean;
  };
  /** CSS selectors for chart canvases to snapshot (in order). */
  chartSelectors: string[];
  maxTrendRows: number;
  maxRecentLogs: number;
  trendOnlyActiveDays: boolean;
  omitZeroSummary: boolean;
}

export interface ReportScopeUiFlags {
  showPermitCharts: boolean;
  showAlertCharts: boolean;
  showRecentLogs: boolean;
}

export function getAnalyticsReportScope(
  role: string,
  ui: ReportScopeUiFlags,
): AnalyticsReportScope {
  const verificationCharts = [
    '.chart-export-verification-trend canvas',
    '.chart-export-verification-results canvas',
  ];
  const permitChart = ['.chart-export-permit-status canvas'];
  const alertChart = ['.chart-export-alerts canvas'];
  const allCharts = [
    ...permitChart,
    ...verificationCharts,
    ...alertChart,
  ];

  if (role === 'verification_officer') {
    return {
      title: 'Checkpoint Verification Report',
      summaryKeys: ['my_scans_in_period', 'successful_verifications', 'failed_verifications'],
      sections: {
        permitStatus: false,
        verificationTrend: true,
        verificationResults: true,
        alerts: false,
        recentLogs: ui.showRecentLogs,
        chartImages: true,
      },
      chartSelectors: verificationCharts,
      maxTrendRows: 14,
      maxRecentLogs: 8,
      trendOnlyActiveDays: true,
      omitZeroSummary: true,
    };
  }

  if (role === 'system_admin') {
    return {
      title: 'Platform Compliance Report',
      summaryKeys: [
        'total_organisations', 'total_users', 'total_foreign_nationals', 'total_permits',
        'active_permits', 'expiring_permits', 'expired_permits', 'revoked_permits',
        'pending_verification', 'renewal_requests', 'successful_verifications',
        'failed_verifications', 'unresolved_alerts',
      ],
      sections: {
        permitStatus: ui.showPermitCharts,
        verificationTrend: true,
        verificationResults: true,
        alerts: ui.showAlertCharts,
        recentLogs: false,
        chartImages: true,
      },
      chartSelectors: pickChartSelectors(ui, allCharts),
      maxTrendRows: 21,
      maxRecentLogs: 0,
      trendOnlyActiveDays: true,
      omitZeroSummary: true,
    };
  }

  if (role === 'immigration_officer') {
    return {
      title: 'Immigration Compliance Review Report',
      summaryKeys: [
        'pending_verification', 'renewal_requests', 'unresolved_alerts',
        'total_permits', 'successful_verifications', 'failed_verifications',
      ],
      sections: {
        permitStatus: ui.showPermitCharts,
        verificationTrend: true,
        verificationResults: true,
        alerts: ui.showAlertCharts,
        recentLogs: false,
        chartImages: true,
      },
      chartSelectors: pickChartSelectors(ui, allCharts),
      maxTrendRows: 14,
      maxRecentLogs: 0,
      trendOnlyActiveDays: true,
      omitZeroSummary: true,
    };
  }

  if (role === 'manager' || role === 'auditor') {
    return {
      title: 'Executive Compliance Overview',
      summaryKeys: [
        'total_permits', 'active_permits', 'expiring_permits', 'expired_permits',
        'unresolved_alerts', 'successful_verifications', 'failed_verifications',
      ],
      sections: {
        permitStatus: ui.showPermitCharts,
        verificationTrend: true,
        verificationResults: true,
        alerts: ui.showAlertCharts,
        recentLogs: false,
        chartImages: true,
      },
      chartSelectors: pickChartSelectors(ui, allCharts),
      maxTrendRows: 14,
      maxRecentLogs: 0,
      trendOnlyActiveDays: true,
      omitZeroSummary: true,
    };
  }

  if (role === 'foreign_national') {
    return {
      title: 'My Permit Summary',
      summaryKeys: ['total_permits', 'active_permits', 'expiring_permits', 'expired_permits', 'unresolved_alerts'],
      sections: {
        permitStatus: ui.showPermitCharts,
        verificationTrend: false,
        verificationResults: false,
        alerts: ui.showAlertCharts,
        recentLogs: false,
        chartImages: true,
      },
      chartSelectors: pickChartSelectors(ui, permitChart.concat(alertChart)),
      maxTrendRows: 0,
      maxRecentLogs: 0,
      trendOnlyActiveDays: true,
      omitZeroSummary: true,
    };
  }

  /* employer_hr, university_officer, clinic_admin */
  return {
    title: 'Organisation Compliance Report',
    summaryKeys: [
      'total_foreign_nationals', 'total_permits', 'active_permits', 'expiring_permits',
      'expired_permits', 'renewal_requests', 'unresolved_alerts',
      'successful_verifications', 'failed_verifications',
    ],
    sections: {
      permitStatus: ui.showPermitCharts,
      verificationTrend: true,
      verificationResults: true,
      alerts: ui.showAlertCharts,
      recentLogs: false,
      chartImages: true,
    },
    chartSelectors: pickChartSelectors(ui, allCharts),
    maxTrendRows: 14,
    maxRecentLogs: 0,
    trendOnlyActiveDays: true,
    omitZeroSummary: true,
  };
}

function pickChartSelectors(ui: ReportScopeUiFlags, all: string[]): string[] {
  const out: string[] = [];
  if (ui.showPermitCharts) out.push('.chart-export-permit-status canvas');
  out.push('.chart-export-verification-trend canvas', '.chart-export-verification-results canvas');
  if (ui.showAlertCharts) out.push('.chart-export-alerts canvas');
  return out.length ? out : all;
}
