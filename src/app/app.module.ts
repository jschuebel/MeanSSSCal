//import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import {CalendarComponent} from "ap-angular2-fullcalendar/src/calendar/calendar";
import { CalendarModule } from 'angular-calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { DataService } from './data.service';
import { AppComponent } from './app.component';
import { PostsComponent } from './posts/posts.component';
import { HeaderComponent } from './header/header.component';
import { PersonsearchComponent } from './personsearch/personsearch.component';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';

const ROUTES : Routes = [
  {
    path: '',
    redirectTo: 'posts',
    pathMatch: 'full'
  },
  {
    path: 'person',
    component: PersonsearchComponent
  },
  {
    path: 'calendar',
    component: CalendarViewComponent
  },
  
  {
    path: 'posts',
    component: PostsComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    HeaderComponent,
    PersonsearchComponent,
   // CalendarComponent,
    CalendarViewComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    NgbModule.forRoot(),
	  HttpModule,
    RouterModule.forRoot(ROUTES),
    CalendarModule.forRoot()
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }

//platformBrowserDynamic().bootstrapModule(AppModule);