import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, public dataservice: DataService) { 

  }

  ngOnInit() {
  }

  //Login method
 login() 
 {
   this.dataservice.login();
   console.log (this.dataservice.username);
 }

}
