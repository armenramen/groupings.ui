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
  @Input() isEditMode = false;
  @Input() isLoading = false;

  @Output() updateFile = new EventEmitter();
  selectedItem: any = null;
  editFormGroup!: FormGroup;
  valueType = ProperyValueType;


  get propertiesFormArray() {
    return this.editFormGroup.get('properties') as FormArray;
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.editFormGroup = this.fb.group({
      id: [''],
      detail: [''],
      properties: this.fb.array([])
    }, {
      disabled: this.isLoading
    })
  }

  private patchFormValues(val: any) {
    this.editFormGroup.patchValue({
      id: val.id,
      detail: val.detail,
    });

    val.properties.forEach((prop: FileProperty) => {
      this.propertiesFormArray.push(this.fb.group({
        id: [prop.id],
        name: [prop.name, Validators.required],
        value: [prop.value],
        type: [prop.type]
      }))
    });
  }

  onCardSelect(item: any, drawer: MatDrawer) {
    this.selectedItem = item;
    drawer.toggle();
  }

  getImage(file: GroupFileDetail) {
    const map = FileIconMap as any;
    return map[file.extension];
  }

  getFileName(file: GroupFileDetail) {
    return `${file.name}.${file.extension}`;
  }

  onEditClick() {
    this.isEditMode = true;
    console.log(this.selectedItem);
    this.patchFormValues(this.selectedItem);
    console.log(this.editFormGroup);
  }

  onCancelEdit() {
    this.isEditMode = false;
    this.propertiesFormArray.clear();
  }

  onClickSave(formValue: any) {
    this.updateFile.emit(formValue);
  }

}
