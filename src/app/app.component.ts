import { Component, OnInit } from '@angular/core';
import { Observable, Subject, finalize, map, of, share, startWith, switchMap, take, tap } from 'rxjs';
import { GroupingsService } from './services/groupings.service';
import { GroupItemResponse, GroupItem, Detail } from './utilities/models/response-models';
import { MatDialog } from '@angular/material/dialog';
import { AddGroupComponent } from './components/add-group/add-group.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  groupingList$!: Observable<any>;
  dataSource$!: Observable<any>;
  selectedGroup$ = new Subject();
  selectedGroupName = '';
  isLoading = false;

  constructor(private service: GroupingsService,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.groupingList$ = this.service.getGroupingList();

    this.dataSource$ = this.selectedGroup$.pipe(
      tap(() => this.isLoading = true),
      switchMap(group => this.service.getGroupItems(group)),
      map(this.mapResponseToGridItems),
      tap(() => this.isLoading = false),
      share()
    )
  }

  mapResponseToGridItems(res: GroupItemResponse) {
    return res.items.map(({ id, file, details }) => {
      // Transform details array into an object
      const obj: any = {};
      details.forEach(d => {
        if (typeof d.value === 'boolean') {
          obj[d.property] = d.value ? 'Yes' : 'No';
          return;
        }
        obj[d.property] = d.value
      })
      return {
        id,
        fileName: `${file.name}.${file.extension}`,
        ...obj
      }
    })

  }

  onGroupSelected(group: any) {
    this.selectedGroupName = group.name;
    this.selectedGroup$.next(group);
  }

  opanAddGroupModal() {
    const dialogRef = this.dialog.open(AddGroupComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


}
