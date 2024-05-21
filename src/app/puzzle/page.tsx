import { fetchRandomSudoku } from "../lib/sudoku-fetcher";

export default async function Puzzle() {
  const puzzle = await fetchRandomSudoku();

  console.log(puzzle?.newboard.grids);

  // Example static Sudoku grid for demonstration
  const grid = puzzle!.newboard.grids[0].value;

  return (
    <>
      <h2>Difficulty: {puzzle?.newboard.grids[0].difficulty}</h2>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="grid grid-cols-9 grid-rows-9 gap-0.5">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-12 h-12 flex justify-center items-center border ${
                  (rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? "border-b-2" : ""
                } ${
                  (colIndex + 1) % 3 === 0 && colIndex !== 8 ? "border-r-2" : ""
                } border-gray-300 bg-white text-center`}
              >
                <span className="text-lg text-black">
                  {cell !== 0 ? cell : ""}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
