import { UserAuthService } from "./../../../services/userauth.service";
import { FlashMessagesService } from "angular2-flash-messages";
import { RecipeService } from "./../../../services/recipe.service";
import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Params, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "app-recipe-rating",
  templateUrl: "./recipe-rating.component.html",
  styleUrls: ["./recipe-rating.component.css"]
})
export class RecipeRatingComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  rating = 0;
  avgRating;
  roundedAvgRating;
  @Input() recipe;
  params: Params;
  id: number;
  user: Object;
  success;

  constructor(
    private userAuthService: UserAuthService,
    private recipeService: RecipeService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.id = params["recipeId"];
    });
  }

  ngOnInit() {
    this.user = this.userAuthService.getUserInfo();

    if (this.user) {
      for (var key in this.recipe["ratedBy"]) {
        if (this.recipe["ratedBy"][key]["username"] == this.user["username"]) {
          this.rating = this.recipe["ratedBy"][key]["rating"];
        }
      }
    }

    this.subscriptions.add(this.recipeService
      .getRecipeAvgRatingById(this.id)
      .subscribe((data: any) => {
        for (var key in data["avgRating"]) {
          if (data["avgRating"][key]["_id"] == this.recipe["recipeId"]) {
            this.avgRating = data["avgRating"][key]["avgRating"];
            this.roundedAvgRating = Math.round(this.avgRating);
          }
        }
      }));
  }

  ngOnDestroy () {
    this.subscriptions.unsubscribe()
  }  

  isAuthenticated() {
    return this.userAuthService.isAuthenticated();
  }

  onClick(rating) {
    this.rating = rating;
  }

  onSubmitRating() {
    const rating = {
      rating: this.rating
    };

    this.subscriptions.add(this.recipeService.rateRecipe(this.id, rating).subscribe((data: any) => {
      if (data.success) {
        this.success = true;
        setTimeout(() => {
          this.success = false;
        }, 5000);
      } else {
        this.success = false;
      }
    }));
  }
}
