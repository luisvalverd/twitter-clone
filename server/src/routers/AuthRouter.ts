import { AuthController } from "../controllers/AuthController";

export class AuthRouter {

  AuthUserController: AuthController = new AuthController();

  router(app: any): void {
    app.route('/api/v1/auth/login').post(this.AuthUserController.loginUser);
    app.route('/api/v1/auth/register').post(this.AuthUserController.registerUser);
  }
}




