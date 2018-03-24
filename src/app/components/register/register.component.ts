import { ValidateService } from './../../services/validate.service';
import { UserAuthService } from "./../../services/userauth.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { FlashMessagesService } from "angular2-flash-messages";
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  username: String;
  email: String;
  password: String;

  submitted = false;

  constructor(
    private authService: UserAuthService,
    private validateService: ValidateService,
    private router: Router,
    private flashMessagesService: FlashMessagesService
  ) {}

  ngOnInit() {}

  ngOnDestroy () {
    this.subscriptions.unsubscribe()
  } 

  onSignup(form) {
    const user = {
      username: form.value.username,
      email: form.value.email,
      password: form.value.password
    };
    this.submitted = true;

    // Validate Email
    if (!this.validateService.validateEmail(user.email)) {
      this.flashMessagesService.show("Please use a valid email address.", {
        cssClass: "alert-danger",
        timeout: 5000
      });
      this.submitted = false;
      return false;
    }

    // Register User
    this.subscriptions.add(this.authService.registerUser(user).subscribe((data: any) => {
      if (data.success) {
        this.flashMessagesService.show(
          "Registration successful! You can now log in.",
          { cssClass: "alert-success", timeout: 5000 }
        );
        this.submitted = false;
        this.router.navigate(["/login"]);
      } else {
        this.flashMessagesService.show(
          "Registration failed. Username is taken/Email address is already in use.",
          { cssClass: "alert-danger", timeout: 5000 }
        );
        this.submitted = false;
        this.router.navigate(["/register"]);
      }
    }));
  }
}
