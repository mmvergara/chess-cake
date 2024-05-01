import { WebSocket } from "ws";
import { Game } from "./Game";
import { GAME_STARTED, MOVE, START_QUEUE } from "./Messages";

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
    this.addMessageHandler(socket);
    console.log("Users: ", this.users.length);
  }
  removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user !== socket);
    // Stop the game if there are no users left
    console.log("Users: ", this.users.length);
  }

  private getGame(socket: WebSocket) {
    return this.games.find(
      (game) => game.white === socket || game.black === socket
    );
  }

  private initializeGameHandler(socket: WebSocket) {
    // Check if the user is already in a game
    if (this.getGame(socket)) {
      return socket.send("You are already in a game");
    }
    // Check if there is a pending user
    if (this.pendingUser) {
      // Create a new game
      const game = new Game(this.pendingUser, socket);
      game.white.send(JSON.stringify({ type: GAME_STARTED, color: "white" }));
      game.black.send(JSON.stringify({ type: GAME_STARTED, color: "black" }));
      this.games.push(game);
      console.log("Game started");
      this.pendingUser = null;
    } else {
      // If there is no pending user, set the current user as pending
      this.pendingUser = socket;
      console.log("Waiting for opponent");
      socket.send(JSON.stringify({ type: "IN_QUEUE" }));
    }
  }

  private moveHandler(socket: WebSocket, move: string) {
    // find the game
    const game = this.getGame(socket);

    // Check if the user is in a game
    if (!game) return socket.send("You are not in a game");

    // Make the move
    const result = game.makeMove(socket, move);

    // Send the result to both players
    if (result) {
      game.white.send(JSON.stringify(result));
      game.black.send(JSON.stringify(result));
    }
  }

  private addMessageHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      console.log("Message: ", message);

      // Game initialization
      if (message.type === START_QUEUE) {
        console.log("Initializing game");
        return this.initializeGameHandler(socket);
      }
      // Move handling
      if (message.type === MOVE) {
        console.log("Making move");
        return this.moveHandler(socket, message.move);
      }
    });
  }
}
