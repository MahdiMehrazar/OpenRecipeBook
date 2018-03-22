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
import { Subject } from "rxjs/Subject";

@Injectable()
export class CommentService {
  private announceCommentDeleted = new Subject<boolean>();
  
  commentDeleted = this.announceCommentDeleted.asObservable();

  constructor(
    private http: HttpClient,
    private userAuthService: UserAuthService
  ) {}

  newComment(recipeId, comment) {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", this.userAuthService.getToken());
    headers = headers.append("Content-Type", "application/json");
    return this.http.post(
      environment.baseUrl + "api/recipes/" + recipeId + "/comments",
      comment,
      {
        headers: headers
      }
    );
  }

  editComment(recipeId, commentId, comment) {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", this.userAuthService.getToken());
    headers = headers.append("Content-Type", "application/json");
    return this.http.put(
      environment.baseUrl + "api/recipes/" + recipeId + "/comments/" +commentId,
      comment,
      {
        headers: headers
      }
    );
  }

  deleteComment(recipeId, commentId) {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", this.userAuthService.getToken());
    headers = headers.append("Content-Type", "application/json");
    return this.http.delete(environment.baseUrl + "api/recipes/" + recipeId + "/comments/" +commentId, {
      headers: headers,
      params: {recipeId, commentId}
    });
  }

  announceCommentDeletion(deleted: boolean){
    this.announceCommentDeleted.next(deleted);
  }
}
