import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, of } from 'rxjs';
import { GroupingsService } from 'src/app/services/groupings.service';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent implements OnInit {
  groupForm!: FormGroup;
  isSaving = false;
  hasSavedGroupName = false;

  get detailsForms() {
    return this.groupForm.get('properties') as FormArray
  }

  constructor(private formBuilder: FormBuilder,
    private groupingService: GroupingsService,
    private dialogRef: MatDialogRef<AddGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: string }) { }

  ngOnInit() {
    this.groupForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      taskGroupingId: [''],
      properties: this.formBuilder.array([])
    })

  }

  addProperty() {
    this.detailsForms.push(this.formBuilder.group({
      propertyName: ['', [Validators.required]],
      type: ['text', Validators.required]
    }))
  }

  saveNewGroup() {
    this.isSaving = true;
    const formValues = this.groupForm.value;

    this.groupingService.saveGroup(
      this.data.userId,
      formValues
    )
      .pipe(catchError(error => of({ error })))
      .subscribe((res: any) => {
        this.isSaving = false;
        if (res.error || !res.isSuccesful) {
          return;
        }

        this.hasSavedGroupName = true;
        this.groupForm.get('taskGroupingId')?.setValue(res.taskGroupingId);
        
      })
  }

  updateGroup() {
    this.isSaving = true;
    const formValues = this.groupForm.value;

    this.groupingService.saveGroup(
      this.data.userId,
      formValues
    )
      .pipe(catchError(error => of({ error })))
      .subscribe((res: any) => {
        this.isSaving = false;
        if (res.error || !res.isSuccesful) {
          this.dialogRef.close({ type: 'error' });
          return;
        }
        this.dialogRef.close({ type: 'success', value: res });
      })
  }

}
