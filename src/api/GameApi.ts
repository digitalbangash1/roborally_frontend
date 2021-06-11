import axios from "axios";
import {Board} from "../types/Board";
import {Space} from "../types/Space";
import {Player} from "../types/Player";

class GameApi{
    private static instance : GameApi;
    private readonly BACKEND_URL = "http://localhost:8080"
    private constructor() {}

    public static getInstance():GameApi{
        if(!GameApi.instance){
            GameApi.instance = new GameApi();
        }
        return GameApi.instance;
    }

    public getBoard(boardId : number){
        return axios.get<Board>(`${this.BACKEND_URL}/board/${boardId}`).then(value =>value.data)
    }

    public moveCurrentPlayer(boardId : number, space : Space){
        return axios.put(`${this.BACKEND_URL}/board/${boardId}/move`,space)
    }

    public switchPlayer(boardId : number){
        return axios.put(`${this.BACKEND_URL}/board/${boardId}/switchplayer`)
    }

    public setCurrentPlayer(boardId : number, playerId: number){
        return axios.put(`${this.BACKEND_URL}/board/${boardId}/currentPlayer/${playerId}`)
    }

    public createBoard(board: Board){
        return axios.post(`${this.BACKEND_URL}/board`, board)
    }

    public getBoards(){
        return axios.get<Board[]>(`${this.BACKEND_URL}/board`).then(response => response.data);
    }

    public addPlayerToBoard(boardId: number, player: Player){
        return axios.post<Player>(`${this.BACKEND_URL}//board/${boardId}/player`, player)
            .then(response => {
                console.log(response.data);
                return response.data;
            });
    }
}

export default GameApi.getInstance()