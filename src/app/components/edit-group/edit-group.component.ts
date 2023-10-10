import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, of } from 'rxjs';
import { GroupingsService } from 'src/app/services/groupings.service';
import { ProperyValueType, TaskGrouping } from 'src/app/utilities/models/response-models';


@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent implements OnInit {
  @Input() group: TaskGrouping | null = null;

  formGroup!: FormGroup

  get detailsForms() {
    return this.formGroup.get('properties') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private groupService: GroupingsService,
    private dialogRef: MatDialogRef<EditGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { group: TaskGrouping, userId: string }
  ) { }

  ngOnInit() {
    this.group = this.data.group;
    this.formGroup = this.fb.group({
      groupId: [this.group.id],
      groupName: [this.group?.name],
      properties: this.fb.array([])
    });
    this.group?.properties.forEach((prop) => {
      this.addProperty(prop);
    })
  }

  addProperty(val?: any) {
    this.detailsForms.push(this.fb.group({
      name: [val?.name || '', [Validators.required]],
      type: [val?.type || ProperyValueType.String, Validators.required],
      id: [val?.id || '']
    }))
  }

  deleteProperty(index: number) {
    this.detailsForms.removeAt(index);
  }

  saveGroup(formValue: any) {
    this.groupService.updateGroup(this.data.userId, formValue)
      .pipe(catchError(error => of({ error })))
      .subscribe(res => {
        if (res.error) {
          this.dialogRef.close({ type: 'error' });
          return;
        }

        this.dialogRef.close({ type: 'success', value: res });
      })
  }


}
