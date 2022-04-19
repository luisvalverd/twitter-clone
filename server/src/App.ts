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

  sockets(): void {
    this.io.listen(this.server, {
      cors: {
        origin: "*",
      },
    });

    this.io.on("connection", (socket: any) => {
      /**
       * * when the init chat save nickname and socket id in database
       * * for use in other funtions of sockets
       * ? this is call only we conected of chat
       */
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
      });

      /**
       * * get a messsages of chat when the user click the chat
       * * if not exist chat we are create and save in databaes of server chat
       * ? esto solo se llama cuando hacemos click en un chat
       */
      socket.on("connect chat", async (data: any) => {
        let users: any[] = [];

        users.push(data.emitter);

        if (Array.isArray(data.reciver)) {
          for (let i = 0; i < data.reciver.length; i++) {
            users.push(data.reciver[i]);
          }
        } else {
          users.push(data.reciver);
        }

        let chat: any = await axios.post(<string>this.uri + "/get-chat", {
          users_chat: users,
        });

        if (chat.status === 200) {
          socket.emit("get messages", chat.data.messages);
          return;
        }

        axios
          .post(<string>this.uri + "/create-chat", { users_chat: users })
          .then((res) => console.log(res.data))
          .catch((err) => console.log(err.message));
      });

      /**
       * * message: es para que el servidor reciva los mensages del usuario con los datos
       * * del usuario al que se quire mandar la informacion y luego lo envia usando
       * * message:recived usando la rooms que se crean por defecto para cada usuario
       * * para saber el socket id del usuario al que queremos mandar se hace una peticion al servidor del chat
       * * con el nickname del usuario al que queremos mander el mensage, el servidor nos respone con json con la informacion
       */
      socket.on("message", async (data: any) => {
        let user: any = await axios
          .post(<string>this.uri + "/get-user-socket", {
            nickname: data.reciver,
          })
          .catch((err) => console.log(err.message));

        axios
          .post(<string>this.uri + "/send-message", {
            emitter: data.emitter,
            reciver: data.reciver,
            text: data.text,
            users_chat: [data.emitter, data.reciver],
          })
          .then((res) => console.log(res.data))
          .catch((err) => console.log(err.message));

        socket.to(<any>user.data.socket_id).emit("message:recived", data);
      });

      /**
       * * exit user desconecta al usuario en caso de que se salga del chat
       * * ademas de desconectarlo lo eliminamos de la base de datos usando axios
       * ? esto no cierra el socket solo lo desconecta temporalmente
       */
      socket.on("exit user", (nickname: any) => {
        axios
          .post(<string>this.uri + "/remove-user", {
            nickname: nickname,
          })
          .then((res) => console.log(res.data))
          .catch((err) => console.log(err.message));

        console.log(`user ${nickname} disconnected of chat...`);
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
