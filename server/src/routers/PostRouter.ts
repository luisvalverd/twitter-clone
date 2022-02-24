import { FollowersController } from "../controllers/FollowsController";
import { PostController } from "../controllers/PostController";
import { isValidToken } from "../middlewares/authentication";
import {
  uploadImagesUser,
  uploadsAvatars,
  uploadsBackGrounds,
  uploadsPhotos,
} from "../middlewares/uploadImages";

export class PostRouter {
  postController: PostController = new PostController();
  followController: FollowersController = new FollowersController();

  router(app: any) {
    app.post(
      "/api/v1/post/create-post/",
      isValidToken,
      uploadsPhotos.single("photo"),
      this.postController.createPost
    );
    app.post(
      "/api/v1/post/follow-user/",
      isValidToken,
      this.followController.followUser
    );
    app.post(
      "/api/v1/post/unfollow-user/",
      isValidToken,
      this.followController.unFollowUser
    );
    // update only avatar
    app.post(
      "/api/v1/post/avatar",
      isValidToken,
      uploadsAvatars.single("avatar"),
      this.postController.updateAvatar
    );
    app.post(
      "/api/v1/post/update-data-user",
      isValidToken,
      uploadImagesUser.fields([
        { name: "avatar", maxCount: 1 },
        { name: "background" },
      ]),
      this.postController.updateDataUser
    );
    app.post(
      "/api/v1/post/search-user",
      isValidToken,
      this.postController.findUserByUsername
    );
    app.post(
      "/api/v1/post/find-profile",
      isValidToken,
      this.postController.findProfileUser
    );
    app.post(
      "/api/v1/post/like-post",
      isValidToken,
      this.postController.likePublic
    );
  }
}
