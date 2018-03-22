import { FileuploadService } from "./../../../services/fileupload.service";
import { RecipeService } from "./../../../services/recipe.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FlashMessagesService } from "angular2-flash-messages";

@Component({
  selector: "app-recipe-new",
  templateUrl: "./recipe-new.component.html",
  styleUrls: ["./recipe-new.component.css"]
})
export class RecipeNewComponent implements OnInit {
  name: String;
  instructions: String;
  description: String;
  imageUrl: String;
  user: any;
  fileName: String;

  filesToUpload: Array<File> = [];

  imageUploading = false;
  submitted = false;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private flashMessagesService: FlashMessagesService,
    private fileUploadService: FileuploadService
  ) {}

  ngOnInit() {}

  onSubmitRecipe(form) {
    //split tags into array
    var tags = form.value.tags.split(",").filter(e => {
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
    this.recipeService.newRecipe(recipe).subscribe((data: any) => {
      if (data.success) {
        this.flashMessagesService.show("Recipe submitted!", {
          cssClass: "alert-success",
          timeout: 5000
        });
        this.submitted = false;
        this.router.navigate(["/recipes"]);
      } else {
        this.flashMessagesService.show("Failed to submit recipe.", {
          cssClass: "alert-danger",
          timeout: 5000
        });
        this.submitted = false;
        this.router.navigate(["/recipes"]);
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
      this.recipeService.newRecipe(recipe).subscribe((data: any) => {
        if (data.success) {
          this.flashMessagesService.show("Recipe submitted!", {
            cssClass: "alert-success",
            timeout: 5000
          });
          this.submitted = false;
          this.router.navigate(["/recipes"]);
        } else {
          this.flashMessagesService.show("Failed to submit recipe.", {
            cssClass: "alert-danger",
            timeout: 5000
          });
          this.submitted = false;
          this.router.navigate(["/recipes"]);
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
