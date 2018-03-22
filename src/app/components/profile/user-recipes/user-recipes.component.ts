import { Component, OnInit } from "@angular/core";
import { UserAuthService } from "../../../services/userauth.service";
import { RecipeService } from "../../../services/recipe.service";

@Component({
  selector: "app-user-recipes",
  templateUrl: "./user-recipes.component.html",
  styleUrls: ["./user-recipes.component.css"]
})
export class UserRecipesComponent implements OnInit {
  user: Object;
  recipes: Object;

  constructor(
    private userAuthService: UserAuthService,
    private recipeService: RecipeService
  ) {}

  ngOnInit() {
    this.userAuthService.getProfile().subscribe(
      (profile: any) => {
        this.user = profile.user;
        this.recipeService
          .getRecipesByUsername(profile.user.username)
          .subscribe((data: any) => {
            this.recipes = data["recipes"];
          });
      },
      err => {
        console.log(err);
        return false;
      }
    );
  }
}
