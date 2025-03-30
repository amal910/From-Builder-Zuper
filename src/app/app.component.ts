import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FieldGroupService } from './services/field-group.service';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { LeftPaneComponent } from './components/left-pane/left-pane.component';
import { MiddlePaneComponent } from './components/middle-pane/middle-pane.component';
import { RightPaneComponent } from './components/right-pane/right-pane.component';
import { RightDrawerComponent } from './components/right-drawer/right-drawer.component';
import { FieldGroupDialogComponent } from './components/field-group-dialog/field-group-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    LeftPaneComponent,
    MiddlePaneComponent,
    RightPaneComponent,
    RightDrawerComponent,
    FieldGroupDialogComponent
  ]
})
export class AppComponent implements OnInit {
  title = 'Form Builder';

  constructor(
    private fieldGroupService: FieldGroupService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}
  

  createNewFieldGroup(): void {
    const dialogRef = this.dialog.open(FieldGroupDialogComponent, {
      width: '450px',
      data: { 
        mode: 'create',
        group: null
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fieldGroupService.addFieldGroup(result);
      }
    });
  }
}
