import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { TeamtaskComponent } from './teamtask/teamtask.component';
import { TeamtaskcardsComponent } from './teamtaskcards/teamtaskcards.component';
import { UsertaskComponent } from './usertask/usertask.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MytaskComponent } from './mytask/mytask.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DataService } from './data.service';
import { AuthGuard } from './auth.guard';
import { AdminComponent } from './admin/admin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {  MatSidenavModule } from '@angular/material';


@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    TeamtaskComponent,
    TeamtaskcardsComponent,
    UsertaskComponent,
    HomeComponent,
    LoginComponent,
    MytaskComponent,
    AdminComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSidenavModule
    
  ],
  providers: [DataService, AuthGuard,],
  bootstrap: [AppComponent]
})
export class AppModule { }
