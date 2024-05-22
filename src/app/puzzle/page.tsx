"use client";

import { useEffect, useRef, useState } from "react";
import { fetchRandomSudoku } from "../lib/sudoku-fetcher";
import { getRandomPictureFilePath } from "../lib/data/files";
import { ApiSudoku } from "../lib/types/api-sudoku";
import Image from "next/image";
import { MdEditOff, MdModeEdit } from "react-icons/md";

export default function Puzzle() {
  const [puzzle, setPuzzle] = useState({} as ApiSudoku);
  const [currentRowColumnIndex, setCurrentRowColumnIndex] = useState("");
  const puzzleRef = useRef({} as ApiSudoku);
  puzzleRef.current = puzzle;
  const currentRowColumnIndexRef = useRef("");
  currentRowColumnIndexRef.current = currentRowColumnIndex;
  const [randomPictureFilePath, setRandomPictureFilePath] = useState("");
  const [noteMode, setNoteMode] = useState(false);
  const [notes, setNotes] = useState([[[]]] as Number[][][]);

  useEffect(() => {
    window.addEventListener("keydown", tryUpdateSudokuCell);
    if (randomPictureFilePath === "") {
      getRandomPictureFilePath().then((randomPictureFilePath) => {
        console.log(randomPictureFilePath);
        setRandomPictureFilePath(randomPictureFilePath);
      });
    }
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
    const rowIndex = parseInt(currentRowColumnIndex[0]);
    const colIndex = parseInt(currentRowColumnIndex[2]);

    if (noteMode) {
      tryAddNoteToCell(numberPressed, rowIndex, colIndex);
      return;
    }
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
    setCurrentRowColumnIndex(() => "");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h2 className="text-center text-2xl">
        Difficulty: {puzzle?.newboard?.grids[0]?.difficulty}
      </h2>
      <Image
        src={
          randomPictureFilePath != ""
            ? `/${randomPictureFilePath}`
            : "/bad-haircut.jpg"
        }
        alt="Overlay"
        width={500}
        height={500}
        className="w-full h-full absolute opacity-30 pointer-events-none"
      />
      <div className="flex gap-5 items-center">
        <button
          className="bg-black"
          onClick={() => {
            setNoteMode((nodeMode) => !nodeMode);
          }}
        >
          {noteMode ? <MdEditOff /> : <MdModeEdit />}
        </button>
        <div className="relative flex justify-center items-center">
          <div className="relative">
            {/* <div className="absolute inset-0 z-10 opacity-10 pointer-events-none">
            <Image
            src="/happy-cat.jpg"
            alt="Overlay"
            width={500}
            height={500}
            className="w-full h-full object-cover"
            />
          </div> */}
            <div className="grid grid-cols-9 grid-rows-9 border-4 rounded-md z-20">
              {puzzle?.newboard?.grids[0]?.value?.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const colRowIndex = `${rowIndex}-${colIndex}`;

                  return (
                    <div
                      key={colRowIndex}
                      className={`w-12 h-12 flex justify-center items-center border ${
                        (rowIndex + 1) % 3 === 0 && rowIndex !== 8
                          ? "border-b-2 border-b-gray-300"
                          : ""
                      } ${
                        (colIndex + 1) % 3 === 0 && colIndex !== 8
                          ? "border-r-2 border-r-gray-300"
                          : ""
                      } text-center ${getCellBackgroundColour(
                        colRowIndex,
                        cell
                      )}`}
                      onClick={() => {
                        if (cell && cellIsSolved(colRowIndex, cell)) return;
                        return setCurrentRowColumnIndex(colRowIndex);
                      }}
                    >
                      <div className="relative flex justify-center items-center">
                        <div className="relative">
                          {notes[rowIndex] &&
                            notes[rowIndex][colIndex] &&
                            notes[rowIndex][colIndex].map((note, index) => {
                              return (
                                <span
                                  key={index}
                                  className="text-xs text-black"
                                >
                                  1
                                </span>
                              );
                            })}
                        </div>
                        <span className="text-2xl text-black">
                          {cell !== 0 ? cell : ""}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function regeneratePuzzle() {
    fetchRandomSudoku().then((puzzle) => {
      setCurrentRowColumnIndex(() => "");
      setPuzzle(puzzle as ApiSudoku);
    });
  }

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

  function tryAddNoteToCell(
    numberPressed: number,
    rowIndex: number,
    colIndex: number
  ) {
    const updatedNotes = [...notes];
    const updatedNotesRow = [...updatedNotes[rowIndex]];
    let updatedNotesCell = [...updatedNotesRow[colIndex]];
    if (updatedNotesCell.indexOf(numberPressed) !== -1) return;

    updatedNotesCell = [...updatedNotesCell, numberPressed];
    updatedNotesRow[colIndex] = updatedNotesCell;
    updatedNotes[rowIndex] = updatedNotesRow;

    setNotes(updatedNotes);
  }
}
