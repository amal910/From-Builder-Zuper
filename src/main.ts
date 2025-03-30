import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { StorageService } from './app/services/storage.service';
import { FieldGroupService } from './app/services/field-group.service';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserAnimationsModule),
    provideRouter([]),
    StorageService,
    FieldGroupService
  ]
}).catch(err => console.error(err));
