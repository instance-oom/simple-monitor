import { Component, OnInit } from '@angular/core';
import { GroupService, PanelService } from './../../../services';

@Component({
  selector: 'panel-add',
  templateUrl: './add.html',
  styleUrls: ['./add.css']
})
export class PanelAddPage implements OnInit {
  constructor(
    private groupService: GroupService,
    private panelService: PanelService) {

  }

  ngOnInit() { }
}