//import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
											 
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import {CalendarComponent} from "ap-angular2-fullcalendar/src/calendar/calendar";
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { DataService } from './data.service';
import { AuthService } from './auth.service'
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PostsComponent } from './posts/posts.component';
import { HeaderComponent } from './header/header.component';
import { PersonsearchComponent } from './personsearch/personsearch.component';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';
import {  TruncatePipe }   from '../Pipe';
import { EventsearchComponent } from './eventsearch/eventsearch.component';
//Must include for ngModel to be used
import { FormsModule }   from '@angular/forms';
import { EmailComponent } from './email/email.component';
import { TablecolumnfilterComponent } from './tablecolumnfilter/tablecolumnfilter.component';
import { PictureComponent } from './picture/picture.component';
import { Windowref } from './windowref.service';
import { AuthInterceptor } from './auth-interceptor';
import { SsoComponent } from './sso/sso.component';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
//import { adapterFactory } from 'angular-calendar/date-adapters/moment';
//import * as moment from 'moment';

//export function momentAdapterFactory() {
//  return adapterFactory(moment);
//};

const ROUTES : Routes = [
  {
    path: '',
    redirectTo: 'calendar',
    pathMatch: 'full'
  },
  {
    path: 'person',
    component: PersonsearchComponent
  },
  {
    path: 'picture',
    component: PictureComponent
  },
  
  {
    path: 'event',
    component: EventsearchComponent
  },
  {
    path: 'email',
    component: EmailComponent
  },
  {
    path: 'calendar',
    component: CalendarViewComponent
  },
  
  {
    path: 'posts',
    component: PostsComponent
  },
  
  {
    path: 'sso',
    component: SsoComponent
  }

  

];

@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    HeaderComponent,
    PersonsearchComponent,
   // CalendarComponent,
    CalendarViewComponent,
    TruncatePipe,
    EventsearchComponent,
    EmailComponent,
    TablecolumnfilterComponent,
    PictureComponent,
    SsoComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    NgbModule,
    //HttpModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES),
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    FormsModule
  ],
  providers: [DataService, AuthService, Windowref
        ,{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }

//platformBrowserDynamic().bootstrapModule(AppModule);