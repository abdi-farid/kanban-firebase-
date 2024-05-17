import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {getFirestore, provideFirestore} from "@angular/fire/firestore";
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {environment} from "../environments/environment";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {FIREBASE_OPTIONS} from "@angular/fire/compat";

export const appConfig: ApplicationConfig = {
  providers: [
    {provide: FIREBASE_OPTIONS, useValue: environment.firebase},

    provideRouter(routes), provideAnimationsAsync(),
    AngularFirestoreModule,

    provideFirebaseApp(
      () => initializeApp(environment.firebase)
    ),
    provideFirestore(
      () => getFirestore()
    ),

  ]
};
