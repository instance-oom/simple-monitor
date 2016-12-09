import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { CustomHttpService, GroupService, PanelService } from './../../../services';

declare var messager: any;

@Component({
  selector: 'group-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class GroupHomePage implements OnInit {

  private groupId: string;
  private group: any;
  private isGetData: boolean = false;
  private refreshInterval: any;
  private refreshTime: number = 0;

  private submitted: boolean;
  private panelForm: FormGroup;
  private groupForm: FormGroup;

  private isEdit: boolean;
  private editPanelModal: any = {};
  private delPanelModal: any = {};
  private delPanelTarget: any;
  private delGroupModal: any = {};
  private editGroupModal: any = {};

  constructor(
    private http: CustomHttpService,
    private groupService: GroupService,
    private panelService: PanelService,
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {

  }

  ngOnInit() {
    this.route.params.forEach(param => {
      this.groupId = param["groupId"];
      this.getPanels(this.groupId);
    });
    this.delPanelModal = {
      show: false,
      title: 'Delete Panel',
      cancelBtn: 'No',
      okBtn: 'Yes',
      okBtnClick: this.delPanel.bind(this)
    };
    this.editPanelModal = {
      show: false,
      title: 'Add Panel',
      size: 'lg',
      hideFooter: true
    };
    this.delGroupModal = {
      show: false,
      title: 'Delete Group',
      cancelBtn: 'No',
      okBtn: 'Yes',
      okBtnClick: this.delGroup.bind(this)
    };
    this.editGroupModal = {
      show: false,
      title: 'Edit Group',
      size: 'lg',
      hideFooter: true
    };
    this.initPanelForm();
  }

  ngAfterViewInit() {

  }

  private initPanelForm(panel?: any) {
    this.submitted = false;
    if (!panel) {
      this.panelForm = this._fb.group({
        Name: ['', [Validators.required, Validators.minLength(2)]],
        Description: ['', [Validators.required, Validators.maxLength(200)]],
        HostInfos: this._fb.array([this.initHostInfo()]),
        ColumnInfos: this._fb.array([this.initColumnInfo()])
      });
      return;
    }
    this.panelForm = this._fb.group({
      PanelId: panel.PanelId,
      Name: [panel.Name, [Validators.required, Validators.minLength(2)]],
      Description: [panel.Description, [Validators.required, Validators.maxLength(200)]],
      HostInfos: this._fb.array([]),
      ColumnInfos: this._fb.array([])
    });
    if (panel.HostInfos && panel.HostInfos.length > 0) {
      let ctrl = <FormArray>this.panelForm.controls['HostInfos'];
      for (let host of panel.HostInfos) {
        ctrl.push(this.initHostInfo(host));
      }
    }
    if (panel.ColumnInfos && panel.ColumnInfos.length > 0) {
      let ctrl = <FormArray>this.panelForm.controls['ColumnInfos'];
      for (let column of panel.ColumnInfos) {
        ctrl.push(this.initColumnInfo(column));
      }
    }
  }

  private initGroupForm(group: any) {
    this.submitted = false;
    this.groupForm = this._fb.group({
      Name: [group.Name || '', [Validators.required, Validators.minLength(2)]],
      Description: [group.Description || '', [Validators.required, Validators.maxLength(200)]],
      Icon: [group.Icon || '']
    });
  }

  private initHostInfo(host?: any): FormGroup {
    host = host || {}
    return this._fb.group({
      DisplayName: [host.DisplayName || '', [Validators.required]],
      Url: [host.Url || '', [Validators.required, Validators.minLength(2)]]
    });
  }

  private initColumnInfo(column?: any): FormGroup {
    column = column || {};
    return this._fb.group({
      DisplayName: [column.DisplayName || '', [Validators.required, Validators.maxLength(20)]],
      Key: [column.Key || '', [Validators.required, Validators.maxLength(100)]]
    });
  }

  private setRefreshTime(interval: number) {
    this.refreshTime = interval;
    if (this.refreshInterval) {
      window.clearInterval(this.refreshInterval);
    }
    if (interval !== 0) {
      this.refreshInterval = setInterval(() => {
        this.getData();
      }, interval * 1000);
    }
  }

  private manualRefresh() {
    if (this.refreshTime === 0) this.getData();
  }

  private getRefreshDropdownText(): string {
    if (this.refreshTime === 0) return 'Manual Refresh';
    if (this.refreshTime >= 60) {
      return `Every ${this.refreshTime / 60} minute(s)`
    } else {
      return `Every ${this.refreshTime} seconds`
    }
  }

  private getPanels(groupId: string) {
    this.groupService.getById(groupId)
      .then(data => {
        this.group = data;
        this.getData();
      })
      .catch(err => {
        messager.error(err);
        this.router.navigate(['/']);
      });
  }

  private getData() {
    for (let i = 0; i < this.group.PanelInfos.length; i++) {
      let panel = this.group.PanelInfos[i];
      panel.isDone = 0;
      let columns = this.group.PanelInfos[i].ColumnInfos;
      for (let j = 0; j < panel.HostInfos.length; j++) {
        let host = panel.HostInfos[j];
        ((url, panelIndex, hostIndex, columns) => {
          this.http.get(url, { disableLoading: true })
            .then(res => {
              let data = res.json();
              let panel = this.group.PanelInfos[panelIndex];
              let host = panel.HostInfos[hostIndex];
              panel.isDone++;
              host.result = {
                httpStatus: res.status
              }
              for (let k = 0; k < columns.length; k++) {
                let key = `data.${columns[k].Key}`;
                host.result[columns[k].DisplayName] = eval(key);
              }
            })
            .catch(err => {
              let panel = this.group.PanelInfos[panelIndex];
              let host = panel.HostInfos[hostIndex];
              panel.isDone++;
              host.result = {
                httpStatus: err.status
              }
            })
        })(host.Url, i, j, columns)
      }
    }
  }

  private showEditGroup() {
    this.editGroupModal.show = true;
    this.initGroupForm(this.group);
  }

  private showEditPanel(panel: any) {
    this.isEdit = true;
    this.editPanelModal.title = 'Edit Panel';
    this.editPanelModal.show = true;
    this.initPanelForm(panel);
  }

  private showAddPanel() {
    this.isEdit = false;
    this.initPanelForm();
    this.editPanelModal.title = 'Add Panel';
    this.editPanelModal.show = true;
  }

  private addHost() {
    let control = <FormArray>this.panelForm.controls['HostInfos'];
    control.push(this.initHostInfo());
  }

  private copyHost(srcControl: any) {
    let host = JSON.parse(JSON.stringify(srcControl.value))
    let control = <FormArray>this.panelForm.controls['HostInfos'];
    control.push(this.initHostInfo(host));
  }

  private removeHost(i: number) {
    let control = <FormArray>this.panelForm.controls['HostInfos'];
    control.removeAt(i);
  }

  private addColumn() {
    let control = <FormArray>this.panelForm.controls['ColumnInfos'];
    control.push(this.initColumnInfo());
  }

  private removeColumn(i: number) {
    let control = <FormArray>this.panelForm.controls['ColumnInfos'];
    control.removeAt(i);
  }

  private saveGroup(form: any) {
    this.submitted = true;
    if (form.invalid) return;
    let data = JSON.parse(JSON.stringify(form.value));
    this.groupService.updateGroup(this.groupId, data)
      .then(res => {
        this.editGroupModal.show = false;
        this.getPanels(this.groupId);
        this.groupService.reload();
      })
      .catch(err => {
        messager.error(err);
      });
  }

  private savePanel(form: any) {
    this.submitted = true;
    if (form.invalid) return;
    if (form.value.HostInfos.length === 0) {
      messager.error('Host cannot be empty.');
      return;
    }
    let data = JSON.parse(JSON.stringify(form.value));
    data.GroupId = this.groupId;
    if (this.isEdit) {
      this.panelService.updatePanel(data.PanelId, data)
        .then(res => {
          this.getPanels(this.groupId);
          this.editPanelModal.show = false;
        })
        .catch(err => {
          messager.error(err);
        });
    } else {
      this.panelService.addPanel(data)
        .then(res => {
          this.getPanels(this.groupId);
          this.editPanelModal.show = false;
        })
        .catch(err => {
          messager.error(err);
        });
    }
  }

  private showDelGroupModal() {
    this.delGroupModal.show = true;
  }

  private delGroup() {
    this.groupService.deleteGroup(this.groupId)
      .then(res => {
        this.groupService.reload();
        this.router.navigate(['/']);
      })
      .catch(err => {
        messager.error(err)
      });
  }

  private showDelPanelModal(panel: any) {
    this.delPanelTarget = panel;
    this.delPanelModal.show = true;
  }

  private delPanel() {
    this.panelService.deletePanel(this.delPanelTarget.PanelId)
      .then(data => {
        this.getPanels(this.groupId);
      })
      .catch(err => {
        messager.error(err);
      });
  }
}