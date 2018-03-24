import { RecipeService } from './../../../services/recipe.service';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  @Input() recipe: Object;
  avgRating;
  roundedAvgRating;

  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
    this.subscriptions.add(this.recipeService.getRecipeAvgRatingById(this.recipe["recipeId"]).subscribe((data: any) => {
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

}
