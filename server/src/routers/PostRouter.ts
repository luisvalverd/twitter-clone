import { FollowersController } from "../controllers/FollowsController";
import { PostController } from "../controllers/PostController";
import { isValidToken } from "../middlewares/authentication";
import { uploadsAvatars } from "../middlewares/uploadImages";

export class PostRouter {
  postController: PostController = new PostController();
  followController: FollowersController = new FollowersController();

  router(app: any) {
    app.post('/api/v1/post/create-post/', isValidToken, this.postController.createPost)
    app.post('/api/v1/post/follow-user/', isValidToken, this.followController.followUser)
    app.post('/api/v1/post/unfollow-user/', isValidToken, this.followController.unFollowUser)
    app.post('/api/v1/post/avatar', isValidToken, uploadsAvatars.single('avatar'), this.postController.updateAvatar)
  }
}



