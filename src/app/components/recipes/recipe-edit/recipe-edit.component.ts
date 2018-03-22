import { FileuploadService } from "./../../../services/fileupload.service";
import { FlashMessagesService } from "angular2-flash-messages";
import { UserAuthService } from "./../../../services/userauth.service";
import { RecipeService } from "./../../../services/recipe.service";
import { Component, OnInit } from "@angular/core";
import { Params, Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-recipe-edit",
  templateUrl: "./recipe-edit.component.html",
  styleUrls: ["./recipe-edit.component.css"]
})
export class RecipeEditComponent implements OnInit {
  recipe: Object;
  params: Params;
  id: number;
  user: Object;
  fileName: String;

  editMode = false;
  submitted = false;

  filesToUpload: Array<File> = [];

  imageUploading = false;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private userAuthService: UserAuthService,
    private fileUploadService: FileuploadService,
    private flashMessagesService: FlashMessagesService
  ) {
    this.route.params.subscribe(params => {
      this.id = params["recipeId"];
    });
  }

  ngOnInit() {
    this.user = this.userAuthService.getUserInfo();
    this.recipeService.getRecipeById(this.id).subscribe(
      data => {
        this.recipe = data["recipe"];
        // Check Recipe Ownership
        this.recipe["author"]["username"] == this.user["username"] || this.user["role"] == "admin"
          ? (this.editMode = true)
          : this.router.navigate(["/recipes/" + this.id]);
      },
      error => {
        console.log(error);
      }
    );
  }

  onEditRecipe(form) {
    //split tags into array
    var tags = form.value.tags.toString().split(",").filter(e => {
      return typeof e === "string" && e.length > 2;
    }).map(string => string.trim());

    const recipe = {
      name: form.value.name,
      instructions: form.value.instructions,
      imageUrl: form.value.imageUrl,
      description: form.value.description,
      tags
    };

    this.submitted = true;

    if (!this.imageUploading) {
      this.submitFormWithImageURL(recipe);
    } else {
      this.submitFormWithImageUpload(recipe);
    }
  }

  submitFormWithImageURL(recipe) {
    this.recipeService.editRecipe(this.id, recipe).subscribe((data: any) => {
      if (data.success) {
        this.flashMessagesService.show("Recipe edited!", {
          cssClass: "alert-success",
          timeout: 5000
        });
        this.submitted = false;
        this.router.navigate(["/recipes/" + this.id]);
      } else {
        this.flashMessagesService.show("Failed to edit recipe.", {
          cssClass: "alert-danger",
          timeout: 5000
        });
        this.submitted = false;
        this.router.navigate(["/recipes/" + this.id]);
      }
    });
  }

  submitFormWithImageUpload(recipe) {
    const formData: any = new FormData();
    const files: Array<File> = this.filesToUpload;

    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i], files[i]["name"]);
    }

    this.fileUploadService.postRecipeImage(formData).subscribe(data => {
      recipe.imageUrl = data["data"];
      this.recipeService.editRecipe(this.id, recipe).subscribe((data: any) => {
        if (data.success) {
          this.flashMessagesService.show("Recipe edited!", {
            cssClass: "alert-success",
            timeout: 5000
          });
          this.submitted = false;
          this.router.navigate(["/recipes/" + this.id]);
        } else {
          this.flashMessagesService.show("Failed to edit recipe.", {
            cssClass: "alert-danger",
            timeout: 5000
          });
          this.submitted = false;
          this.router.navigate(["/recipes/" + this.id]);
        }
      });
    });
  }

  fileChangeEvent(fileInput: any) {
    this.imageUploading = true;
    this.filesToUpload = <Array<File>>fileInput.target.files;
    this.fileName = fileInput.target.files[0].name;
  }
}
