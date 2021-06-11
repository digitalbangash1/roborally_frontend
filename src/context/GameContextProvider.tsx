import React, {ReactNode, useCallback, useEffect, useMemo, useState} from "react"
import GameContext from "./GameContext"
import {Player} from "../types/Player";
import {Board} from "../types/Board";
import {Space} from "../types/Space";
import GameApi from "../api/GameApi";

type GameContextProviderPropsType = {
    children: ReactNode
}


const GameContextProvider = ({children}: GameContextProviderPropsType) => {
    const [loaded, setLoaded] = useState<boolean>(false)
    useEffect(() => {
    }, [])
    //The code below is executed when the provider is rendered (inside App.tsx)
    //The code should fetch the data from the API instead of using a static assignment
    //Define a useState variable, note that useState returns an array, containing that state itself aswell as
    // a function to set a new state value, here we use array destructuring (the [..., ...] notation).
    // we also declare that the state variable and setter should be of type /take type Player[]

    const [players, setPlayers] = useState<Player[]>([])
    const playerCount = useMemo(() => players.length, [players])
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0)
    const [currentPlayer, setCurrentPlayer] = useState<Player>({
        playerId: -1,
        playerColor: "red",
        boardId: -1,
        playerName: ""
    })
    const [player, setPlayer] = useState<Player>({
        playerId: -1,
        boardId: -1,
        playerName: '',
        playerColor: "blue"
    })
    const [spaces, setSpaces] = useState<Space[][]>([])
    const [width, setWidth] = useState<number>(0)
    const [height, setHeight] = useState<number>(0)
    const [gameId, setGameId] = useState<number>(0)
    const [gameName, setGameName] = useState<string>("hi")

    //Define a function used to set a player ona  specific space
    const setPlayerOnSpace = useCallback(async (space: Space) => {
        console.log('setPlayerOnSpace', currentPlayer.playerName, currentPlayer.playerColor)
        //Check if space already has a player standing on it
        if (!space.playerId) {
            await GameApi.moveCurrentPlayer(gameId, {...space, playerId: currentPlayer.playerId}).then(() => {
                let tempSpaces = [...spaces] //Use spread operator to copy spaces array, needed for making immutable changes
                //See https://bit.ly/2My8Bfz, until the section about Immutable.js
                tempSpaces[space.x][space.y].playerId = currentPlayer.playerId //Set the player on the new space they clicked on

                if (currentPlayer.x !== undefined && currentPlayer.y !== undefined) { //If the player was standing on a space previously, remove them from that space
                    tempSpaces[currentPlayer.x][currentPlayer.y].playerId = undefined
                }
                setSpaces(tempSpaces)
                let tempPlayers = [...players]
                tempPlayers[currentPlayerIndex].x = space.x; //Update the players array to reflect the changes
                tempPlayers[currentPlayerIndex].y = space.y; //Update the players array to reflect the changes
                setPlayers(tempPlayers)
                setCurrentPlayer({...currentPlayer, x: space.x, y: space.y}) //Update current player

            }).catch(() => {
                console.error("Error while moving player")
            })

        }

    }, [currentPlayer, currentPlayerIndex, gameId, players, spaces])

    const switchToNextPlayer = useCallback(async () => {
        console.log('switchToNextPlayer', currentPlayer.playerName)
        await GameApi.switchPlayer(gameId).then(() => {
            const newPlayerIndex = (currentPlayerIndex + 1) % playerCount
            console.log("old player index", currentPlayerIndex, "new player index", newPlayerIndex)
            const nextPlayer = players[newPlayerIndex]
            setCurrentPlayer(nextPlayer)
            console.log('switchToNextPlayer after update', currentPlayer.playerName)
            setCurrentPlayerIndex(newPlayerIndex)
        }).catch(() => console.error("Error while switching player"))

    }, [currentPlayerIndex, gameId, playerCount, players])

    const createBoard = useCallback(async (board: Board) => {
        await GameApi.createBoard(board).then(() => {
            console.log("Created a new board")
        }).catch(() => console.error("Error while creating board"))
    }, [])

    const initializeCurrentPlayer = useCallback(async (boardId: number, playerId: number) => {
        await GameApi.setCurrentPlayer(boardId, playerId).then(() => {
            console.log("Set current player")
        }).catch(() => console.error("Error while creating board"))
    }, [])

    const switchBoard = useCallback(async (boardId: number) => {
        // await GameApi.createBoard(board).then(() => {
        //     console.log("Created a new board")
        // }).catch(() => console.error("Error while creating board"))
        await getBoardById(boardId);
    }, [])

    const getBoardById = (boardId: number) => {
        GameApi.getBoard(boardId).then(board => {
            setSpaces(board.spaceDtos)
            setPlayers(board.playerDtos)
            setWidth(board.width)
            setHeight(board.height)
            setGameId(board.boardId)
            setGameName(board.boardName)
            if (board.currentPlayerDto) {
                setCurrentPlayer(board.currentPlayerDto)
                board.playerDtos.forEach((player, index) => {
                    if (player.playerId === board.currentPlayerDto?.playerId) {
                        setCurrentPlayerIndex(index)
                    }
                })

            }

            setLoaded(true)
        }).catch(() => {
            console.error("Error while fetching board from backend")
        })
    }

    const getBoards = (): Promise<Board[]> => {
        return GameApi.getBoards();
    }

    const getBoard = (boardId: number): Promise<Board> => {
        return GameApi.getBoard(boardId);
    }

    const addPlayerToBoard = useCallback(async (boardId: number) => {
        await GameApi.addPlayerToBoard(boardId, player).then((p: Player) => {
            player.playerId = p.playerId
            player.playerName = p.playerName
            player.playerColor = p.playerColor
            player.boardId = p.boardId
            player.x = p.x
            player.y = p.y
        }).catch(() => console.error("Error while adding player to board"))
    }, [])

    const board = useMemo<Board>(() => {
        return ({
            spaceDtos: spaces,
            playerDtos: players,
            currentPlayerDto: currentPlayer,
            currentPlayerIndex: currentPlayerIndex,
            width: width,
            height: height,
            boardName: gameName,
            boardId: gameId
        })
    }, [currentPlayer, currentPlayerIndex, gameId, gameName, height, players, spaces, width])


    return (
        <GameContext.Provider
            value={
                {
                    loaded: loaded,
                    board: board,
                    setCurrentPlayerOnSpace: setPlayerOnSpace,
                    switchCurrentPlayer: switchToNextPlayer,
                    initializeCurrentPlayer: initializeCurrentPlayer,
                    createBoard: createBoard,
                    getBoards: getBoards,
                    switchBoard: getBoardById,
                    player: player,
                    currentPlayer: currentPlayer,
                    addPlayerToBoard: addPlayerToBoard,
                    getBoard: getBoard
                }
            }>
            {children} {/*See: https://reactjs.org/docs/composition-vs-inheritance.html*/}
        </GameContext.Provider>
    )
}

export default GameContextProvider