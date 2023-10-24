import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-group-select',
  templateUrl: './group-select.component.html',
  styleUrls: ['./group-select.component.scss']
})
export class GroupSelectComponent implements OnInit {
  @Input() groupingList: any[] = [];
  @Input() selectedGroup: any;
  @Output() groupSelected = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onSelectGroup(group: any) {
    this.selectedGroup = group;
    this.groupSelected.emit(group);
  }

  groupId(index: number, group: any) {
    return group.id;
  }

}
