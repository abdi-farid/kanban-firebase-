import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Task, TaskDialogData} from '../task';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCardModule} from "@angular/material/card";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [MatFormFieldModule, MatCardModule, MatInputModule, MatDialogModule,
    MatButtonModule, FormsModule, NgIf, MatIconModule],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.scss'
})
export class TaskDialogComponent implements OnInit {
  private backupTask!: Partial<Task>;

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData
  ) {
  }

  cancel(): void {
    console.log('on cancel')

  /*
    this.data.task.title = this.backupTask.title;
    this.data.task.description = this.backupTask.description;
   */
    this.dialogRef.close(this.data);
  }

  ngOnInit(): void {
    this.backupTask = {...this.data.task}

    console.log('backup : ', this.backupTask)
  }

}
