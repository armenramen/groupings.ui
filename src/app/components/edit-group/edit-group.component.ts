import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupFile, ProperyValueType, TaskGrouping } from 'src/app/utilities/models/response-models';


@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent implements OnInit, OnChanges {
  @Input() group: TaskGrouping | null = null;

  formGroup!: FormGroup

  get detailsForms() {
    return this.formGroup.get('details') as FormArray;
  }

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: { group: TaskGrouping }) { }

  ngOnInit() {
    this.group = this.data.group;
    this.formGroup = this.fb.group({
      groupName: [this.group?.name],
      details: this.fb.array([])
    });
    this.group?.properties.forEach((prop) => {
      this.addProperty(prop)
    })

    console.log(this.group);
    console.log(this.formGroup);

  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  addProperty(val?: any) {
    this.detailsForms.push(this.fb.group({
      propertyName: [val?.name || '', [Validators.required]],
      type: [val?.type || ProperyValueType.String, Validators.required]
    }))
  }


}
