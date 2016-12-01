import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { GroupService } from './../../services';

declare var messager: any;

@Component({
  selector: 'monitor-layout',
  templateUrl: './layout.html'
})
export class LayoutPage implements OnInit {

  private menuItems: Array<any> = [];
  private addGroupModal: any;

  private form: FormGroup;
  private submitted: boolean;

  constructor(
    private groupService: GroupService,
    private _fb: FormBuilder,
    private router: Router) {

  }

  ngOnInit() {
    this.addGroupModal = {
      show: false,
      title: 'Add Group',
      size: 'lg',
      hideFooter: true
    };
    this.initForm();
    this.groupService.subscriber((data: any) => {
      this.menuItems = [{
        id: '0',
        text: 'Groups',
        isHeader: true
      }];
      data.forEach((item: any) => {
        this.menuItems.push({
          id: item.GroupId,
          text: item.Name,
          icon: item.Icon
        });
      });
    })
  }

  onMenuClick(menuItem: any) {
    this.router.navigate(['/groups', menuItem.id, 'overview']);
  }

  private initForm() {
    this.submitted = false;
    this.form = this._fb.group({
      Name: ['', [Validators.required, Validators.minLength(2)]],
      Description: ['', [Validators.required, Validators.maxLength(200)]],
      Icon: ['']
    });
  }

  private showAddGroup() {
    this.initForm();
    this.addGroupModal.show = true;
  }

  private saveGroup(form: any) {
    this.submitted = true;
    if (form.invalid) return;
    let data = JSON.parse(JSON.stringify(form.value));
    this.groupService.addGroup(data)
      .then(res => {
        this.addGroupModal.show = false;
        this.groupService.reload();
      })
      .catch(err => {
        messager.error(err);
      });
  }
}