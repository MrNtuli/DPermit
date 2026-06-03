import type { ChartOptions } from 'chart.js';

/** Smooth draw-in for dashboards (lines grow, bars rise, doughnut sweeps). */
export const CHART_ANIM_DURATION = 900;

export const CHART_ANIM_OPTS: Pick<ChartOptions, 'animation' | 'animations' | 'transitions'> = {
  animation: {
    duration: CHART_ANIM_DURATION,
    easing: 'easeOutQuart',
  },
  animations: {
    numbers: {
      type: 'number',
      duration: CHART_ANIM_DURATION,
      easing: 'easeOutQuart',
    },
    colors: { type: 'color', duration: 400 },
    tension: {
      duration: CHART_ANIM_DURATION,
      easing: 'easeOutQuart',
    },
  },
  transitions: {
    active: {
      animation: { duration: 280, easing: 'easeOutQuart' },
    },
  },
};

export function mergeChartAnimation<T extends ChartOptions>(options: T): T {
  return {
    ...options,
    ...CHART_ANIM_OPTS,
    animation: { ...CHART_ANIM_OPTS.animation, ...(options.animation || {}) },
    animations: { ...CHART_ANIM_OPTS.animations, ...(options.animations || {}) },
  };
}
