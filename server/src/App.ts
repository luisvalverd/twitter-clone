import express from "express";
import dotenv from "dotenv";
import { json, urlencoded } from "body-parser";
import morgan from "morgan";
import { AuthRouter } from "./routers/AuthRouter";
import "reflect-metadata";
import { createConnection } from "typeorm";
import cors from "cors";
import { PostRouter } from "./routers/PostRouter";
import * as http from "http";
import * as SocketIO from "socket.io";
import { headersExpose } from "./middlewares/headers";
import { GetRouter } from "./routers/GetRouter";
import path from "path";
//import client from "./middlewares/RedisChat";
import axios from "axios";

dotenv.config();

class Server {
  private port: number;
  public app: express.Express;
  public authRouter: AuthRouter = new AuthRouter();
  public postRouter: PostRouter = new PostRouter();
  public getRouter: GetRouter = new GetRouter();
  public server: http.Server;
  public io: SocketIO.Server = new SocketIO.Server();
  private uri?: string = process.env.CHAT_URI;

  constructor() {
    this.port = <any>process.env.PORT;
    this.app = express();
    this.server = http.createServer(this.app);
    this.middlewares();
    this.routers();
    this.sockets();
  }

  middlewares(): void {
    this.app.use(morgan("short"));
    this.app.use(cors());
    this.app.use(json());
    this.app.use(express.json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(headersExpose);
    this.app.use(
      "/uploads/avatars",
      express.static(path.resolve("uploads/avatars"))
    );
    this.app.use(
      "/uploads/photos",
      express.static(path.resolve("uploads/photos"))
    );
    this.app.use(
      "/uploads/backgrounds",
      express.static(path.resolve("uploads/backgrounds"))
    );
  }

  routers(): void {
    this.authRouter.router(this.app);
    this.postRouter.router(this.app);
    this.getRouter.router(this.app);
  }

  // TODO: implementar salas para chat de usuarios
  sockets(): void {
    this.io.listen(this.server, {
      cors: {
        origin: "*",
      },
    });

    //client;
    // TODO: init connection redis
    this.io.on("connection", (socket: any) => {
      socket.on("start", (user: any) => {
        socket.username = user;
        console.log(`user ${socket.username} is connected`);

        // * save user and socket in server chat
        axios
          .post(<string>this.uri + "/add-user", {
            socketID: socket.id,
            nickname: <string>user,
          })
          .then((res) => console.log(res.data))
          .catch((err) => console.log(err.message));
        //socket.join(user);
      });

      /**
       * * get a messsages of chat when the user click the chat
       * TODO: verify if exist chat if not exit create chat
       */
      socket.on("get messages", (users: any) => {
        axios
          .post(<string>this.uri, { users_chat: users })
          .then((res) => console.log(res.data))
          .catch((err) => console.log(err.message));
      });

      socket.on("message", async (data: any) => {
        //socket.broadcast.emit("message:recived", msg);
        let user: any = await axios
          .post(<string>this.uri + "/get-user-socket", {
            nickname: data.reciver,
          })
          .catch((err) => console.log(err.message));

        console.log(<any>user.data.socket_id);
        console.log(socket.rooms);
        //this.io.of(user.data.socket_id).emit("message:recived", data);
        socket.to(<any>user.data.socket_id).emit("message:recived", data);
      });

      socket.on("exit user", (nickname: any) => {
        axios
          .post(<string>this.uri + "/remove-user", {
            nickname: nickname,
          })
          .then((res) => console.log(res.data))
          .catch((err) => console.log(err.message));
      });

      socket.on("disconnect", () => {
        // * remove to the user in chat server
        console.log(`user ${socket.id} left`);
      });
    });
  }

  listen(): void {
    this.server.listen(this.port, () => {
      console.log(`listen on port ${this.port}`);
    });
  }
}

createConnection().then(async (connection) => {
  const app = await new Server();
  app.listen();
});
