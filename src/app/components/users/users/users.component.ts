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
  searchMode;
  mobileSearch;

  page;
  total;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.subscriptions.add(
      this.userService.getAllUsers(this.page).subscribe(
        (data: any) => {
          this.users = data["users"];
          this.total = data["total"];
        },
        error => {
          console.log(error);
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  showSearchBar() {
    this.mobileSearch = !this.mobileSearch;
  }

  pageChanged(page) {
    this.page = page;
    if (!this.searchMode) {
      this.subscriptions.add(
        this.userService.getAllUsers(this.page).subscribe(
          (data: any) => {
            this.users = data["users"];
            this.total = data["total"];
          },
          error => {
            console.log(error);
          }
        )
      );
    }
  }

  search() {
    if (!this.searchText) {
      this.subscriptions.add(
        this.userService.getAllUsers(this.page).subscribe(
          (data: any) => {
            this.users = data["users"];
            this.total = data["total"];
          },
          error => {
            console.log(error);
          }
        )
      );
    } else {
      this.searchMode = true;
      this.subscriptions.add(
        this.userService.getUsersByUsername(this.searchText).subscribe(
          data => {
            this.page = 1;
            this.total = data["total"];
            this.users = data["users"];
          },
          error => {
            console.log(error);
          }
        )
      );
    }
  }
}
