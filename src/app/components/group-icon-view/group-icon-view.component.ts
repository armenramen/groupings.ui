import { Component, Input, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { GroupFile, Grouping } from 'src/app/utilities/models/response-models';

@Component({
  selector: 'app-group-icon-view',
  templateUrl: './group-icon-view.component.html',
  styleUrls: ['./group-icon-view.component.scss']
})
export class GroupIconViewComponent implements OnInit {
  @Input() dataSource: any[] = [];
  @Input() selectedGroup!: Grouping | null;
  selectedItem: any = null;

  readonly XLSX_ICON_PATH = '../assets/img/excel.svg';

  constructor() { }

  ngOnInit() {
  }

  onCardSelect(item: any, drawer: MatDrawer) {
    this.selectedItem = item;
    console.log(this.selectedItem)
    drawer.toggle();
  }

  getImage(file: GroupFile) {
    if (file.extension === 'xlsx') {
      return this.XLSX_ICON_PATH;
    }

    return '';
  }

  getFileName(file: GroupFile) {

    return `${file.name} - ${file.extension}`
  }

}
