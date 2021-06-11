import {createContext} from "react";
import {Board} from "../types/Board";
import {Space} from "../types/Space";
import {Player} from "../types/Player";

export type GameContextType = {
    loaded : boolean,
    board: Board,
    player: Player;
    currentPlayer: Player,
    setCurrentPlayerOnSpace: (space: Space) => Promise<void>,
    switchCurrentPlayer: () => Promise<void>,
    initializeCurrentPlayer: (boardId: number, playerId: number) => Promise<void>,
    createBoard: (board: Board) => Promise<void>,
    getBoards: () => Promise<Board[]>,
    getBoard: (boardId: number) => Promise<Board | null>,
    switchBoard: (boardId: number) => void,
    addPlayerToBoard: (boardId: number) => Promise<void>,
}
//Define a new context of type GameContextType
//Below we define the "default" values which are set upon initialization of the context

const GameContext = createContext<GameContextType>({
    loaded : false,
    currentPlayer: {
        playerName: '',
        playerId: -1,
        boardId: -1,
        playerColor: "blue",
        x: 0,
        y: 0,
    },
    player: {
      playerName: '',
      playerId: -1,
      boardId: -1,
      playerColor: "blue",
      x: 0,
      y: 0,
    },
    board: {
        playerDtos: [],
        spaceDtos: [],
        boardId: -1,
        boardName: "",
        currentPlayerDto: undefined,
        height: 0,
        width: 0
    },
    setCurrentPlayerOnSpace: async () => {
    },
    switchCurrentPlayer: async () => {
    },
    initializeCurrentPlayer: async () => {
    },
    createBoard: async () => {
    },
    getBoards: async () => {
        return [];
    },
    getBoard: async (boardId: number) => {
        return null;
    },
    switchBoard: async (boardId: number) => {
    },
    addPlayerToBoard: async (boardId: number) => {
    }
});

export default GameContext