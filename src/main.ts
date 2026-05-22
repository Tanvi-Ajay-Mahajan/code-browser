import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app'; // 1. Fixed name and path to app.component

bootstrapApplication(App, appConfig) // 2. Fixed 'App' -> 'AppComponent' and passed 'appConfig'
  .catch((err) => console.error(err));
