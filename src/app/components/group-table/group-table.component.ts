import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-group-table',
  templateUrl: './group-table.component.html',
  styleUrls: ['./group-table.component.scss']
})
export class GroupTableComponent implements OnInit {
  @Input() dataSource: any[] = [];

  selection = new SelectionModel<any>(true, []);

  get displayedColumns() {
    return [
      'select',
      ...this.columns.map(c => c.columnDef),
      'download'
    ];
  }

  get columns(): any[] {
    const item = this.dataSource.length ? this.dataSource[0] : {}
    return Object.keys(item)
      .filter(el => el !== 'id')
      .map(prop => {
        return {
          columnDef: prop,
          header: prop === 'fileName' ? 'File Name' : prop,
          cell: (item: any) => item[prop]
        }
      })
  }



  constructor() { }

  ngOnInit() {
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

}
