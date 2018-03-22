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
export class UserAuthService {
  authToken: any;
  user: any;

  constructor(private http: HttpClient, private auth: AuthService) {}

  registerUser(user) {
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    return this.http.post(environment.baseUrl + "api/users/register", user, {
      headers: headers
    });
  }

  authenticateUser(user) {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
    return this.http.post(
      environment.baseUrl + "api/users/authenticate",
      user,
      { headers: headers }
    );
  }

  deleteUser(id) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.append("Authorization", this.authToken);
    headers = headers.append("Content-Type", "application/json");
    console.log("deleted user with ID" + id);
    return this.http.delete(environment.baseUrl + "api/users/" + id, {
      headers: headers,
      params: id
    });
  }

  storeUserData(token, user) {
    localStorage.setItem("id_token", token);
    localStorage.setItem("user", JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  getProfile() {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.append("Authorization", this.authToken);
    headers = headers.append("Content-Type", "application/json");
    return this.http.get(environment.baseUrl + "api/users/profile", {
      headers: headers
    });
  }

  loadToken() {
    const token = localStorage.getItem("id_token");
    this.authToken = token;
  }

  isAuthenticated() {
    return this.auth.isAuthenticated;
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  getUserInfo() {
    this.user = localStorage.getItem("user");
    return JSON.parse(this.user);
  }

  getToken() {
    const token = localStorage.getItem("id_token");
    return token;
  }
}
