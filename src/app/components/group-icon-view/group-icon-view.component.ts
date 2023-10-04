import { Component, Input, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Grouping } from 'src/app/utilities/models/response-models';

@Component({
  selector: 'app-group-icon-view',
  templateUrl: './group-icon-view.component.html',
  styleUrls: ['./group-icon-view.component.scss']
})
export class GroupIconViewComponent implements OnInit {
  @Input() dataSource: any[] = [];
  @Input() selectedGroup!: Grouping | null;
  selectedItem: any = null;


  constructor() { }

  ngOnInit() {
  }

  onCardSelect(item: any, drawer: MatDrawer) {
    this.selectedItem = item;
    console.log(this.selectedItem)
    drawer.toggle();
  }

}
