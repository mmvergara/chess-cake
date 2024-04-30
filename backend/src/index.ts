import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";

const ws = new WebSocketServer({ port: 8080 });

const gm = new GameManager();

ws.on("connection", function connection(ws) {
  console.log("New connection");
  gm.addUser(ws);

  ws.on("disconnect", () => {
    gm.removeUser(ws);
  });
});
