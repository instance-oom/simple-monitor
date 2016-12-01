import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'monitor-home',
  templateUrl: './home.html'
})
export class HomePage implements OnInit {

  private menuItems: Array<any> = [];

  constructor() { }

  ngOnInit() {
    this.menuItems = [
      {
        id: 1,
        text: 'Groups',
        isHeader: true
      },
      {
        id: 2,
        text: 'test',
        icon: 'fa fa-circle-o text-red',
        isHeader: false
      },
      {
        id: 3,
        text: 'Groups',
        isHeader: false,
        subMenu: [
          {
            id: 4,
            text: 'SubMenu1',
          }
        ]
      }
    ]
  }

  onMenuClick(menuItem: any) {
    console.log(menuItem)
  }
}