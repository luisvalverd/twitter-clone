import * as SocketIO from "socket.io";

export class SocketController {
  public io: SocketIO.Server;

  initSocket(server: any): void {
    this.io.listen(server);

    this.io.on("connect", (socket: any) => {
      console.log("client is connected");
    });
  }
}
