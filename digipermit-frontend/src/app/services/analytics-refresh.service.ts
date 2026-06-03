import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/** Signals dashboard analytics to reload from the API (e.g. after a scan or returning to a dashboard). */
@Injectable({ providedIn: 'root' })
export class AnalyticsRefreshService {
  private readonly tick = new Subject<void>();
  readonly refresh$ = this.tick.asObservable();

  requestRefresh(): void {
    this.tick.next();
  }
}
