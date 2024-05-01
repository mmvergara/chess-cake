import { Chess, Move, Square } from "chess.js";
import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import ChessBoard from "../components/ChessBoard";
import {
  GAME_STARTED,
  IN_QUEUE,
  MOVE_MADE,
  START_QUEUE,
} from "../lib/Messages";

const GamePage = () => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [color, setColor] = useState<"white" | "black">("white");
  const [chess, setChess] = useState<Chess>(new Chess());
  const [availableMoves, setAvailableMoves] = useState<Move[]>([]);
  const [status, setStatus] = useState<string>("");
  const availableMovesTiles = availableMoves.map((move) => move.to);
  const ws = useSocket();
  const findGame = () => {
    if (!ws) return alert("No connection to server");
    ws.send(JSON.stringify({ type: START_QUEUE }));
  };

  const handleClick = (square: Square) => {
    let move = availableMoves.find((move) => move.to === square);
    // Check if the move is a promotion and set it to queen
    if (move?.promotion) {
      move = availableMoves.find(
        (move) => move.to === square && move.promotion === "q"
      );
    }
    if (move) {
      chess.move(move);
      setChess(chess);
      setAvailableMoves([]);
      return;
    }
    setAvailableMoves(chess.moves({ square, verbose: true }));
  };
  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);

        switch (message.type) {
          case IN_QUEUE:
            setStatus("Finding opponent");
            console.log("Finding opponent");
            break;
          case GAME_STARTED:
            setGameStarted(true);
            setColor(message.color);
            break;

          case MOVE_MADE:
            console.log("Move made");
            console.log(event.data);
            break;

          default:
            console.log("Unknown message type");
        }
      };
    }
  }, [ws]);
  return (
    <main className="flex flex-row justify-center">
      <section className="text-white">
        <button className="bg-red-500 flex" onClick={findGame}>
          Find Game
        </button>
        <p>{status}</p>
      </section>
      {gameStarted && (
        <section aria-label="board" className="flex justify-center">
          <ChessBoard
            availableMovesTiles={availableMovesTiles}
            onClick={handleClick}
            chess={chess}
            color={color}
          />
        </section>
      )}
      <section aria-label="controls"></section>
    </main>
  );
};

export default GamePage;
