import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule, Routes, CanActivate } from "@angular/router";
import { FlashMessagesModule } from "angular2-flash-messages";
import { AuthModule, AuthLoader, AuthStaticLoader } from "@ngx-auth/core";
import { NgxPaginationModule } from "ngx-pagination";
import { ShareModule } from "@ngx-share/core";
import { NgxEditorModule } from 'ngx-editor';

import { AppComponent } from "./app.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { HomeComponent } from "./components/home/home.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { RecipesComponent } from "./components/recipes/recipes.component";
import { RecipeNewComponent } from "./components/recipes/recipe-new/recipe-new.component";
import { RecipeDetailsComponent } from "./components/recipes/recipe-details/recipe-details.component";
import { RecipeListComponent } from "./components/recipes/recipe-list/recipe-list.component";
import { RecipeEditComponent } from "./components/recipes/recipe-edit/recipe-edit.component";
import { UsersComponent } from "./components/users/users/users.component";
import { UserProfileComponent } from "./components/users/user-profile/user-profile.component";
import { CommentsComponent } from "./components/comments/comments.component";
import { CommentComponent } from "./components/comments/comment/comment.component";
import { UserRecipesComponent } from "./components/profile/user-recipes/user-recipes.component";
import { RecipeRatingComponent } from "./components/recipes/recipe-rating/recipe-rating.component";
import { FavouriteRecipesComponent } from "./components/profile/favourite-recipes/favourite-recipes.component";

import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";

import { UserAuthService } from "./services/userauth.service";
import { ValidateService } from "./services/validate.service";
import { RecipeService } from "./services/recipe.service";
import { UserService } from "./services/user.service";
import { CommentService } from "./services/comment.service";
import { FileuploadService } from "./services/fileupload.service";

import { AuthGuard } from "./guards/auth.guard";
import { LoggedinGuard } from "./guards/loggedin.guard";

import { FilterPipe } from "./pipes/filter.pipe";

const appRoutes: Routes = [
  { path: "", component: HomeComponent },
  {
    path: "register",
    component: RegisterComponent,
    canActivate: [LoggedinGuard]
  },
  { path: "login", component: LoginComponent, canActivate: [LoggedinGuard] },
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "user-recipes",
        component: UserRecipesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "favourite-recipes",
        component: FavouriteRecipesComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  { path: "recipes", component: RecipesComponent },
  {
    path: "recipes/new",
    component: RecipeNewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "recipes/:recipeId/edit",
    component: RecipeEditComponent,
    canActivate: [AuthGuard]
  },
  { path: "recipes/:recipeId", component: RecipeDetailsComponent },
  { path: "users", component: UsersComponent },
  { path: "users/:username", component: UserProfileComponent },
  { path: "**", component: PageNotFoundComponent }
];

export function authFactory(): AuthLoader {
  return new AuthStaticLoader({
    backend: {
      endpoint: "/",
      params: []
    },
    storage: localStorage,
    storageKey: "user",
    loginRoute: ["login"],
    defaultUrl: ""
  });
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    PageNotFoundComponent,
    RecipesComponent,
    RecipeNewComponent,
    RecipeDetailsComponent,
    UsersComponent,
    UserProfileComponent,
    RecipeListComponent,
    RecipeEditComponent,
    CommentsComponent,
    CommentComponent,
    RecipeRatingComponent,
    FilterPipe,
    UserRecipesComponent,
    FavouriteRecipesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule.forRoot(),
    AuthModule.forRoot({
      provide: AuthLoader,
      useFactory: authFactory
    }),
    NgxPaginationModule,
    ShareModule.forRoot({
      prop: {
        whatsapp: {
          share: {
            ios: "whatsapp://send?text=",
            android: "whatsapp://send?text="
          }
        }
      }
    }),
    NgxEditorModule 
  ],
  providers: [
    UserAuthService,
    ValidateService,
    RecipeService,
    UserService,
    CommentService,
    FileuploadService,
    AuthGuard,
    LoggedinGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
