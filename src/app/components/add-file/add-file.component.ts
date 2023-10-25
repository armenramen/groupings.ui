import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, mergeMap, of, tap } from 'rxjs';
import { FileService } from 'src/app/services/file.service';
import { ProperyValueType } from 'src/app/utilities/models/response-models';

@Component({
  selector: 'app-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.scss']
})
export class AddFileComponent implements OnInit {
  @Input() groupId = '';
  form!: FormGroup;
  isUploading = false;
  isSaving = false;
  valueType = ProperyValueType;

  constructor(private fb: FormBuilder,
    private fileService: FileService,
    private dialogRef: MatDialogRef<AddFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { groupId: string, userId: string }
  ) { }

  get fileFormControl(): FormControl {
    return this.form.get('file') as FormControl;
  }

  get propFormArray(): FormArray {
    return this.form.get('properties') as FormArray;
  }

  ngOnInit() {
    this.buildForm();

    this.uploadFile$.subscribe((res: any) => {
      if (res) {
        res.recommendedProperties.forEach((prop: any) => {
          this.propFormArray.push(this.fb.group({
            id: [prop.id],
            name: [{ value: prop.name, disabled: true }],
            value: [prop.recommended, [Validators.required]],
            type: [prop.type]
          }));
        });
      }
    });
  }

  buildForm() {
    this.form = this.fb.group({
      id: [''],
      file: ['', Validators.required],
      detail: [''],
      properties: this.fb.array([])
    });
  }

  saveFile({ id, detail, properties }: any) {
    this.isSaving = true;
    this.fileService.saveUserFile({
      detail,
      properties,
      userFileId: id,
      userId: this.data.userId,
      taskGroupingId: this.data.groupId

    })
      .pipe(catchError(error => of({ error })))
      .subscribe((res: any) => {
        this.isSaving = false;
        if (res.error) {
          this.dialogRef.close({ type: 'error' });
          return;
        }
        this.dialogRef.close({ type: 'success', value: res });
      })
  }

  get uploadFile$() {
    return this.fileFormControl.valueChanges.pipe(
      tap(file => {
        this.propFormArray.clear();
      }),
      filter(file => !!file),
      map((file: File) => {
        this.isUploading = true;
        const formData = new FormData();
        formData.append('file', file);
        return formData;
      }),
      mergeMap((formData: FormData) => {
        return this.fileService.uploadUserFile({
          file: formData,
          userId: this.data.userId,
          taskGroupingId: this.data.groupId
        }).pipe(catchError(err => {
          console.log(err)
          return of(null);
        }));
      }),
      tap((res: any) => {
        if (res) {
          this.form.get('detail')?.setValue(res.detail);
          this.form.get('id')?.setValue(res.id);
        }
      }),
      tap(() => this.isUploading = false),
    )
  }

}
