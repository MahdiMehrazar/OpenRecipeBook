import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import { environment } from "../../environments/environment";
import { UserAuthService } from "./userauth.service";

@Injectable()
export class RecipeService {
  constructor(
    private http: HttpClient,
    private userAuthService: UserAuthService
  ) {}

  getRecipes(currentPage) {
    const options = {
      params: new HttpParams().set("currentPage", currentPage)
    };
    return this.http.get(environment.baseUrl + "api/recipes", options);
  }

  newRecipe(recipe) {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", this.userAuthService.getToken());
    headers = headers.append("Content-Type", "application/json");
    return this.http.post(environment.baseUrl + "api/recipes", recipe, {
      headers: headers
    });
  }

  editRecipe(recipeId, recipe) {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", this.userAuthService.getToken());
    headers = headers.append("Content-Type", "application/json");
    return this.http.put(
      environment.baseUrl + "api/recipes/" + recipeId,
      recipe,
      {
        headers: headers
      }
    );
  }

  deleteRecipe(recipeId) {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", this.userAuthService.getToken());
    headers = headers.append("Content-Type", "application/json");
    return this.http.delete(environment.baseUrl + "api/recipes/" + recipeId, {
      headers: headers,
      params: recipeId
    });
  }

  rateRecipe(recipeId, rating) {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", this.userAuthService.getToken());
    headers = headers.append("Content-Type", "application/json");
    return this.http.put(
      environment.baseUrl + "api/recipes/" + recipeId + "/rating",
      rating,
      {
        headers: headers
      }
    );
  }

  favouriteRecipe(recipeId, recipe) {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", this.userAuthService.getToken());
    headers = headers.append("Content-Type", "application/json");
    return this.http.put(
      environment.baseUrl + "api/recipes/"+ recipeId + "/favourite",
      recipe,
      {
        headers: headers
      }
    );
  }

  unFavouriteRecipe(recipeId, recipe) {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", this.userAuthService.getToken());
    headers = headers.append("Content-Type", "application/json");
    return this.http.put(
      environment.baseUrl + "api/recipes/"+ recipeId + "/unfavourite",
      recipe,
      {
        headers: headers
      }
    );
  }

  getRecipeAvgRatingById(id) {
    return this.http.get(environment.baseUrl + "api/recipes/" + id + "/rating");
  }

  getRecipeById(id) {
    return this.http.get(environment.baseUrl + "api/recipes/" + id);
  }

  getRecipesByUsername(username) {
    const options = { params: new HttpParams().set("username", username) };
    return this.http.get(environment.baseUrl + "api/users/recipes", options);
  }

  getRecipesByName(name) {
    return this.http.get(
      environment.baseUrl + "api/search/recipes/name/" + name
    );
  }

  getRecipesByTags(tags) {
    return this.http.get(
      environment.baseUrl + "api/search/recipes/tags/" + tags
    );
  }
}
