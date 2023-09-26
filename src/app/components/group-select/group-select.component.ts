import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-group-select',
  templateUrl: './group-select.component.html',
  styleUrls: ['./group-select.component.scss']
})
export class GroupSelectComponent implements OnInit {
  @Input() groupingList: any[] = [];
  @Output() groupSelected = new EventEmitter();
  grouping = 'Select group'

  constructor() { }

  ngOnInit() {
  }

  selectGroup(group: any) {
    this.grouping = group.name
    this.groupSelected.emit(group);
  }

}
