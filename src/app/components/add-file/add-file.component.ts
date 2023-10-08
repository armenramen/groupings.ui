import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FileInput } from 'ngx-material-file-input';
import { Observable, catchError, filter, map, mergeMap, of, tap } from 'rxjs';
import { FileService } from 'src/app/services/file.service';
import { GroupingsService } from 'src/app/services/groupings.service';
import { ProperyValueType } from 'src/app/utilities/models/response-models';

@Component({
  selector: 'app-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.scss']
})
export class AddFileComponent implements OnInit {
  form!: FormGroup;
  isUploading = false;
  valueType = ProperyValueType;

  constructor(private fb: FormBuilder, private fileService: FileService) { }

  get fileFormControl(): FormControl {
    return this.form.get('file') as FormControl;
  }

  get propFormArray(): FormArray {
    return this.form.get('properties') as FormArray;
  }

  ngOnInit() {
    this.buildForm();

    this.uploadFile$.subscribe((res: any) => {
      console.log(res);
      res.recommendedProperties.forEach((prop: any) => {
        this.propFormArray.push(this.fb.group({
          id: [prop.id],
          name: [{ value: prop.name, disabled: true }],
          value: [prop.recommended],
          type: [prop.type]
        }));
      });
    });



  }

  buildForm() {
    this.form = this.fb.group({
      file: ['', Validators.required],
      properties: this.fb.array([])
    });
  }

  get uploadFile$() {
    return this.fileFormControl.valueChanges.pipe(
      filter((fileList: FileInput) => !!fileList),
      map((fileList: FileInput) => {
        this.isUploading = true;
        const formData = new FormData();
        const file = fileList.files[0];
        formData.append(file.name, file);
        return formData;
      }),
      mergeMap((formData: FormData) => {
        return this.fileService.uploadUserFile({
          file: formData,
          userId: 'test',
          taskGroupingId: 'test',
          userFileId: 'test',
        });
      }),
      tap(() => this.isUploading = false),
      catchError(err => {
        console.log(err)
        return of(null);
      })
    )
  }

}
