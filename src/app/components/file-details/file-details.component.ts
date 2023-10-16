import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileProperty, GroupFile, GroupFileDetail, ProperyValueType } from 'src/app/utilities/models/response-models';

@Component({
  selector: 'app-file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.scss']
})
export class FileDetailsComponent implements OnInit {
  @Input() selectedItem: GroupFile | null = null;
  @Input() isEditMode = false;
  @Output() isEditModeChange = new EventEmitter<boolean>();
  @Input() isLoading = false;
  @Output() downloadClicked = new EventEmitter();
  @Output() deleteClicked = new EventEmitter();
  @Output() updateFile = new EventEmitter();

  editFormGroup!: FormGroup;
  valueType = ProperyValueType;

  get propertiesFormArray() {
    return this.editFormGroup.get('properties') as FormArray;
  }

  get isSaveDisabled() {
    return this.isLoading || this.editFormGroup.invalid || !this.editFormGroup.dirty;
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  getFileName(file: GroupFileDetail) {
    return `${file.name}.${file.extension}`;
  }

  onEditClick() {
    this.isEditModeChange.emit(true);
    this.patchFormValues(this.selectedItem);
  }


  onCancelEdit() {
    this.isEditModeChange.emit(false);
    this.propertiesFormArray.clear();
    this.editFormGroup.reset();
  }

  onClickSave(formValue: any) {
    this.updateFile.emit(formValue);
  }

  private patchFormValues(val: any) {
    this.editFormGroup.patchValue({
      id: val.id,
      detail: val.detail,
    });

    val.properties.forEach((prop: FileProperty) => {
      this.propertiesFormArray.push(this.fb.group({
        id: [prop.id],
        name: [prop.name],
        value: [prop.value, Validators.required],
        type: [prop.type]
      }))
    });
  }

  private buildForm() {
    this.editFormGroup = this.fb.group({
      id: [''],
      detail: [''],
      properties: this.fb.array([])
    });
  }

}
