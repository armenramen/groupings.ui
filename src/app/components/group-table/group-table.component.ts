import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TaskGrouping } from 'src/app/utilities/models/response-models';

@Component({
  selector: 'app-group-table',
  templateUrl: './group-table.component.html',
  styleUrls: ['./group-table.component.scss']
})
export class GroupTableComponent implements OnInit {
  @Input() dataSource: any[] = [];
  @Input() selectedGroup!: TaskGrouping | null;
  @Output() selectionChanged = new EventEmitter();

  selection = new SelectionModel<any>(true, []);

  get displayedColumns() {
    return [
      'select',
      ...this.columns.map(c => c.columnDef),
      'download'
    ];
  }

  get columns(): any[] {
    const cols = [
      {
        columnDef: 'fileName',
        header: 'File Name',
        cell: (item: any) => item['fileName']
      }
    ];

    this.selectedGroup?.properties.forEach(prop => {
      cols.push({
        columnDef: prop.name,
        header: prop.name,
        cell: (item: any) => item[prop.name]
      })
    })

    return cols;
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

  toggleRow(row: any) {
    this.selection.toggle(row);
    this.selectionChanged.emit(this.selection.selected);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.selectionChanged.emit(this.selection.selected);
      return;
    }

    this.selection.select(...this.dataSource);
    this.selectionChanged.emit(this.selection.selected);

  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

}
