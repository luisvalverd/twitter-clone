import { FollowersController } from "../controllers/FollowsController";
import { GetController } from "../controllers/GetControllers";
import { isValidToken } from "../middlewares/authentication";

export class GetRouter {
  getController: GetController = new GetController();
  followController: FollowersController = new FollowersController();

  router(app: any) {
    app.get(
      "/api/v1/gets/my-posts",
      isValidToken,
      this.getController.getAllMyPost
    );
    app.get(
      "/api/v1/gets/my-followers",
      isValidToken,
      this.followController.getMyFollowers
    );
    app.get(
      "/api/v1/gets/my-following",
      isValidToken,
      this.followController.getMyFollowing
    );
    app.get(
      "/api/v1/gets/post-following",
      isValidToken,
      this.getController.getPostFollowingUser
    );
    app.get(
      "/api/v1/gets/my-likes",
      isValidToken,
      this.getController.getIdLikes
    );
  }
}
