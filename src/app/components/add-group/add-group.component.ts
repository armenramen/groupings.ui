import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent implements OnInit {
  groupForm!: FormGroup;

  get detailsForms() {
    return this.groupForm.get('details') as FormArray
  }

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.groupForm = this.formBuilder.group({
      groupName: ['', [Validators.required]],
      details: this.formBuilder.array([
        this.formBuilder.group({
          propertyName: ['', [Validators.required]],
          type: ['text', Validators.required]
        })
      ])
    })

  }

  addProperty() {
    this.detailsForms.push(this.formBuilder.group({
      propertyName: ['', [Validators.required]],
      type: ['text', Validators.required]
    }))
  }

}
