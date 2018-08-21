import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {GetObservatoryWidgetsService} from './providers/get-observatory-widgets.service';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { WidgetComponent } from './home/components/widget/widget.component';
import { WidgetListComponent } from './home/components/widget-list/widget-list.component';
import {PagerService} from './providers/pager.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WidgetComponent,
    WidgetListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [GetObservatoryWidgetsService, PagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
