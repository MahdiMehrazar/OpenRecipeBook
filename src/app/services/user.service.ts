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

  getAllUsers() {
    return this.http.get(environment.baseUrl + "api/users");
  }

  getUser(username) {
    return this.http.get(environment.baseUrl + "api/users/profile/" + username);
  }

}
