import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.scss']
})
export class AddFileComponent implements OnInit {
  form!: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
