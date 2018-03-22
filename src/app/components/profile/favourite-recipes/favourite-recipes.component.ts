import { UserService } from "./../../../services/user.service";
import { Component, OnInit } from "@angular/core";
import { UserAuthService } from "../../../services/userauth.service";
import { RecipeService } from "../../../services/recipe.service";

@Component({
  selector: "app-favourite-recipes",
  templateUrl: "./favourite-recipes.component.html",
  styleUrls: ["./favourite-recipes.component.css"]
})
export class FavouriteRecipesComponent implements OnInit {
  user: Object;
  userFavs: Object;

  constructor(
    private userAuthService: UserAuthService,
    private recipeService: RecipeService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userAuthService.getProfile().subscribe(
      (profile: any) => {
        this.user = profile.user;
        this.userService.getUser(this.user["username"]).subscribe(
          (data: any) => {
            this.userFavs = data["user"]["favouriteRecipes"];
          },
          error => {
            console.log(error);
          }
        );
      },
      err => {
        console.log(err);
        return false;
      }
    );
  }
}
