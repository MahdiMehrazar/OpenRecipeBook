import { UserService } from "./../../../services/user.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"]
})
export class UsersComponent implements OnInit {
  users = [];
  searchText;
  page;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getAllUsers().subscribe(
      (data: any) => {
        this.users = data['users'];
      },
      error => {
        console.log(error);
      }
    );
    
  }
}
