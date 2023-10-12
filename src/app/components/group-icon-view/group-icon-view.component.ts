import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { FileIconMap } from 'src/app/utilities/enum';
import { FileProperty, GroupFileDetail, ProperyValueType, TaskGrouping } from 'src/app/utilities/models/response-models';

@Component({
  selector: 'app-group-icon-view',
  templateUrl: './group-icon-view.component.html',
  styleUrls: ['./group-icon-view.component.scss']
})
export class GroupIconViewComponent implements OnInit {
  @Input() dataSource: any[] = [];
  @Input() selectedGroup!: TaskGrouping | null;


  @Output() updateFile = new EventEmitter();
  @Output() itemSelected = new EventEmitter();
  selectedItem: any = null;
  valueType = ProperyValueType;

  constructor() { }

  ngOnInit() {
  }

  getFileName(file: GroupFileDetail) {
    return `${file.name}.${file.extension}`;
  }


  onCardSelect(item: any) {
    this.selectedItem = item;
    this.itemSelected.emit(this.selectedItem)
  }

  getImage(file: GroupFileDetail) {
    const map = FileIconMap as any;
    return map[file.extension];
  }
}
