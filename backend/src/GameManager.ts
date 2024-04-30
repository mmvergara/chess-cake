import { WebSocket } from "ws";
import { Game } from "./Game";
import { INITIALIZE_GAME, MOVE } from "./Messages";

export class GameManager {
  private games: Game[];
  private pendingUser: WebSocket | null;
  private users: WebSocket[];

  constructor() {
    this.games = [];
    this.pendingUser = null;
    this.users = [];
  }

  addUser(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);
  }
  removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user !== socket);
    // Stop the game if there are no users left
    
  }

  private getGame(socket: WebSocket) {
    return this.games.find(
      (game) => game.white === socket || game.black === socket
    );
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      console.log("Message: ", message);
      // Game initialization
      if (message.type === INITIALIZE_GAME) {
        // Check if the user is already in a game
        if (this.getGame(socket)) {
          return socket.send("You are already in a game");
        }

        if (this.pendingUser) {
          const game = new Game(this.pendingUser, socket);
          this.games.push(game);
          socket.send("Game started");
          this.pendingUser.send("Game started");
          ``;
          this.pendingUser = null;
        } else {
          this.pendingUser = socket;
          socket.send("Waiting for opponent");
        }
      }

      // Move handling
      if (message.type === MOVE) {
        const game = this.getGame(socket);
        if (!game) return socket.send("You are not in a game");
        const result = game?.makeMove(socket, message.move);
        if (result) {
          socket.send(result);
        }
      }
    });
  }
}
