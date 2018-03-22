import { FileuploadService } from "./../../services/fileupload.service";
import { CommentService } from "./../../services/comment.service";
import { UserAuthService } from "./../../services/userauth.service";
import { RecipeService } from "./../../services/recipe.service";
import { Component, OnInit, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "app-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.css"]
})
export class CommentsComponent implements OnInit {
  @Input() recipe: Object;
  subscription: Subscription;

  success;
  successDelete;
  submitted = false;

  fileName: String;
  filesToUpload: Array<File> = [];
  imageUploading = false;

  constructor(
    private recipeService: RecipeService,
    private userAuthService: UserAuthService,
    private commentService: CommentService,
    private fileUploadService: FileuploadService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscription = this.commentService.commentDeleted.subscribe(data => {
      if (data == true) {
        this.successDelete = true;
        setTimeout(() => {
          this.successDelete = false;
        }, 5000);
        this.recipeService.getRecipeById(this.recipe["recipeId"]).subscribe(
          data => {
            this.recipe = data["recipe"];
            console.log(this.recipe);
          },
          error => {
            console.log(error);
          }
        );
      }
    });
  }

  isAuthenticated() {
    return this.userAuthService.isAuthenticated();
  }

  onSubmitComment(form) {
    const comment = {
      text: form.value.comment,
      imageUrl: form.value.imageUrl
    };

    this.submitted = true;

    if (!this.imageUploading) {
      this.submitFormWithImageURL(comment, form);
    } else {
      this.submitFormWithImageUpload(comment, form);
    }
  }

  submitFormWithImageURL(comment, form) {
    this.commentService
      .newComment(this.recipe["recipeId"], comment)
      .subscribe((data: any) => {
        if (data.success) {
          this.submitted = false;
          this.recipeService.getRecipeById(this.recipe["recipeId"]).subscribe(
            data => {
              this.recipe = data["recipe"];
              console.log(this.recipe);
            },
            error => {
              console.log(error);
            }
          );
          this.success = true;
          setTimeout(() => {
            this.success = false;
          }, 5000);
          form.reset();
        } else {
          this.success = false;
          this.submitted = false;
        }
      });
  }

  submitFormWithImageUpload(comment, form) {
    const formData: any = new FormData();
    const files: Array<File> = this.filesToUpload;

    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i], files[i]["name"]);
    }

    this.fileUploadService.postRecipeImage(formData).subscribe(data => {
      comment.imageUrl = data["data"];
      this.commentService
        .newComment(this.recipe["recipeId"], comment)
        .subscribe((data: any) => {
          if (data.success) {
            this.submitted = false;
            this.recipeService.getRecipeById(this.recipe["recipeId"]).subscribe(
              data => {
                this.recipe = data["recipe"];
                console.log(this.recipe);
              },
              error => {
                console.log(error);
              }
            );
            this.success = true;
            setTimeout(() => {
              this.success = false;
            }, 5000);
            form.reset();
          } else {
            this.success = false;
            this.submitted = false;
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
