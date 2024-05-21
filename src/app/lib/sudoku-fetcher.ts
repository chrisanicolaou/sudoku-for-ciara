import axios from "axios";
import { ApiSudoku } from "./types/api-sudoku";

export const fetchRandomSudoku = async () => {
  try {
    const res = await axios.get("https://sudoku-api.vercel.app/api/dosuku");
    return res.data as ApiSudoku;
  } catch (err) {
    console.log(err);
  }
};
