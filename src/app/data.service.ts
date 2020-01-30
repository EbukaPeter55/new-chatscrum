import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // public domain_name = 'localhost:8000';
  // public domain_protocol = 'http://';
  // public websocket = 'ws://';
  public domain_name = 'intapi.chatscrum.com';
  public domain_protocol = 'https://';
  public websocket = 'wss://';
  public message;
  public message_login;
  public goal_name;
  
  public createuser_email;
  public createuser_password;
  public createuser_fullname;
  public createuser_usertype = "User";
  public createuser_projname;
  public username;
  public login_username;
  public login_password;
  public login_project;
  public login_fullname = "createuser_fullname";
  public to_clear_board;
  public user_slack;
  public users;
  public project_name;
  public project_slack;
  public slack_username;
  public slack_app_id;
  public realname;
  public role;
  public inviteuser_email;

  public sprints = [];
  public sprint_start;
  public sprint_end;
  selected_sprint: any;
  public sprint_goals;
  public _user_sprint_goals;
  public message_body;
  public role_id;
  public project;
  public users_id = [];
  public httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  
  public authOptions;
  public imageAuthOptions;
  

  constructor(private http: HttpClient, private router: Router) { }

  
  createUser()
  {
    const formData = {
      'email': this.createuser_email, 
      'password': this.createuser_password, 
      'full_name': this.createuser_fullname, 
      'usertype': this.createuser_usertype, 
      'projname': this.createuser_projname    
    }
  
    console.log(formData);
    // this.http.post(this.domain_protocol + this.domain_name + '/scrum/api/scrumusers/', JSON.stringify({formData}), this.httpOptions).subscribe(
    this.http.post(this.domain_protocol + this.domain_name + '/scrum/api/scrumusers/', JSON.stringify(formData), this.httpOptions).subscribe(
        data => {
            console.log(data);
            this.message = data['message'];
            this.createuser_email = '';
            this.createuser_password = '';
            this.createuser_fullname = '';
            this.createuser_projname = '';
        },
       
        err => {
            this.message = 'User Creation Failed! Unexpected Error!';
            console.error(err);
            this.createuser_email = '';
            this.createuser_password = '';
            this.createuser_fullname = '';
            this.createuser_projname = '';
        }
    );
    console.log(this.createuser_projname);
  }


//The Login method
login()
{
  const loginFormData = {
    'username': this.login_username,
    'password': this.login_password,
    'project': this.login_project
  }                                         
  console.log(loginFormData);
  this.http.post(
      this.domain_protocol + this.domain_name + '/scrum/api-token-auth/', 
      JSON.stringify(loginFormData), this.httpOptions
    ).subscribe(
      data => {
          sessionStorage.setItem('username', this.login_username);
          sessionStorage.setItem('realname', data['name']);
          sessionStorage.setItem('role', data['role']);
          sessionStorage.setItem('role_id', data['role_id']);
          sessionStorage.setItem('token', data['token']);
          sessionStorage.setItem('project_id', data['project_id']);
          sessionStorage.setItem('to_clear_board', data['to_clear_board']);
          sessionStorage.setItem('user_slack', data['user_slack']);
          sessionStorage.setItem('project_slack', data['project_slack']);
          sessionStorage.setItem('slack_username', data['slack_username']);
          this.username = this.login_username;
          this.role = data['role'];
          this.role_id = data['role_id'];
          this.realname = data['name'];
          this.project = data['project_id'];
          this.to_clear_board = data['to_clear_board'];
          this.user_slack = data['user_slack'];
          this.project_slack = data['project_slack'];
          this.message = 'Welcome!';
          console.log(this.role);
          console.log(this.role == "Owner");
          if(this.role == "Owner"){
            this.router.navigate(['admin']);
          }else {
            this.router.navigate(['teamtaskcards']);
          }          
          this.login_username = '';
          this.login_password = '';
          this.login_project = '';
          console.log(data);
          
          this.authOptions = {
              headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'JWT ' + data['token']})
          };
      },
      err => {
          if(err['status'] == 400)
              this.message_login = 'Login Failed: Invalid Credentials.';
          else
              this.message_login = 'Login Failed! Unexpected Error!';
          console.error(err);
          this.login_username = '';
          this.login_password = '';
          this.login_project = '';
      }
  );
}
//End of login method

// Add task/create goal method
addGoal(on_user)
  {
    this.http.post(this.domain_protocol + this.domain_name + '/scrum/api/scrumgoals/', JSON.stringify({'name': this.goal_name, 'user': on_user, 'project_id': this.project}), this.authOptions).subscribe(
        data => {
            console.log(data);
            this.users = data['data'];
            this.message = data['message'];
            this.goal_name = '';
            this.filterSprint(this.sprints);
        },
        err => {
            console.error(err);
            if(err['status'] == 401)
            {
                this.message = 'Session Invalid or Expired. Please Login.';
                this.logout();
            } else
            {
                this.message = 'Unexpected Error!';    
            }
            this.goal_name = '';
        }
    );  
  }
// End of Add task/create goal method


//Guard
loggedIn() {
  return !!sessionStorage.getItem('token')
}

//logout method
logout()
{
  this.username = '';
  this.role = '';
  this.role_id = '';
  this.users = [];
  this.realname = '';
  this.project = 0;
  this.project_name = '';
  this.user_slack = '';
  this.project_slack = '';
  this.router.navigate(['']);
  this.authOptions = {};
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('role');
  sessionStorage.removeItem('role_id');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('project_id');
  sessionStorage.removeItem('realname');
  sessionStorage.removeItem('user_slack');
  sessionStorage.removeItem('project_slack');
}


             
filterSprint(uSprints) {
  this.sprints= uSprints
  var filter_goal = []
  console.log(filter_goal)
      // this.sprint_goals.length = 0 
        for (var i = 0;  i < this.users.length; i++)  {
          for (var j = 0;  j < this.users[i].scrumgoal_set.length; j++)  {
            if (this.sprints.length) {
              if (this.users[i].scrumgoal_set[j].time_created >= this.sprints[this.sprints.length - 1].created_on && 
                this.users[i].scrumgoal_set[j].time_created <= this.sprints[this.sprints.length - 1].ends_on)
                {                  
                console.log(this.users[i].scrumgoal_set[j].time_created)
                console.log(this.users[i].scrumgoal_set[j].name)
                 // this.users[i].scrumgoal_set[j].user_id = this.users[i].id
                 filter_goal.push(this.users[i].scrumgoal_set[j]);
                }
            } else {
                this.users[i].scrumgoal_set[j].user_id = this.users[i].id
                filter_goal.push(this.users[i].scrumgoal_set[j]); 
            }
          }
        }
        console.log(filter_goal)
        this.sprint_goals = filter_goal

}

changeSprint() 
{   
  this.sprint_goals = [];
    for (var i = 0;  i < this.users.length; i++)  {
      for (var j = 0;  j < this.users[i].scrumgoal_set.length; j++)  {
        if (this.users[i].scrumgoal_set[j].time_created > this.selected_sprint.created_on && 
          this.users[i].scrumgoal_set[j].time_created < this.selected_sprint.ends_on)
          {                
           this.users[i].scrumgoal_set[j].user_id = this.users[i].id;
           this.sprint_goals.push(this.users[i].scrumgoal_set[j]);
          }
        } 
      }
}

}
