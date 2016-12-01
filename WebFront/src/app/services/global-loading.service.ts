import { Injectable } from '@angular/core';

@Injectable()
export class GlobalLoadingService {
  private loadingEl: HTMLDivElement;
  private count: number = 0;

  constructor() {
    this.loadingEl = <HTMLDivElement>document.getElementById('monitor_global_loading');
  }

  add() {
    this.count++;
    if (this.count === 1) {
      this.show();
    }
  }

  sub() {
    this.count--;
    if (this.count <= 0) {
      this.count = 0;
      this.hide();
    }
  }

  show() {
    this.loadingEl.classList.add('show');
    document.body.style.overflowY = 'hidden';
  }

  hide() {
    setTimeout(() => {
      this.loadingEl.classList.remove('show');
      document.body.style.overflowY = 'auto';
    }, 300);
  }
}