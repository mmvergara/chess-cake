import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { ERROR, MOVE_MADE } from "./Messages";

export class Game {
  public white: WebSocket;
  public black: WebSocket;
  public currentColor: "white" | "black";
  private board: Chess;
  private moves: string[];
  private startTime: Date;
  constructor(white: WebSocket, black: WebSocket) {
    this.white = white;
    this.black = black;
    this.currentColor = "white";
    this.board = new Chess();
    this.moves = [];
    this.startTime = new Date();
  }

  private getCurrentPlayer(socket: WebSocket) {
    if (this.white === socket) {
      return "white";
    }
    return "black";
  }

  makeMove(socket: WebSocket, move: string) {
    if (this.getCurrentPlayer(socket) !== this.currentColor) {
      return "It's not your turn";
    }
    try {
      this.board.move(move);
      this.moves.push(move);
      this.currentColor = this.currentColor === "white" ? "black" : "white";
      return {
        type: MOVE_MADE,
        fen: this.board.fen(),
        san: move,
      };
    } catch (error) {
      return {
        type: ERROR,
        message: String(error),
      };
    }
  }
}
