import express from 'express';
import dotenv from 'dotenv';
import { json, urlencoded } from 'body-parser';
import morgan from 'morgan';
import { AuthRouter } from './routers/AuthRouter';
import "reflect-metadata"
import { createConnection } from 'typeorm';
import cors from 'cors';
import { PostRouter } from './routers/PostRouter';
import * as http from 'http';
import * as SocketIO from 'socket.io'
import { headersExpose } from './middlewares/headers';

dotenv.config();

class Server {
  private port: number;
  public app: express.Express;
  public authRouter: AuthRouter = new AuthRouter();
  public postRouter: PostRouter = new PostRouter();
  public server: http.Server;
  public io: SocketIO.Server = new SocketIO.Server();

  constructor() {
    this.port = <any>process.env.PORT;
    this.app = express();
    this.server = http.createServer(this.app);
    this.middlewares();
    this.sockets();
    this.routers();
  }

  middlewares(): void {
    this.app.use(morgan('short'));
    this.app.use(cors())
    this.app.use(json());
    this.app.use(express.json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(headersExpose);
  }

  routers(): void {
    this.authRouter.router(this.app);
    this.postRouter.router(this.app);    
  }

  sockets(): void {
    this.io.listen(this.server);

    this.io.on("connect", (socket: any) => {
      console.log("client is connected");
    });
  }

  listen(): void {
    this.server.listen(this.port, () => {
      console.log(`listen on port ${this.port}`);
    })
  }

}

createConnection().then(async connection => {
  const app = await new Server();
  app.listen()
})

