import { RecipeService } from "./../../../services/recipe.service";
import { UserAuthService } from "./../../../services/userauth.service";
import { Component, OnInit, Input, Output, OnDestroy } from "@angular/core";
import { CommentService } from "../../../services/comment.service";
import { FileuploadService } from "../../../services/fileupload.service";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "app-comment",
  templateUrl: "./comment.component.html",
  styleUrls: ["./comment.component.css"]
})
export class CommentComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  @Input() comment: Object;
  @Input() recipe: Object;
  user: Object;

  successEdit;
  editMode = false;
  submitted = false;
  deleteConfirmationNotice = false;

  fileName: String;
  filesToUpload: Array<File> = [];
  imageUploading = false;

  constructor(
    private userAuthService: UserAuthService,
    private commentService: CommentService,
    private fileUploadService: FileuploadService,
    private recipeService: RecipeService
  ) {}

  ngOnInit() {
    this.user = this.userAuthService.getUserInfo();
  }

  ngOnDestroy () {
    this.subscriptions.unsubscribe()
  }  

  commentOwnership() {
    if (this.user) {
      if (this.comment["author"]["username"] == this.user["username"] || this.user["role"] == "admin") {
        return true;
      } else {
        return false;
      }
    }
  }

  editComment() {
    this.editMode = true;
    this.deleteConfirmationNotice = false;
  }

  onSubmitComment(form) {
    const comment = {
      text: form.value.comment,
      imageUrl: form.value.imageUrl
    };

    this.submitted = true;

    if (!this.imageUploading) {
      this.submitFormWithImageURL(comment);
    } else {
      this.submitFormWithImageUpload(comment);
    }
  }

  submitFormWithImageURL(comment) {
    this.subscriptions.add(this.commentService
      .editComment(this.recipe["recipeId"], this.comment["_id"], comment)
      .subscribe((data: any) => {
        if (data.success) {
          this.editMode = false;
          this.submitted = false;
          this.successEdit = true;
          setTimeout(() => {
            this.successEdit = false;
          }, 5000);
        } else {
          this.successEdit = false;
          this.editMode = false;
          this.submitted = false;
        }
      }));
  }

  submitFormWithImageUpload(comment) {
    const formData: any = new FormData();
    const files: Array<File> = this.filesToUpload;

    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i], files[i]["name"]);
    }

    this.subscriptions.add(this.fileUploadService.postRecipeImage(formData).subscribe(data => {
      comment.imageUrl = data["data"];
      this.commentService
        .editComment(this.recipe["recipeId"], this.comment["_id"], comment)
        .subscribe((data: any) => {
          if (data.success) {
            this.editMode = false;
            this.submitted = false;
            this.successEdit = true;
            setTimeout(() => {
              this.successEdit = false;
            }, 5000);
          } else {
            this.successEdit = false;
            this.editMode = false;
            this.submitted = false;
          }
        });
    }));
  }

  deleteComment() {
    this.submitted = true;

    this.subscriptions.add(this.commentService
      .deleteComment(this.recipe["recipeId"], this.comment["_id"])
      .subscribe((data: any) => {
        if (data.success) {
          this.submitted = false;
          this.commentService.announceCommentDeletion(true);
        } else {
          this.submitted = false;
          this.commentService.announceCommentDeletion(false);
        }
      }));
  }

  fileChangeEvent(fileInput: any) {
    this.imageUploading = true;
    this.filesToUpload = <Array<File>>fileInput.target.files;
    this.fileName = fileInput.target.files[0].name;
  }
}
