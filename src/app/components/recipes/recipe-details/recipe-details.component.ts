import { UserService } from "./../../../services/user.service";
import { FlashMessagesService } from "angular2-flash-messages";
import { Component, OnInit } from "@angular/core";
import { RecipeService } from "../../../services/recipe.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { UserAuthService } from "../../../services/userauth.service";
import { ShareButtons } from '@ngx-share/core';

@Component({
  selector: "app-recipe-details",
  templateUrl: "./recipe-details.component.html",
  styleUrls: ["./recipe-details.component.css"]
})
export class RecipeDetailsComponent implements OnInit {
  recipe: Object;
  params: Params;
  id: number;
  user: Object;
  userFavs: Object;
  avgRating;
  roundedAvgRating;

  favStatus = false;
  success;

  linkCopy;

  submitted = false;

  deleteConfirmationNotice = false;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private userAuthService: UserAuthService,
    private flashMessagesService: FlashMessagesService,
    private userService: UserService,
    public share: ShareButtons
  ) {
    this.route.params.subscribe(params => {
      this.id = params["recipeId"];
    });
  }

  ngOnInit() {
    this.user = this.userAuthService.getUserInfo();

    this.recipeService.getRecipeById(this.id).subscribe(
      data => {
        this.recipe = data["recipe"];
        // console.log(this.recipe);
      },
      error => {
        console.log(error);
      }
    );

    this.recipeService
      .getRecipeAvgRatingById(this.id)
      .subscribe((data: any) => {
        for (var key in data["avgRating"]) {
          if (data["avgRating"][key]["_id"] == this.id) {
            this.avgRating = data["avgRating"][key]["avgRating"];
            this.roundedAvgRating = Math.round(this.avgRating);
          }
        }
      });

    if (this.user) {
      this.userService.getUser(this.user["username"]).subscribe(
        (data: any) => {
          this.userFavs = data["user"]["favouriteRecipes"];
          for (var key in this.userFavs) {
            if (this.userFavs[key]["_id"] == this.recipe["_id"]) {
              this.favStatus = true;
            }
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  recipeOwnership() {
    if (this.user) {
      if (this.recipe["author"]["username"] == this.user["username"] || this.user["role"] == "admin") {
        return true;
      } else {
        return false;
      }
    }
  }

  deleteRecipe() {
    this.submitted = true;

    this.recipeService.deleteRecipe(this.id).subscribe((data: any) => {
      if (data.success) {
        this.submitted = false;
        this.flashMessagesService.show("Recipe deleted!", {
          cssClass: "alert-success",
          timeout: 5000
        });
        this.router.navigate(["/recipes/"]);
      } else {
        this.submitted = false;
        this.flashMessagesService.show("Failed to delete recipe.", {
          cssClass: "alert-danger",
          timeout: 5000
        });
        this.router.navigate(["/recipes/"]);
      }
    });
  }

  favourite() {
    if (!this.favStatus) {
      this.recipeService
        .favouriteRecipe(this.id, this.recipe)
        .subscribe((data: any) => {
          if (data.success) {
            this.favStatus = true;
            this.success = true;
            setTimeout(() => {
              this.success = false;
            }, 5000);
          } else {
            this.success = false;
          }
        });
    } else {
      this.recipeService
        .unFavouriteRecipe(this.id, this.recipe)
        .subscribe((data: any) => {
          if (data.success) {
            this.favStatus = false;
            this.success = true;
            setTimeout(() => {
              this.success = false;
            }, 5000);
          } else {
            this.success = false;
          }
        });
    }
  }

  linkCopied(){
    this.linkCopy = true;
    setTimeout(() => {
      this.linkCopy = false;
    }, 2000);
  }

  isAuthenticated() {
    return this.userAuthService.isAuthenticated();
  }
}
