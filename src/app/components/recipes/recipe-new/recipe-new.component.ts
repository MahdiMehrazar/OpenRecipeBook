import { FileService } from "../../../services/file.service";
import { RecipeService } from "./../../../services/recipe.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { FlashMessagesService } from "angular2-flash-messages";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "app-recipe-new",
  templateUrl: "./recipe-new.component.html",
  styleUrls: ["./recipe-new.component.css"]
})
export class RecipeNewComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  name: String;
  instructions: String;
  description: String;
  imageUrl: String;
  user: any;
  fileName: String;
  htmlContent;

  filesToUpload: Array<File> = [];

  imageUploading = false;
  submitted = false;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private flashMessagesService: FlashMessagesService,
    private fileService: FileService
  ) {}

  editorConfig = {
    editable: true,
    spellcheck: true,
    height: "300px",
    minHeight: "0",
    width: "auto",
    minWidth: "0",
    translate: "yes",
    enableToolbar: true,
    showToolbar: true,
    placeholder: "Enter instructions here",
    imageEndPoint: "",
    toolbar: [
      [
        "bold",
        "italic",
        "underline",
        "superscript",
        "subscript"
      ],
      ["fontSize"],
      [
        "justifyLeft",
        "justifyCenter",
        "justifyRight",
        "justifyFull",
        "indent",
        "outdent"
      ],
      ["cut", "copy", "delete", "removeFormat", "undo", "redo"],
      [
        "paragraph",
        "blockquote",
        "removeBlockquote",
        "horizontalLine",
        "orderedList",
        "unorderedList"
      ],
      ["link", "unlink", "image", "video"]
    ]
  };

  ngOnInit() {}

  ngOnDestroy () {
    this.subscriptions.unsubscribe()
  }  

  onSubmitRecipe(form) {
    //split tags into array
    var tags = form.value.tags
      .split(",")
      .filter(e => {
        return typeof e === "string" && e.length > 2;
      })
      .map(string => string.trim());

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
    this.subscriptions.add(this.recipeService.newRecipe(recipe).subscribe((data: any) => {
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
    }));
  }

  submitFormWithImageUpload(recipe) {
    const formData: any = new FormData();
    const files: Array<File> = this.filesToUpload;

    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i], files[i]["name"]);
    }

    this.subscriptions.add(this.fileService.postImage(formData).subscribe(data => {
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
    }));
  }

  fileChangeEvent(fileInput: any) {
    this.imageUploading = true;
    this.filesToUpload = <Array<File>>fileInput.target.files;
    this.fileName = fileInput.target.files[0].name;
  }
}
