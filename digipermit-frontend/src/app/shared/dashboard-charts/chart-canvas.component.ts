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
  template: `<div class="chart-wrap"><canvas #canvas></canvas></div>`,
  styles: [`
    .chart-wrap {
      position: relative;
      width: 100%;
      height: 300px;
      min-height: 300px;
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
  /** Bumped when filter/data changes so Chart.js always redraws. */
  @Input() revision = 0;

  private chart?: Chart;

  ngAfterViewInit() { this.render(); }
  ngOnChanges(_: SimpleChanges) { this.render(); }
  ngOnDestroy() { this.chart?.destroy(); }

  private render() {
    if (!this.canvasRef?.nativeElement || !this.config) return;
    this.chart?.destroy();
    this.chart = new Chart(this.canvasRef.nativeElement, this.config);
  }
}
