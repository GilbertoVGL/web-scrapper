import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ScrappingServiceProvider } from '../providers/services/scrapping-service';
import { HttpClientModule } from '@angular/common/http'
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    ScrappingServiceProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
