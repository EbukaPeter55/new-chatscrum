import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { TeamtaskComponent } from './teamtask/teamtask.component';
import { TeamtaskcardsComponent } from './teamtaskcards/teamtaskcards.component';
import { UsertaskComponent } from './usertask/usertask.component';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {MytaskComponent} from './mytask/mytask.component';
import {AdminComponent} from './admin/admin.component';
import { AuthGuard } from './auth.guard';






const routes: Routes = [
  { path: 'teamtask', component: TeamtaskComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'teamtaskcards', component: TeamtaskcardsComponent,
    canActivate: [AuthGuard]
  },
  { path: 'usertask', component: UsertaskComponent},
  { path: '', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'mytask', component: MytaskComponent},
  { path: 'admin', component: AdminComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
