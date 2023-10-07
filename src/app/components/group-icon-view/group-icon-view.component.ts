import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { FileProperty, GroupFileDetail, TaskGrouping } from 'src/app/utilities/models/response-models';

@Component({
  selector: 'app-group-icon-view',
  templateUrl: './group-icon-view.component.html',
  styleUrls: ['./group-icon-view.component.scss']
})
export class GroupIconViewComponent implements OnInit {
  @Input() dataSource: any[] = [];
  @Input() selectedGroup!: TaskGrouping | null;
  selectedItem: any = null;
  editFormArray!: FormArray

  readonly XLSX_ICON_PATH = '../assets/img/excel.svg';

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

  onCardSelect(item: any, drawer: MatDrawer) {
    this.selectedItem = item;
    drawer.toggle();
  }

  getImage(file: GroupFileDetail) {
    if (file.extension === 'xlsx') {
      return this.XLSX_ICON_PATH;
    }

    return '';
  }

  getFileName(file: GroupFileDetail) {
    return `${file.name}.${file.extension}`;
  }

  onEditClick() {
    console.log(this.selectedItem);
    this.editFormArray = this.fb.array([]);
    this.selectedItem.files.forEach((detail: FileProperty) => {
      this.editFormArray.push(new FormControl(detail))
    })

    console.log(this.editFormArray)
  }

}
