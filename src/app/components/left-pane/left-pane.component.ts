import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { FieldGroup } from '../../models/field-group.model';
import { FieldGroupService } from '../../services/field-group.service';
import { FieldGroupDialogComponent } from '../field-group-dialog/field-group-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrls: ['./left-pane.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    FieldGroupDialogComponent
  ]
})
export class LeftPaneComponent implements OnInit, OnDestroy {
  fieldGroups: FieldGroup[] = [];
  selectedGroupId: string | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private fieldGroupService: FieldGroupService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.fieldGroupService.fieldGroups$.subscribe(groups => {
        this.fieldGroups = groups;
      })
    );

    this.subscriptions.push(
      this.fieldGroupService.selectedGroup$.subscribe(group => {
        this.selectedGroupId = group?.id || null;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  selectGroup(groupId: string): void {
    this.fieldGroupService.selectGroup(groupId);
  }

  openCreateDialog(): void {
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

  openEditDialog(group: FieldGroup, event: Event): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(FieldGroupDialogComponent, {
      width: '450px',
      data: { 
        mode: 'edit',
        group: {
          name: group.name,
          description: group.description
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fieldGroupService.updateFieldGroup(group.id, result);
      }
    });
  }

  deleteGroup(groupId: string, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this field group? This action cannot be undone.')) {
      this.fieldGroupService.deleteFieldGroup(groupId);
    }
  }
}
