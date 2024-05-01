import { Chess, Move, Square } from "chess.js";
import { useState } from "react";
import Dot from "../components/dot";

const GamePage = () => {
  const [chess, setChess] = useState<Chess>(new Chess());
  const [availableMoves, setAvailableMoves] = useState<Move[]>([]);
  const availableMovesTiles = availableMoves.map((move) => move.to);
  console.log(chess.board());
  const handleClick = (square: Square) => {
    const move = availableMoves.find((move) => move.to === square);
    if (move) {
      chess.move(move);
      setChess(chess);
      setAvailableMoves([]);
      return;
    }
    setAvailableMoves(chess.moves({ square, verbose: true }));
  };
  // prettier-ignore
  const SQUARES: Square[] = [
  'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
  'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
  'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
  'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
  'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
  'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
  'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
  'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'
]
  return (
    <main className="flex flex-row justify-center">
      <section aria-label="board" className="flex justify-center">
        <div className="flex flex-col w-fit p-[30px] bg-[#c7b299]">
          <div className="flex flex-col drop-shadow-xl ">
            {chess.board().map((row, i) => (
              <div key={i} style={{ display: "flex" }}>
                {row.map((piece, j) => {
                  const currentSquare = SQUARES[i * 8 + j];
                  const isHighlighted =
                    availableMovesTiles.includes(currentSquare);
                  const backgroundColor =
                    (i + j) % 2 === 0 ? "#ebecd0" : "#B19470";

                  return (
                    <span
                      key={j}
                      onClick={() => handleClick(currentSquare)}
                      style={{ backgroundColor }}
                      className="w-[76px] h-[76px] flex justify-center items-center cursor-pointer"
                    >
                      {piece ? (
                        <img
                          src={"./" + piece?.type + piece?.color + ".png"}
                          alt={piece?.type}
                          width={62}
                          height={62}
                        />
                      ) : (
                        isHighlighted && <Dot />
                      )}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section aria-label="controls"></section>
    </main>
  );
};

export default GamePage;
