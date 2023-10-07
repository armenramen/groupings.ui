import { Component, OnInit } from '@angular/core';
import { Observable, Subject, finalize, map, of, share, startWith, switchMap, take, tap } from 'rxjs';
import { GroupingsService } from './services/groupings.service';
import { ProperyValueType, TaskGroupFiles, TaskGrouping } from './utilities/models/response-models';
import { MatDialog } from '@angular/material/dialog';
import { AddGroupComponent } from './components/add-group/add-group.component';
import { EditGroupComponent } from './components/edit-group/edit-group.component';
import { MatDrawer } from '@angular/material/sidenav';
import { AddFileComponent } from './components/add-file/add-file.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  groupingList$!: Observable<any>;
  dataSource$!: Observable<any>;
  gridData$!: Observable<any>;
  selectedGroup$ = new Subject();
  selectedGroup: TaskGrouping | null = null;
  isLoading = false;
  selectedItems: any[] = [];
  selectedItem: any = null;

  constructor(private service: GroupingsService,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.groupingList$ = this.service.getGroupingList();

    this.dataSource$ = this.selectedGroup$.pipe(
      tap(() => this.isLoading = true),
      switchMap(group => this.service.getGroupItems(group)),
      tap(() => this.isLoading = false),
      share()
    )

    this.gridData$ = this.dataSource$.pipe(
      map(this.mapResponseToGridItems),
      tap(res => console.log(res))
    )
  }

  mapResponseToGridItems(res: TaskGroupFiles) {
    return res.files.map(({ id, properties, detail }) => {
      // Transform details array into an object
      const obj: any = {};
      properties.forEach(d => {
        if (d.type === ProperyValueType.Boolean) {
          obj[d.name] = d.value ? 'Yes' : 'No';
          return;
        }
        obj[d.name] = d.value
      })
      return {
        id,
        fileName: `${detail?.name}.${detail?.extension}`,
        fileType: detail?.extension,
        ...obj
      }
    })

  }

  onGroupSelected(group: any) {
    this.selectedGroup = group;
    this.selectedGroup$.next(group);
  }

  openAddGroupModal() {
    const dialogRef = this.dialog.open(AddGroupComponent, {
      disableClose: true

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result:`, result);

    });
  }

  openUploadFileModal() {
    const dialogRef = this.dialog.open(AddFileComponent, {
      disableClose: true

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result:`, result);

    });
  }

  openEditGroupModal() {
    const dialogRef = this.dialog.open(EditGroupComponent, {
      data: {
        group: this.selectedGroup
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result:`, result);
    });
  }

  onSelectRow(selection: any) {
    this.selectedItems = selection
  }



}
