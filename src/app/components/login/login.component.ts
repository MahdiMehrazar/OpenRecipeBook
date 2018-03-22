import { UserAuthService } from "./../../services/userauth.service";
import { Component, OnInit } from "@angular/core";
import { Location } from '@angular/common';
import { Router } from "@angular/router";
import { FlashMessagesService } from "angular2-flash-messages";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;

  constructor(
    private authService: UserAuthService,
    private router: Router,
    private flashMessagesService: FlashMessagesService,
    private location: Location
  ) {}

  ngOnInit() {}

  onLogin(form) {
    const user = {
      username: form.value.username,
      password: form.value.password
    };

    this.authService.authenticateUser(user).subscribe((data: any) => {
      if (data.success) {
        this.authService.storeUserData(data.token, data.user);
        this.flashMessagesService.show("You are now logged in!", {
          cssClass: "alert-success",
          timeout: 5000
        });
        this.location.back();
      } else {
        this.flashMessagesService.show("Invalid username and/or password", {
          cssClass: "alert-danger",
          timeout: 5000
        });
        this.router.navigate(["/login"]);
      }
    });
  }
}
