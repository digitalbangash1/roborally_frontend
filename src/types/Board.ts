import {Space} from "./Space";
import {Player} from "./Player";

export type Board = {
    boardId : number,
    boardName : string,
    height : number,
    width : number,
    spaceDtos : Space[][],
    playerDtos : Player[],
    //The "?" operator is a shorthand for currentPlayer : Player | undefined, which means that
    // the currentPlayer property can either be of type Player or undefined
    // see https://www.typescriptlang.org/docs/handbook/interfaces.html#optional-properties
    currentPlayerDto? : Player
}