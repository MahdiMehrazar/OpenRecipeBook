import { UserAuthService } from "./userauth.service";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import { environment } from "../../environments/environment";
import { AuthService } from "@ngx-auth/core";

@Injectable()
export class UserService {
  constructor(
    private http: HttpClient,
    private userAuthService: UserAuthService
  ) {}

  getAllUsers(currentPage) {
    const options = {
      params: new HttpParams().set("currentPage", currentPage)
    };
    return this.http.get(environment.baseUrl + "api/users", options);
  }

  getUser(username) {
    return this.http.get(environment.baseUrl + "api/users/profile/" + username);
  }

  getUsersByUsername(username) {
    return this.http.get(
      environment.baseUrl + "api/search/users/name/" + username
    );
  }
}
