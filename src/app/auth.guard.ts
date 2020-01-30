import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { DataService } from './data.service';



@Injectable()

export class AuthGuard implements  CanActivate{

  constructor(private _dataService: DataService, 
              private _router: Router) {}
  canActivate(): boolean {
    if(this._dataService.loggedIn()){
      return true
    }else {
      this._router.navigate([''])
      return false
    }
  }
  
}
