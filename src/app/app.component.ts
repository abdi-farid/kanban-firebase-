import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {Task, TaskDialogResult} from './task/task';
import {TaskComponent} from "./task/task.component";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {CdkDragDrop, DragDropModule, transferArrayItem} from "@angular/cdk/drag-drop";
import {MatButtonModule} from "@angular/material/button";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {TaskDialogComponent} from "./task/task-dialog/task-dialog.component";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {BehaviorSubject, Observable} from "rxjs";


const getObservable = (collection: AngularFirestoreCollection<Task>) => {
  const subject = new BehaviorSubject<Task[]>([]);
  collection.valueChanges({idField: 'id'}).subscribe((val: Task[]) => {
    subject.next(val);
  });
  return subject;
};


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatIconModule, TaskComponent, NgForOf,
    MatCardModule, DragDropModule, MatButtonModule, MatDialogModule, NgIf, AsyncPipe
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'kanban-fire';

  todo = getObservable(this.store.collection('todo')) as Observable<Task[]>;
  inProgress = getObservable(this.store.collection('inProgress')) as Observable<Task[]>;
  done = getObservable(this.store.collection('done')) as Observable<Task[]>;


  constructor(private dialog: MatDialog, private store: AngularFirestore) {
  }

  editTask(list: 'done' | 'todo' | 'inProgress', task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '35%',
      data: {
        task,
        enableDelete: true,
      },
    });
    dialogRef.afterClosed().subscribe((result: TaskDialogResult | undefined) => {
      if (!result) {
        return;
      }
      if (result.delete) {
        this.store.collection(list).doc(task.id).delete().then();
      } else {
        this.store.collection(list).doc(task.id).update(task).then();
      }
    });
  }

  drop(event: CdkDragDrop<Task[] | any>): void {
    if (event.previousContainer === event.container) {
      return;
    }
    const item = event.previousContainer.data[event.previousIndex];
    this.store.firestore.runTransaction(() => {
      const promise = Promise.all([
        this.store.collection(event.previousContainer.id).doc(item.id).delete(),
        this.store.collection(event.container.id).add(item),
      ]);
      return promise;
    }).then();
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }


  newTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '35%',
      data: {
        task: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult | undefined) => {
        if (!result) {
          return;
        }
        console.log('value to add : ', result.task)
        return this.store.collection('todo').add(result.task)
//        this.todo.push(result.task);
      });
  }
}
