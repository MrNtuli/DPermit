import {
  AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild,
} from '@angular/core';
import {
  Chart, ChartConfiguration, ChartType, DoughnutController, ArcElement, Tooltip, Legend,
  LineController, LineElement, PointElement, CategoryScale, LinearScale, Filler,
  BarController, BarElement,
} from 'chart.js';

Chart.register(
  DoughnutController, ArcElement, Tooltip, Legend,
  LineController, LineElement, PointElement, CategoryScale, LinearScale, Filler,
  BarController, BarElement,
);

@Component({
  selector: 'app-chart-canvas',
  template: `<div class="chart-wrap" [class.chart-ready]="ready"><canvas #canvas></canvas></div>`,
  styles: [`
    .chart-wrap {
      position: relative;
      width: 100%;
      height: 300px;
      min-height: 300px;
      opacity: 0;
      transform: translateY(6px);
      transition: opacity 0.45s ease, transform 0.45s ease;
    }
    .chart-wrap.chart-ready {
      opacity: 1;
      transform: translateY(0);
    }
    @media (min-width: 768px) {
      .chart-wrap { height: 320px; min-height: 320px; }
    }
  `],
  standalone: false,
})
export class ChartCanvasComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() type: ChartType = 'doughnut';
  @Input() config: ChartConfiguration | null = null;
  /** Bumped when filter/data changes so Chart.js redraws with animation. */
  @Input() revision = 0;

  ready = false;
  private chart?: Chart;

  ngAfterViewInit() { this.render(); }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['config'] || changes['revision']) this.render();
  }
  ngOnDestroy() {
    this.ready = false;
    this.chart?.destroy();
  }

  private render() {
    if (!this.canvasRef?.nativeElement || !this.config) return;

    const canvas = this.canvasRef.nativeElement;
    const nextType = this.config.type || this.type;

    const currentType = (this.chart?.config as ChartConfiguration | undefined)?.type;
    if (this.chart && currentType === nextType) {
      this.chart.data = structuredClone(this.config.data);
      if (this.config.options) {
        Object.assign(this.chart.options, this.config.options);
      }
      this.chart.update('active');
      this.markReady();
      return;
    }

    this.chart?.destroy();
    this.ready = false;
    this.chart = new Chart(canvas, this.config);
    this.markReady();
  }

  private markReady() {
    requestAnimationFrame(() => {
      this.ready = true;
    });
  }
}
