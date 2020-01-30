import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  public messages = [];
  public websocket;
  public on_user;
  public show_sprint_option: boolean = false;
  public at_bottom: boolean = true;
  present_scrum;
  public msg_obs;
  public id_hover = -1;
  public id_click = -1;
  public color;
  sprint_start: Number;
  sprint_end: Number;
  public show_project_chat: boolean = false;
  

  constructor(
    public dataservice: DataService, private http: HttpClient

  ) {
  
  
  this.dataservice.realname = sessionStorage.getItem('realname');
  this.dataservice.username = sessionStorage.getItem('username');
  this.dataservice.role = sessionStorage.getItem('role');
  this.dataservice.project = sessionStorage.getItem('project_id');
  this.dataservice.to_clear_board = sessionStorage.getItem('to_clear_board');
  this.dataservice.project_slack = sessionStorage.getItem('project_slack');
  this.dataservice.user_slack = sessionStorage.getItem('user_slack');
  this.dataservice.slack_username = sessionStorage.getItem('slack_username');
   
  this.dataservice.authOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'JWT ' + sessionStorage.getItem('token')})
};
this.dataservice.imageAuthOptions = {
    headers: new HttpHeaders({'Authorization': 'JWT ' + sessionStorage.getItem('token')})
};
this.msg_obs = new MutationObserver((mutations) => {
    var chat_scroll = document.getElementById('chat_div_space');
    console.log(chat_scroll.scrollHeight - chat_scroll.clientHeight);
    console.log(chat_scroll.scrollTop);
    if(this.at_bottom)
        chat_scroll.scrollTop = chat_scroll.scrollHeight - chat_scroll.clientHeight;
    console.log(this.messages);
});

this.websocket = new WebSocket(this.dataservice.websocket + this.dataservice.domain_name + '/scrum/');
this.websocket.onopen = (evt) => {
  forkJoin(
      this.http.get(this.dataservice.domain_protocol + this.dataservice.domain_name + '/scrum/api/scrumprojects/' + this.dataservice.project + '/', this.dataservice.httpOptions),
      this.http.get(this.dataservice.domain_protocol + this.dataservice.domain_name + '/scrum/api/scrumsprint/?goal_project_id=' + this.dataservice.project, this.dataservice.authOptions)
      )
     .subscribe(([res1, res2]) => {
        this.msg_obs.observe(document.getElementById('chat_div_space'), { attributes: true, childList: true, subtree: true });
        this.dataservice.users = res1['data'];
        this.dataservice.project_name = res1['project_name'];
        this.dataservice.to_clear_board = res1['to_clear_board'];
        this.dataservice.sprints = [];
        this.dataservice.project_slack = res1['slack_installed'];
        this.dataservice.slack_app_id = res1['slack_app_id'];
        this.websocket.send(JSON.stringify({'project_id': this.dataservice.project, 'user': this.dataservice.realname, 'message': '!join ' + this.dataservice.project_name, 'goal_id': 'main_chat_' + this.dataservice.project_name, 'slack_username': this.dataservice.slack_username }));
        console.log(this.dataservice.users)
        console.log(this.dataservice.project_slack)
        console.log(this.dataservice.user_slack)
        console.log(this.dataservice.slack_app_id)


        this.filterSprint(res2)
    },
    err => {
            this.dataservice.message = 'Unexpected Error!';
            console.log(err);
        });

}

