import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/core';

@Component({
  selector: 'm-modal',
  templateUrl: './modal.html',
  styleUrls: ['./modal.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('200ms', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate('200ms', style({ transform: 'translateY(-100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ModalComponent implements OnInit {
  @Input()
  public options: any = {};

  constructor() { }

  ngOnInit() { }

  private getStyleClass(): string {
    let cls = 'show modal';
    if (this.options.style) {
      cls += ` modal-${this.options.style}`;
    }
    return cls;
  }

  private getSizeClass(): string {
    let cls = 'modal-dialog';
    if (this.options.size) {
      cls += ` modal-${this.options.size}`;
    }
    return cls;
  }

  private cancelBtnClick() {
    if (typeof this.options.cancelBtnClick === 'function') {
      let result = this.options.cancelBtnClick();
      if (result !== false) {
        this.options.show = false;
      }
    } else {
      this.options.show = false;
    }
  }

  private okBtnClick() {
    if (typeof this.options.okBtnClick === 'function') {
      let result = this.options.okBtnClick();
      if (result !== false) {
        this.options.show = false;
      }
    } else {
      this.options.show = false;
    }
  }
}