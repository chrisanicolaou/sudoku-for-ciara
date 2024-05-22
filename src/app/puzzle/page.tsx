"use client";

import { useEffect, useRef, useState } from "react";
import { fetchRandomSudoku } from "../lib/sudoku-fetcher";
import { ApiSudoku } from "../lib/types/api-sudoku";

export default function Puzzle() {
  const [puzzle, setPuzzle] = useState({} as ApiSudoku);
  const [currentRowColumnIndex, setCurrentRowColumnIndex] = useState("");
  const puzzleRef = useRef({} as ApiSudoku);
  puzzleRef.current = puzzle;
  const currentRowColumnIndexRef = useRef("");
  currentRowColumnIndexRef.current = currentRowColumnIndex;

  useEffect(() => {
    window.addEventListener("keydown", tryUpdateSudokuCell);
    fetchRandomSudoku().then((puzzle) => {
      console.log("fetched puzzle:" + puzzle);
      setPuzzle(puzzle as ApiSudoku);
    });
  }, []);

  function tryUpdateSudokuCell(event: KeyboardEvent) {
    if (!currentRowColumnIndexRef.current) return;

    const numberPressed = parseInt(event.key);
    console.log("Press registered");

    if (Number.isNaN(numberPressed)) return;

    tryUpdatePuzzle(numberPressed);
  }

  function tryUpdatePuzzle(numberPressed: number) {
    const puzzle = puzzleRef.current;
    const currentRowColumnIndex = currentRowColumnIndexRef.current;
    if (!puzzle?.newboard?.grids[0]) return;
    setCurrentRowColumnIndex(() => "");
    const rowIndex = parseInt(currentRowColumnIndex[0]);
    const colIndex = parseInt(currentRowColumnIndex[2]);
    const newGrid = puzzle.newboard.grids[0];
    newGrid.value[rowIndex][colIndex] = numberPressed;
    setPuzzle((prevPuzzle) => ({
      ...prevPuzzle,
      newboard: {
        ...prevPuzzle.newboard,
        grids: [
          {
            ...newGrid
          }
        ]
      }
    }));
  }

  return (
    <>
      <h2>Difficulty: {puzzle?.newboard?.grids[0]?.difficulty}</h2>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="grid grid-cols-9 grid-rows-9 gap-0.5">
          {puzzle?.newboard?.grids[0]?.value?.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const colRowIndex = `${rowIndex}-${colIndex}`;

              return (
                <div
                  key={colRowIndex}
                  className={`w-12 h-12 flex justify-center items-center border ${
                    (rowIndex + 1) % 3 === 0 && rowIndex !== 8
                      ? "border-b-2"
                      : ""
                  } ${
                    (colIndex + 1) % 3 === 0 && colIndex !== 8
                      ? "border-r-2"
                      : ""
                  } border-gray-300 text-center ${getCellBackgroundColour(
                    colRowIndex,
                    cell
                  )}`}
                  onClick={() => {
                    if (cell && cellIsSolved(colRowIndex, cell)) return;
                    return setCurrentRowColumnIndex(colRowIndex);
                  }}
                >
                  <span className="text-lg text-black">
                    {cell !== 0 ? cell : ""}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );

  function getCellBackgroundColour(colRowIndex: string, cell: number) {
    if (
      currentRowColumnIndex === colRowIndex &&
      (!cell || !cellIsSolved(colRowIndex, cell))
    )
      return "bg-yellow-500";
    if (!cell) return "bg-white";
    const correctCellValue = findCellValueInSolution(colRowIndex);
    if (correctCellValue !== cell) return "bg-red-500";
    return "bg-white";
  }

  function findCellValueInSolution(colRowIndex: string) {
    if (!puzzle?.newboard?.grids[0]) return;
    const rowIndex = parseInt(colRowIndex[0]);
    const colIndex = parseInt(colRowIndex[2]);
    return puzzle?.newboard?.grids[0].solution[rowIndex][colIndex];
  }

  function cellIsSolved(colRowIndex: string, cell: number) {
    const correctCellValue = findCellValueInSolution(colRowIndex);
    return correctCellValue === cell;
  }
}
