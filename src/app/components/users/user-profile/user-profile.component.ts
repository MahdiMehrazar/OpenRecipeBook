import { UserAuthService } from './../../../services/userauth.service';
import { RecipeService } from "./../../../services/recipe.service";
import { UserService } from "./../../../services/user.service";
import { Component, OnInit } from "@angular/core";
import { Params, Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"]
})
export class UserProfileComponent implements OnInit {
  userProfile: Object;
  recipes: Object;
  params: Params;
  username: String;

  user: Object;

  constructor(
    private userService: UserService,
    private recipeService: RecipeService,
    private userAuthService: UserAuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.username = params["username"];
    });
  }

  ngOnInit() {
    this.user = this.userAuthService.getUserInfo();

    this.userService.getUser(this.username).subscribe(
      (data: any) => {
        this.userProfile = data["user"];
        this.recipeService
          .getRecipesByUsername(this.userProfile["username"])
          .subscribe((data: any) => {
            this.recipes = data["recipes"];
          });
      },
      error => {
        console.log(error);
      }
    );
  }

  adminCheck() {
    if (this.user) {
      if (this.user["role"] == "admin") {
        return true;
      } else {
        return false;
      }
    }
  }

  adminDeleteUser(){
    this.userAuthService.deleteUser(this.userProfile["_id"]).subscribe((data: any) => {
      if (data.success) {
        this.router.navigate(["/"]);
      } else {
        return false;
      }
    });
  }
}