// this.websocket.onmessage = (evt) => {
//     var data = JSON.parse(evt.data);
//     if(data['messages'] !== undefined)
//     {
//         this.messages = []
//         for(var i = 0; i < data['messages']['length']; i++)
//         {
//             this.messages.push(data['messages'][i]['user'] + ': ' + data['messages'][i]['message']);
//         }
//     } else
//     {
//         this.messages.push(data['user'] + ': ' + data['message']);
//     }
//     this.at_bottom = false;
//     var chat_scroll = document.getElementById('chat_div_space');
//     if(chat_scroll.scrollTop == chat_scroll.scrollHeight - chat_scroll.clientHeight)
//         this.at_bottom = true;
// }
this.websocket.onmessage = (evt) => {
    var data = JSON.parse(evt.data);
    if(data['messages'] !== undefined)
    {
        this.messages = []
        for(var i = 0; i < data['messages']['length']; i++)
        {
            this.messages.push(data['messages'][i]);
            console.log('first')
        }
    } else
    {
        this.messages.push(data);
        console.log('second')
    }
    console.log(this.messages)
    // {
    //     this.messages = []
    //     for(var i = 0; i < data['messages']['length']; i++)
    //     {
    //         this.messages.push(data['messages'][i]['user'] + ': ' + data['messages'][i]['message']);
    //     }
    // } else
    // {
    //     this.messages.push(data['user'] + ': ' + data['message']);
    // }
    console.log(this.messages)
    this.at_bottom = false;
    var chat_scroll = document.getElementById('chat_div_space');
    if(chat_scroll.scrollTop == chat_scroll.scrollHeight - chat_scroll.clientHeight)
        this.at_bottom = true;
}

this.websocket.onclose = (evt) => {
    console.log('Disconnected!');
    this.msg_obs.disconnect();
}

  
   }

  // Initialise Modal function/method
  modalControl(){
    let modalToggle = document.querySelectorAll(".modal_toggle");
    let modal = document.querySelectorAll(".modal");
    let overlay = document.querySelector(".overlay");
  
    modal.forEach( modal => {
      let toggler = modal.parentElement;
  
      // Add the click event to modal open icon to open when clicked
      toggler.addEventListener("click", ()=>{
        modalSwitch.show();
      });
        
  
      // modal modes to control the opening and closing
      var modalSwitch = {
        show : ()=>{
          overlay.classList.remove("hidden");
          modal.classList.remove("hidden");
        },
        hide : ()=>{
          overlay.classList.add("hidden");
          modal.classList.add("hidden");
        }
      };
  
      // Get the icon to close the modal 
      let close = modal.querySelector("#cancel");
      let footerclose = modal.querySelector("#footerclose");
  
      // Hide modal when user clicks outside the modal or on the close icon
      window.addEventListener('click', function(event){
        if (event.target === overlay || event.target === close || event.target === footerclose) {
          modalSwitch.hide();
        }
      });
    });
  };

  ngOnInit() {
    //Jquery here
// Listen to the event from the template
window.addEventListener("load", this.modalControl)

// Call the modal function/method
this.modalControl();


  }

//change theme method

changeleft_bodyBg(color){
 document.getElementById("left_body").style.background = color;
}  
  
//  Logout method 
  logout()
  {
    this.dataservice.message = "Thank you for using ChatScrum"
    this.dataservice.logout();
  }

// add goal
addGoal()
{
  this.dataservice.message ="";
  console.log("inside addgoal" + this.on_user);
  this.dataservice.addGoal(this.on_user);
}

setSelectedUser(id)
{
  this.id_hover = id;    
}

//change sprint
changeSprint() 
{  
this.dataservice.users_id = [] 
  this.dataservice.message ="";
  this.dataservice.sprint_goals = [];
    for (var i = 0;  i < this.dataservice.users.length; i++)  {
      for (var j = 0;  j < this.dataservice.users[i].scrumgoal_set.length; j++)  {
        if (this.dataservice.users[i].scrumgoal_set[j].time_created > this.dataservice.selected_sprint.created_on && 
          this.dataservice.users[i].scrumgoal_set[j].time_created < this.dataservice.selected_sprint.ends_on)
          {                
           this.dataservice.users[i].scrumgoal_set[j].user_id = this.dataservice.users[i].id;
           this.dataservice.sprint_goals.push(this.dataservice.users[i].scrumgoal_set[j]);
          }
        } 
      }
}

