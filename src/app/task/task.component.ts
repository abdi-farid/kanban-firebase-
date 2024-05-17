import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Task} from './task';
import {MatCardModule} from "@angular/material/card";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [MatCardModule, NgIf],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  @Input() task: Task | undefined = undefined;
  @Output() edit = new EventEmitter<Task>();

}
