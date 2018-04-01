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
export class FileService {
  constructor(
    private http: HttpClient,
    private userAuthService: UserAuthService
  ) {}

  postImage(formData) {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", this.userAuthService.getToken());
    headers = headers.delete("Content-Type");
    return this.http.post(environment.baseUrl + "api/files/upload", formData, {
      headers: headers
    });
  }

  deleteImage(fileName) {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", this.userAuthService.getToken());
    headers = headers.append("Content-Type", "application/json");
    return this.http.delete(environment.baseUrl + "api/files/delete/" + fileName, {
      headers: headers,
      params: fileName
    });
  }
}
