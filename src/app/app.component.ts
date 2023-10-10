import { Component, OnInit } from '@angular/core';
import { Observable, Subject, catchError, concatMap, filter, finalize, map, mergeMap, of, share, startWith, switchMap, take, tap } from 'rxjs';
import { GroupingsService } from './services/groupings.service';
import { ProperyValueType, TaskGroupFiles, TaskGrouping } from './utilities/models/response-models';
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
  dataSource$!: Observable<any>;
  gridData$!: Observable<any>;
  selectedGroup$ = new Subject();
  selectedGroup: TaskGrouping | null = null;
  isLoading = false;
  selectedItems: any[] = [];
  selectedItem: any = null;
  iconViewEditMode = false;
  isEditLoading = false;

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
    this.groupingList$ = this.groupService.getGroupListWithProps(this.userService.userId);
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
      data: {
        groupId: this.selectedGroup?.id,
        userId: this.userService.userId
      },
      disableClose: true
    });
    this.handleUploadModalClose(dialogRef);
  }

  handleUploadModalClose(dialogRef: MatDialogRef<any>) {
    dialogRef.afterClosed()
      .pipe(filter(e => e?.type))
      .subscribe(result => {
        if (result.type === 'success') {
          this.openSuccessToast('File added successfully');
          // Reload currently selected group
          this.selectedGroup$.next(this.selectedGroup);
        } else {
          this.openErrorSnackBar();
        }

      });
  }

  openEditGroupModal() {
    const dialogRef = this.dialog.open(EditGroupComponent, {
      data: {
        group: this.selectedGroup,
        userId: this.userService.userId
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
          this.openSuccessToast('Group updated successfully');
        } else {
          this.openErrorSnackBar();
        }
      });

  }

  onSelectRow(selection: any) {
    this.selectedItems = selection
  }

  saveFile(formValue: any) {
    this.isEditLoading = true;
    this.fileService.saveUserFile({
      userId: this.userService.userId,
      detail: formValue.detail,
      userFileId: formValue.id,
      properties: formValue.properties
    }).pipe(catchError(error => of({ error })))
      .subscribe((res: any) => {
        this.isEditLoading = false;
        this.iconViewEditMode = false;

        if (res.error) {
          this.openErrorSnackBar();
          return;
        }

        this.openSuccessToast('File successfully updated');
      })
  }

  fetchGroupDetailAndFiles() {
    return this.selectedGroup$.pipe(
      tap(() => this.isLoading = true),
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

  private openSuccessToast(message = '') {
    this.snackBar.open(message, undefined, {
      duration: 2000
    })
  }


}
