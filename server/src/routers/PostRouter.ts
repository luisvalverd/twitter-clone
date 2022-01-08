import { PostController } from "../controllers/PostController";
import { isValidToken } from "../middlewares/authentication";


export class PostRouter {
  postController: PostController = new PostController();

  router(app: any) {
    app.post('/api/v1/post/create-post/', isValidToken, this.postController.createPost)
  }
}



