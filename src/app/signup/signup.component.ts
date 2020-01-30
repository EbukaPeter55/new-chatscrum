import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public create_new_project: boolean = false;

  constructor(private router: Router, public dataservice: DataService) { }


  ngOnInit() {
  }

 

  changeUserToOwner() {
    this.dataservice.createuser_usertype = 'Owner';
  }

  changeOwnerToUser() {
    this.dataservice.createuser_usertype = 'User';
  }

  showCreateProject() {
    this.create_new_project = !this.create_new_project;
  }

  createProject() {
    console.log("project creatinnnnnnnnnnnnnnnn") 
    this.dataservice.createuser_usertype = "Owner"
    this.dataservice.createuser_password = "password"
  }
  
  createUser()
  {
    
    this.dataservice.createUser(); 

  }

}
