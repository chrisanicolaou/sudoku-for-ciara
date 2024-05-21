export type ApiSudoku = {
  newboard: NewBoard;
};

export type NewBoard = {
  grids: Grid[];
  results: number;
  message: string;
};

export type Grid = {
  value: number[][];
  solution: number[][];
  difficulty: string;
};