// change sprint method
filterSprint(uSprints) {
  this.dataservice.users_id = []
  this.dataservice.sprints= uSprints
  var filter_goal = []
  console.log(filter_goal)
      // this.dataservice.sprint_goals.length = 0 
        for (var i = 0;  i < this.dataservice.users.length; i++)  {
          console.log(filter_goal)
          console.log(this.dataservice.users.length)
          for (var j = 0;  j < this.dataservice.users[i].scrumgoal_set.length; j++)  {
            if (this.dataservice.sprints.length) {
              if (this.dataservice.users[i].scrumgoal_set[j].time_created >= this.dataservice.sprints[this.dataservice.sprints.length - 1].created_on && 
                this.dataservice.users[i].scrumgoal_set[j].time_created <= this.dataservice.sprints[this.dataservice.sprints.length - 1].ends_on)
                {                  
                // console.log(this.dataservice.users[i].scrumgoal_set[j].time_created)
                // console.log(this.dataservice.users[i].scrumgoal_set[j].name)
                 // this.dataservice.users[i].scrumgoal_set[j].user_id = this.dataservice.users[i].id
                 filter_goal.push(this.dataservice.users[i].scrumgoal_set[j]);
                 
                }this.show_sprint_option = true;
            } else {
                this.dataservice.users[i].scrumgoal_set[j].user_id = this.dataservice.users[i].id
                filter_goal.push(this.dataservice.users[i].scrumgoal_set[j]); 
                
            }
          }
        }
        // console.log(filter_goal)
        this.dataservice.sprint_goals = filter_goal
}

// create sprint method
createSprintMethod(myDate) {
  console.log(this.dataservice.users)
  console.log(this.dataservice.sprints)
  forkJoin(
  this.http.post(this.dataservice.domain_protocol + this.dataservice.domain_name
     + '/scrum/api/scrumsprint/?goal_project_id=' + this.dataservice.project, 
     JSON.stringify({'project_id': this.dataservice.project, 'ends_on': myDate}), this.dataservice.authOptions),
     this.http.get(this.dataservice.domain_protocol + this.dataservice.domain_name 
     + '/scrum/api/scrumprojects/' + this.dataservice.project + '/', this.dataservice.httpOptions)
)
 .subscribe(([res2, res1]) => {
    this.msg_obs.observe(document.getElementById('chat_div_space'), { attributes: true, childList: true, subtree: true });
    this.dataservice.users = res2['users'];
    this.dataservice.project_name = res1['project_name'];
    this.dataservice.sprints = res2['data']
    this.dataservice.message = res2['message']
    
    console.log(this.dataservice.sprints)
    console.log(this.dataservice.users)
    console.log(this.dataservice.sprint_goals)
    this.filterSprint(res2['data'])
    console.log(this.dataservice.sprint_goals)
},

    err => {
      console.error(err);
        if(err['status'] == 401)
          {
            this.dataservice.message = 'Session Invalid or Expired. Please Login.';
            this.dataservice.logout();
        } else
          {
            this.dataservice.message = 'Unexpected Error!';    
          }
        }
      );
}

//Create sprint
createSprint() 
{
var myDate = new Date(new Date().getTime()+(7*24*60*60*1000));
if (this.dataservice.sprints.length) {
console.log('if works');
var present_scrum_id = this.dataservice.sprints[this.dataservice.sprints.length - 1].id;
this.present_scrum = this.dataservice.sprints[this.dataservice.sprints.length - 1].ends_on;
this.present_scrum =  new Date(this.present_scrum).valueOf();


//  Test if Today Date is greater than last scrum
console.log(this.present_scrum);
console.log(new Date().valueOf());
if (this.present_scrum > new Date().valueOf()) {
if (confirm("Sprint #" + present_scrum_id + " is currently running. End this spring and start another one?  Click \"OK\" to continue Create New Sprint!!!")) {
  this.dataservice.message == "Current Sprint ended";          
  this.createSprintMethod(myDate)
  return;
    }
else {
  this.dataservice.message = 'Last Sprint continued!!!';
  console.log("Sprint Continue");
  return;
    
}
} else  {
  this.createSprintMethod(myDate);

  return;
}   
} else {
console.log('else works');
this.createSprintMethod(myDate);

return;
}    
} 


}
