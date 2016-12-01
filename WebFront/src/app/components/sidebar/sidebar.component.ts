import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'm-sidebar',
  templateUrl: './sidbar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent implements OnInit {

  @Input()
  public enableSearch: boolean = true;

  @Input()
  get menuItems(): Array<any> {
    return this._menuItems;
  }
  set menuItems(value: Array<any>) {
    this._menuItems = value || [];
    this.searchValueChange('');
  }

  @Output()
  public onMenuClick: EventEmitter<any> = new EventEmitter();

  private _menuItems: Array<any> = [];
  private filterValue: string;
  private filterMenu: Array<any>;
  private activeItem: any;

  constructor() { }

  ngOnInit() {
    this.filterMenu = this.menuItems;
  }

  searchValueChange(event: any) {
    if (event) {
      this.filterMenu = this.menuItems.filter(item => {
        return item.text.toLowerCase().indexOf(event) !== -1 || item.isHeader;
      });
    } else {
      this.filterMenu = this.menuItems;
    }
  }

  menuClick(item: any, parentItem?: any): void {
    if (this.activeItem == item && item.subMenu) {
      this.activeItem = null;
      return;
    }
    this.activeItem = parentItem || item;
    if (!item.subMenu) {
      this.onMenuClick.emit(item);
    }
  }
}