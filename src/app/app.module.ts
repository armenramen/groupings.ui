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
import { AddGroupItemComponent } from './components/add-group-item/add-group-item.component';
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

@NgModule({
  declarations: [
    AppComponent,
    GroupSelectComponent,
    AddGroupComponent,
    AddGroupItemComponent,
    GroupTableComponent,
    EditGroupComponent,
    GroupIconViewComponent
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
    MatGridListModule
  ],
  providers: [
    GroupingsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
