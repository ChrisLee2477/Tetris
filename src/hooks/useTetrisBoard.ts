import { useReducer, Dispatch } from "react";
import {
  Block,
  BlockShape,
  BoardShape,
  EmptyCell,
  SHAPES,
} from "../components/types";

export const BOARD_HEIGHT = 20;
export const BOARD_WIDTH = 10;

export type BoardState = {
  board: BoardShape;
  droppingRow: number;
  droppingColumn: number;
  droppingBlock: Block;
  droppingShape: BlockShape;
};

export function useTetrisBoard(): [BoardState, Dispatch<Action>] {
  const [boardState, dispatchBoardState] = useReducer(
    boardReducer,
    {
      board: [],
      droppingRow: 0,
      droppingColumn: 0,
      droppingBlock: Block.I,
      droppingShape: SHAPES.I.shape,
    },
    (emptyState) => {
      const state = {
        ...emptyState,
        board: getEmptyBoard(),
      };
      return state;
    }
  );
  return [boardState, dispatchBoardState];
}

export function getRandomBlock(): Block {
  const blockValues = Object.values(Block);
  return blockValues[Math.floor(Math.random() * blockValues.length)] as Block;
}

export function hasCollosions(
  board: BlockShape,
  currentShape: BlockShape,
  row: number,
  column: number
): boolean {
  let hasCollosion = false;
  currentShape
    .filter((shapeRow) => shapeRow.some((isSet) => isSet))
    .forEach((shapeRow: boolean[], rowIndex: number) => {
      shapeRow.forEach((isSet: boolean, colIndex: number) => {
        if (
          isSet &&
          (row + rowIndex >= board.length ||
            column + colIndex >= board[0].length ||
            column + colIndex < 0 ||
            board[row + rowIndex][column + colIndex] !== EmptyCell.Empty)
        ) {
          hasCollosion = true;
        }
      });
    });
  return hasCollosion;
}

type Action = {
  type: "start" | "drop" | "commit" | "move";
  newBoard?: BlockShape;
  newBlock?: Block;
};

function boardReducer(state: BoardState, action: Action): BoardState {
  let newState = { ...state };
  switch (action.type) {
    case "start":
      const firstBlock = getRandomBlock();
      return {
        board: getEmptyBoard(),
        droppingRow: 0,
        droppingColumn: 3,
        droppingBlock: firstBlock,
        droppingShape: SHAPES[firstBlock].shape,
      };
    case "drop":
      newState.droppingRow++;
      break;
    case "commit":
      return {
        board: action.newBoard,
        droppingRow: 0,
        droppingColumn: 3,
        droppingBlock: action.newBlock!,
        droppingShape: SHAPES[action.newBlock!].shape,
      };
    case "move":
    default:
      const unhandledType: never = action.type;
      throw new Error(`Unhandled action type: ${unhandledType}`);
  }
  return newState;
}

export function getEmptyBoard(height = BOARD_HEIGHT): BoardShape {
  return Array(height)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(EmptyCell.Empty));
}
