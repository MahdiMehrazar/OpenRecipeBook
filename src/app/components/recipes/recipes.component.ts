import { UserAuthService } from "./../../services/userauth.service";
import { RecipeService } from "./../../services/recipe.service";
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-recipes",
  templateUrl: "./recipes.component.html",
  styleUrls: ["./recipes.component.css"]
})
export class RecipesComponent implements OnInit {
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
    this.recipeService.getRecipes(this.page).subscribe(
      data => {
        this.recipes = data["recipes"];
        this.total = data["total"];
      },
      error => {
        console.log(error);
      }
    );
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
      this.recipeService.getRecipes(this.page).subscribe(
        data => {
          this.recipes = data["recipes"];
          this.total = data["total"];
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  search(searchType) {
    if (!this.searchText) {
      this.recipeService.getRecipes(this.page).subscribe(
        data => {
          this.recipes = data["recipes"];
          this.total = data["total"];
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.searchMode = true;
      if (searchType == "name") {
        this.recipeService.getRecipesByName(this.searchText).subscribe(
          data => {
            this.page = 1;
            this.total = data["total"];
            this.recipes = data["recipes"];
          },
          error => {
            console.log(error);
          }
        );
      } else {
        this.recipeService.getRecipesByTags(this.searchText).subscribe(
          data => {
            this.page = 1;
            this.total = data["total"];
            this.recipes = data["recipes"];
          },
          error => {
            console.log(error);
          }
        );
      }
    }
  }
}
