import { Router } from "@angular/router";
import { FlashMessagesService } from "angular2-flash-messages";
import { UserAuthService } from "./../../services/userauth.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  show: boolean = false;

  constructor(
    private userAuthService: UserAuthService,
    private flashMessage: FlashMessagesService,
    private router: Router
  ) {}

  ngOnInit() {}

  toggleCollapse() {
    this.show = !this.show;
  }

  onLogoutClick() {
    this.userAuthService.logout();
    this.flashMessage.show("You have successfully logged out!", {
      cssClass: "alert-success",
      timeout: 2500
    });
    this.router.navigate(["/login"]);
    return false;
  }

  isAuthenticated() {
    return this.userAuthService.isAuthenticated();
  }
}
