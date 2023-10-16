import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GroupSelectComponent } from './components/group-select/group-select.component';
import { GroupingsService } from './services/groupings.service';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { AddGroupComponent } from './components/add-group/add-group.component';
import { GroupTableComponent } from './components/group-table/group-table.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { EditGroupComponent } from './components/edit-group/edit-group.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { GroupIconViewComponent } from './components/group-icon-view/group-icon-view.component';
import { AddFileComponent } from './components/add-file/add-file.component';
import { HttpClientModule } from '@angular/common/http';
import { FileService } from './services/file.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserService } from './services/user.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FileDetailsComponent } from './components/file-details/file-details.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FileUploadComponent } from './components/file-upload/file-upload.component';

@NgModule({
  declarations: [
    AppComponent,
    GroupSelectComponent,
    AddGroupComponent,
    GroupTableComponent,
    EditGroupComponent,
    GroupIconViewComponent,
    AddFileComponent,
    UserLoginComponent,
    FileDetailsComponent,
    FileUploadComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    MatSidenavModule,
    MatDividerModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatCardModule,
    MatGridListModule,
    HttpClientModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule
  ],
  providers: [
    GroupingsService,
    FileService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
