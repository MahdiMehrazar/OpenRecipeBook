import { UserAuthService } from "./../../services/userauth.service";
import { RecipeService } from "./../../services/recipe.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "app-recipes",
  templateUrl: "./recipes.component.html",
  styleUrls: ["./recipes.component.css"]
})
export class RecipesComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  recipes = [];

  searchMode;
  searchText;
  searchType = "name";
  mobileSearch;

  page;
  total;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private userAuthService: UserAuthService
  ) {}

  ngOnInit() {
    this.subscriptions.add(this.recipeService.getRecipes(this.page).subscribe(
      data => {
        this.recipes = data["recipes"];
        this.total = data["total"];
      },
      error => {
        console.log(error);
      }
    ));
  }

  ngOnDestroy () {
    this.subscriptions.unsubscribe()
  }  

  showSearchBar(){
    this.mobileSearch = !this.mobileSearch;
  }

  isAuthenticated() {
    return this.userAuthService.isAuthenticated();
  }

  pageChanged(page) {
    this.page = page;
    if (!this.searchMode) {
      this.subscriptions.add(this.recipeService.getRecipes(this.page).subscribe(
        data => {
          this.recipes = data["recipes"];
          this.total = data["total"];
        },
        error => {
          console.log(error);
        }
      ));
    }
  }

  search(searchType) {
    if (!this.searchText) {
      this.subscriptions.add(this.recipeService.getRecipes(this.page).subscribe(
        data => {
          this.recipes = data["recipes"];
          this.total = data["total"];
        },
        error => {
          console.log(error);
        }
      ));
    } else {
      this.searchMode = true;
      if (searchType == "name") {
        this.subscriptions.add(this.recipeService.getRecipesByName(this.searchText).subscribe(
          data => {
            this.page = 1;
            this.total = data["total"];
            this.recipes = data["recipes"];
          },
          error => {
            console.log(error);
          }
        ));
      } else {
        this.subscriptions.add(this.recipeService.getRecipesByTags(this.searchText).subscribe(
          data => {
            this.page = 1;
            this.total = data["total"];
            this.recipes = data["recipes"];
          },
          error => {
            console.log(error);
          }
        ));
      }
    }
  }
}
