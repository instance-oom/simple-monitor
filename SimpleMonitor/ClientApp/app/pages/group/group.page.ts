import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { CustomHttpService, GroupService, PanelService } from './../../services';

declare var messager: any;

@Component({
  selector: 'monitor-group',
  styleUrls: ['./group.css'],
  templateUrl: './group.html'
})

export class GroupPage {

  groupId: string;
  group: any;
  isGetingData: boolean;
  refreshInterval: any;
  refreshTime: number = 0;

  submitted: boolean;
  panelForm: FormGroup;
  groupForm: FormGroup;

  isEdit: boolean;
  editPanelModal: any = {};
  delPanelModal: any = {};
  delPanelTarget: any;
  delGroupModal: any = {};
  editGroupModal: any = {};

  constructor(
    private _http: CustomHttpService,
    private _groupService: GroupService,
    private _panelService: PanelService,
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router) {
  }

  ngOnInit() {
    this._route.params.forEach(params => {
      this.groupId = params["groupId"];
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

  getPanels(groupId: string) {
    this._groupService.getById(groupId)
      .then(data => {
        this.group = data;
        this.getData();
      })
      .catch(err => {
        messager.error(err);
        this._router.navigate(['/']);
      });
  }

  getData() {
    for (let i = 0; i < this.group.PanelInfos.length; i++) {
      let panel = this.group.PanelInfos[i];
      panel.isDone = 0;
      let columns = this.group.PanelInfos[i].ColumnInfos;
      for (let j = 0; j < panel.HostInfos.length; j++) {
        let host = panel.HostInfos[j];
        ((url, panelIndex, hostIndex, columns) => {
          this._http.get(url, { disableLoading: true })
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

  initPanelForm(panel?: any) {
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

  initGroupForm(group: any) {
    this.submitted = false;
    this.groupForm = this._fb.group({
      Name: [group.Name || '', [Validators.required, Validators.minLength(2)]],
      Description: [group.Description || '', [Validators.required, Validators.maxLength(200)]],
      Icon: [group.Icon || '']
    });
  }

  initHostInfo(host?: any): FormGroup {
    host = host || {}
    return this._fb.group({
      DisplayName: [host.DisplayName || '', [Validators.required]],
      Url: [host.Url || '', [Validators.required, Validators.minLength(2)]]
    });
  }

  initColumnInfo(column?: any): FormGroup {
    column = column || {};
    return this._fb.group({
      DisplayName: [column.DisplayName || '', [Validators.required, Validators.maxLength(20)]],
      Key: [column.Key || '', [Validators.required, Validators.maxLength(100)]]
    });
  }

  setRefreshTime(interval: number) {
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

  manualRefresh() {
    if (this.refreshTime === 0) this.getData();
  }

  getRefreshDropdownText(): string {
    if (this.refreshTime === 0) return 'Manual Refresh';
    if (this.refreshTime >= 60) {
      return `Every ${this.refreshTime / 60} minute(s)`
    } else {
      return `Every ${this.refreshTime} seconds`
    }
  }

  showEditGroup() {
    this.editGroupModal.show = true;
    this.initGroupForm(this.group);
  }

  showEditPanel(panel: any) {
    this.isEdit = true;
    this.editPanelModal.title = 'Edit Panel';
    this.editPanelModal.show = true;
    this.initPanelForm(panel);
  }

  showAddPanel() {
    this.isEdit = false;
    this.initPanelForm();
    this.editPanelModal.title = 'Add Panel';
    this.editPanelModal.show = true;
  }

  addHost() {
    let control = <FormArray>this.panelForm.controls['HostInfos'];
    control.push(this.initHostInfo());
  }

  copyHost(srcControl: any) {
    let host = JSON.parse(JSON.stringify(srcControl.value))
    let control = <FormArray>this.panelForm.controls['HostInfos'];
    control.push(this.initHostInfo(host));
  }

  removeHost(i: number) {
    let control = <FormArray>this.panelForm.controls['HostInfos'];
    control.removeAt(i);
  }

  addColumn() {
    let control = <FormArray>this.panelForm.controls['ColumnInfos'];
    control.push(this.initColumnInfo());
  }

  removeColumn(i: number) {
    let control = <FormArray>this.panelForm.controls['ColumnInfos'];
    control.removeAt(i);
  }

  showDelGroupModal() {
    this.delGroupModal.show = true;
  }

  delGroup() {
    this._groupService.deleteGroup(this.groupId)
      .then(res => {
        this._groupService.reload();
        this._router.navigate(['/']);
      })
      .catch(err => {
        messager.error(err)
      });
  }

  showDelPanelModal(panel: any) {
    this.delPanelTarget = panel;
    this.delPanelModal.show = true;
  }

  delPanel() {
    this._panelService.deletePanel(this.delPanelTarget.PanelId)
      .then(data => {
        this.getPanels(this.groupId);
      })
      .catch(err => {
        messager.error(err);
      });
  }

  saveGroup(form: any) {
    this.submitted = true;
    if (form.invalid) return;
    let data = JSON.parse(JSON.stringify(form.value));
    this._groupService.updateGroup(this.groupId, data)
      .then(res => {
        this.editGroupModal.show = false;
        this.getPanels(this.groupId);
        this._groupService.reload();
      })
      .catch(err => {
        messager.error(err);
      });
  }

  savePanel(form: any) {
    this.submitted = true;
    if (form.invalid) return;
    if (form.value.HostInfos.length === 0) {
      messager.error('Host cannot be empty.');
      return;
    }
    let data = JSON.parse(JSON.stringify(form.value));
    data.GroupId = this.groupId;
    if (this.isEdit) {
      this._panelService.updatePanel(data.PanelId, data)
        .then(res => {
          this.getPanels(this.groupId);
          this.editPanelModal.show = false;
        })
        .catch(err => {
          messager.error(err);
        });
    } else {
      this._panelService.addPanel(data)
        .then(res => {
          this.getPanels(this.groupId);
          this.editPanelModal.show = false;
        })
        .catch(err => {
          messager.error(err);
        });
    }
  }
}