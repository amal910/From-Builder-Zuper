import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { AppComponent } from './app.component';
import { LeftPaneComponent } from './components/left-pane/left-pane.component';
import { MiddlePaneComponent } from './components/middle-pane/middle-pane.component';
import { RightPaneComponent } from './components/right-pane/right-pane.component';
import { RightDrawerComponent } from './components/right-drawer/right-drawer.component';
import { FieldGroupDialogComponent } from './components/field-group-dialog/field-group-dialog.component';
import { FormElementComponent } from './components/form-element/form-element.component';
import { FieldPropertyModalComponent } from './components/field-property-modal/field-property-modal.component';
import { StorageService } from './services/storage.service';
import { FieldGroupService } from './services/field-group.service';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    DragDropModule,
    AppComponent,
    LeftPaneComponent,
    MiddlePaneComponent,
    RightPaneComponent,
    RightDrawerComponent,
    FieldGroupDialogComponent,
    FormElementComponent,
    FieldPropertyModalComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSnackBarModule,
    MatMenuModule,
    MatChipsModule
  ],
  providers: [
    StorageService,
    FieldGroupService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
