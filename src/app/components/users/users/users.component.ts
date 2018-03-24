import { UserService } from "./../../../services/user.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"]
})
export class UsersComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  users = [];
  searchText;
  page;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.subscriptions.add(this.userService.getAllUsers().subscribe(
      (data: any) => {
        this.users = data['users'];
      },
      error => {
        console.log(error);
      }
    ));
  }

  ngOnDestroy () {
    this.subscriptions.unsubscribe()
  }
}
