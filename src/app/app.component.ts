import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, concatMap, filter, finalize, map, mergeMap, of, share, startWith, switchMap, take, tap } from 'rxjs';
import { GroupingsService } from './services/groupings.service';
import { GroupFile, ProperyValueType, TaskGroupFiles, TaskGrouping } from './utilities/models/response-models';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddGroupComponent } from './components/add-group/add-group.component';
import { EditGroupComponent } from './components/edit-group/edit-group.component';
import { MatDrawer } from '@angular/material/sidenav';
import { AddFileComponent } from './components/add-file/add-file.component';
import { UserService } from './services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileService } from './services/file.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  groupingList$!: Observable<any>;
  getGroupingList$ = new BehaviorSubject<boolean>(false);
  groupList!: any[];
  dataSource$!: Observable<any>;
  gridData$!: Observable<any>;
  selectedGroup$ = new Subject();
  selectedGroup: TaskGrouping | null = null;
  isLoading = false;
  selectedItems: any[] = [];
  selectedItem: any = null;
  isEditMode = false;
  isEditLoading = false;
  valueType = ProperyValueType;
  viewMode = 'icon';
  groupFiles: GroupFile[] = [];
  searchValue = '';

  get isLoggedIn() {
    return this.userService.userId !== '' && this.userService.userId !== null;
  }


  constructor(private groupService: GroupingsService,
    private userService: UserService,
    private fileService: FileService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.userService.isLoggedIn$.subscribe(res => {
      if (res) {
        this.getGroupingList$.next(true);
        this.dataSource$ = this.fetchGroupDetailAndFiles();
        this.gridData$ = this.dataSource$.pipe(
          map(this.mapResponseToGridItems)
        )
      }
    });

    this.getGroupingList$.pipe(
      mergeMap(() => {
        return this.groupService.getGroupListWithProps(this.userService.userId)
      })).subscribe(list => {
        this.groupList = [...list]
      })
  }

  onGroupSelected(group: any) {
    this.selectedGroup = group;
    this.selectedGroup$.next(group);
  }

  onFileSelected(file: any, drawer: MatDrawer) {
    this.selectedItem = file;
    drawer.toggle();
  }

  onSelectRow(selection: any, drawer: MatDrawer) {
    const file = this.groupFiles.find(f => f.id === selection.id);
    this.onFileSelected(file, drawer);
  }


  openAddGroupModal() {
    const dialogRef = this.dialog.open(AddGroupComponent, {
      data: {
        userId: this.userService.userId
      },
      disableClose: true

    });
    this.newGroupModalClose(dialogRef)
  }

  private newGroupModalClose(dialogRef: MatDialogRef<any>) {
    dialogRef.afterClosed()
      .pipe(filter(e => e?.type))
      .subscribe(result => {
        this.isLoading = false;
        if (result.type === 'success') {
          this.openSuccessAlert('Group added successfully');
          // Reload currently selected group
        } else {
          this.openErrorAlert();
        }

      });
  }

  openUploadFileModal() {
    const dialogRef = this.dialog.open(AddFileComponent, {
      data: {
        groupId: this.selectedGroup?.taskGroupingId,
        userId: this.userService.userId
      },
      disableClose: true
    });
    this.handleUploadModalClose(dialogRef);
  }

  private handleUploadModalClose(dialogRef: MatDialogRef<any>) {
    dialogRef.afterClosed()
      .pipe(filter(e => e?.type))
      .subscribe(result => {
        // Reload currently selected group
        this.selectedGroup$.next(this.selectedGroup);

        if (result.type === 'success') {
          this.openSuccessAlert('File added successfully');
        } else {
          this.openErrorAlert();
        }

      });
  }

  openEditGroupModal() {
    const dialogRef = this.dialog.open(EditGroupComponent, {
      data: {
        userId: this.userService.userId,
        group: this.selectedGroup
      },
      disableClose: true
    });
    this.handleEditGroupModalClose(dialogRef);
  }

  handleEditGroupModalClose(dialogRef: MatDialogRef<any>) {
    dialogRef.afterClosed()
      .pipe(filter(e => e?.type))
      .subscribe(result => {
        if (result.type === 'success') {
          this.openSuccessAlert('Group updated successfully');
          this.getGroupingList$.next(true);
          console.log(result.value)
          // this.selectedGroup$.next(result.value)
          this.selectedGroup = result.value
        } else {
          this.openErrorAlert();
        }
      });

  }

  fetchGroupDetailAndFiles() {
    return this.selectedGroup$.pipe(
      tap(() => this.isLoading = true),
      switchMap((group: any) => this.groupService.getGroupItems(this.userService.userId, group.taskGroupingId)),
      tap(() => this.isLoading = false),
      tap(res => this.groupFiles = res['files']),
      share()
    );
  }

  closeDrawer(drawer: MatDrawer) {
    this.isEditMode = false;
    drawer.close();
  }

  saveFile(formValue: any) {
    this.isEditLoading = true;
    formValue.detail.userTaskGroupingId = formValue.detail.userTaskGroupingId || this.selectedGroup?.taskGroupingId;
    this.fileService.saveUserFile({
      userId: this.userService.userId,
      detail: formValue.detail,
      userFileId: formValue.id,
      properties: formValue.properties
    }).pipe(catchError(error => of({ error })))
      .subscribe((res: any) => {
        this.isEditLoading = false;

        if (res.error) {
          this.isEditMode = true;
          this.openErrorAlert();
          console.log(res)
          return;
        }

        this.isEditMode = false;
        this.openSuccessAlert('File successfully updated');
      })
  }

  downloadFile(file: GroupFile) {
    this.fileService.downloadFile({
      userId: this.userService.userId,
      taskGroupingId: this.selectedGroup?.taskGroupingId,
      userFileId: file.id
    }).pipe(catchError(error => of({ error })))
      .subscribe((res: any) => {
        if (res.error) {
          this.openErrorAlert();
          return;
        }

        this.openSuccessAlert('File is being downloaded.')
      });
  }

  deleteFile(file: any, drawer: MatDrawer) {
    drawer.close();
    this.isLoading = true
    this.fileService.deleteFile({
      userId: this.userService.userId,
      taskGroupingId: this.selectedGroup?.taskGroupingId,
      userFileId: file.id
    }).pipe(catchError(error => of({ error })))
      .subscribe((res: any) => {
        this.isLoading = false
        if (res.error) {
          this.openErrorAlert();
          return;
        }

        this.openSuccessAlert('File has been deleted');
        this.selectedGroup$.next(this.selectedGroup);
      });
  }

  onSearchChange(value: string) {
  }

  onLogoutClick() {
    this.userService.logout();
  }

  private mapResponseToGridItems(res: TaskGroupFiles) {
    return res?.files?.map(({ id, properties, detail }) => {
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

  private openErrorAlert(errMessage = '') {
    this.snackBar.open(errMessage || 'An error occured. Please try again.', undefined, {
      duration: 2000
    })
  }

  private openSuccessAlert(message = '') {
    this.snackBar.open(message, undefined, {
      duration: 2000
    })
  }

}
