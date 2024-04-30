import { WebSocket } from "ws";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  private board: string;
  private moves: string[];
  private startTime: Date;
  constructor(p1: WebSocket, p2: WebSocket) {
    this.player1 = p1;
    this.player2 = p2;
    this.board = "";
    this.moves = [];
    this.startTime = new Date();
  }

  makeMove(socket: WebSocket, move: string) {
    // who is making the move
    // is the move valid
    // is the player checked
    // update the board
    // push the move
    // check if the game is over
    // send the updated board to both players
  }
}
