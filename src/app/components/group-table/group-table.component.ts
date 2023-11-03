import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ProperyValueType, TaskGroupFiles, TaskGrouping } from 'src/app/utilities/models/response-models';

@Component({
  selector: 'app-group-table',
  templateUrl: './group-table.component.html',
  styleUrls: ['./group-table.component.scss']
})
export class GroupTableComponent implements OnInit {
  @Input() dataSource: any[] = [];
  @Input() searchValue!: string;
  @Input() selectedGroup!: TaskGrouping | null;
  @Output() selectionChanged = new EventEmitter();

  selection = new SelectionModel<any>(true, []);

  get displayedColumns() {
    return [
      ...this.columns.map(c => c.columnDef),
      // 'download'
    ];
  }

  get filteredFiles() {
    if (!this.searchValue.length) {
      return this.dataSource;
    }

    return this.dataSource.filter((f: any) => f.fileName.toLowerCase().includes(this.searchValue.toLowerCase()))
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

  toggleRow(row: any) {
    this.selection.toggle(row);
    this.selectionChanged.emit(row);
  }

}
