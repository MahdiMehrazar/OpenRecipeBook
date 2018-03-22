import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { environment } from "../../environments/environment";
import { UserAuthService } from "./userauth.service";

@Injectable()
export class FileuploadService {
  constructor(
    private http: HttpClient,
    private userAuthService: UserAuthService
  ) {}

  postRecipeImage(formData) {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", this.userAuthService.getToken());
    headers = headers.delete("Content-Type");
    return this.http.post(environment.baseUrl + "api/files/upload", formData, {
      headers: headers
    });
  }
}
