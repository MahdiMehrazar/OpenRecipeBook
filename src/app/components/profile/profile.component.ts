import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { UserAuthService } from "./../../services/userauth.service";
import { RecipeService } from "./../../services/recipe.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  user: Object;
  recipes: Object;

  submitted;

  deleteConfirmationNotice = false;

  constructor(
    private router: Router,
    private userAuthService: UserAuthService,
    private recipeService: RecipeService,
    private flashMessagesService: FlashMessagesService
  ) {}

  ngOnInit() {
    this.userAuthService.getProfile().subscribe(
      (profile: any) => {
        this.user = profile.user;
        this.router.navigate(["/profile/user-recipes"]);
      },
      err => {
        console.log(err);
        return false;
      }
    );
  }

  deleteAccount() {
    this.submitted = true;
    this.userAuthService.deleteUser(this.user["_id"]).subscribe((data: any) => {
      if (data.success) {
        this.flashMessagesService.show("Account deleted!", {
          cssClass: "alert-success",
          timeout: 5000
        });
        this.submitted = false;
        this.userAuthService.logout();
        this.router.navigate(["/"]);
      } else {
        this.flashMessagesService.show("Failed to delete account.", {
          cssClass: "alert-danger",
          timeout: 5000
        });
        this.submitted = false;
        this.router.navigate(["/"]);
      }
    });
  }
}
