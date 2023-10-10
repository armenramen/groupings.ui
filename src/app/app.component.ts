import { Component, OnInit } from '@angular/core';
import { Observable, Subject, catchError, concatMap, filter, finalize, map, mergeMap, of, share, startWith, switchMap, take, tap } from 'rxjs';
import { GroupingsService } from './services/groupings.service';
import { ProperyValueType, TaskGroupFiles, TaskGrouping } from './utilities/models/response-models';
import { MatDialog } from '@angular/material/dialog';
import { AddGroupComponent } from './components/add-group/add-group.component';
import { EditGroupComponent } from './components/edit-group/edit-group.component';
import { MatDrawer } from '@angular/material/sidenav';
import { AddFileComponent } from './components/add-file/add-file.component';
import { UserService } from './services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  get isLoggedIn() {
    return this.userService.userId !== '' && this.userService.userId !== null;
  }


  constructor(private groupService: GroupingsService,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.groupingList$ = this.groupService.getGroupingList(this.userService.userId);
    this.dataSource$ = this.fetchGroupDetailAndFiles();
    this.gridData$ = this.dataSource$.pipe(
      map(this.mapResponseToGridItems)
    )
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


    dialogRef.afterClosed().pipe(
      filter(event => event.type === 'submit'),
      mergeMap(group => {
        return this.groupService.updateGroup(this.userService.userId, group);
      }),
      catchError((error: any) => of({ error })))
      .subscribe(result => {
        if (result.error) {
          this.openErrorSnackBar()
          return;
        }

        this.snackBar.open('Group successfully updated', undefined, {
          duration: 2000
        })
      });
  }

  onSelectRow(selection: any) {
    this.selectedItems = selection
  }

  fetchGroupDetailAndFiles() {
    return this.selectedGroup$.pipe(
      tap(() => this.isLoading = true),
      switchMap((group: any) => this.groupService.getGroupDetail(this.userService.userId, group.id)),
      tap((group: any) => {
        if (this.selectedGroup) {
          this.selectedGroup['properties'] = group.properties
          console.log(this.selectedGroup)
        }
      }),
      switchMap((group: any) => this.groupService.getGroupItems(this.userService.userId, group.id)),
      tap(() => this.isLoading = false),
      share()
    );

  }

  private mapResponseToGridItems(res: TaskGroupFiles) {
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

  private openErrorSnackBar(errMessage = '') {
    this.snackBar.open(errMessage || 'An error occured. Please try again.', undefined, {
      duration: 2000
    })
  }


}
