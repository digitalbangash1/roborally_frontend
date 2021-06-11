import React, {FunctionComponent, useCallback, useContext, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import styles from "../styling/DashboardComponent.module.scss"
import GameContext from "../context/GameContext";
import {Board} from "../types/Board";

type DashboardComponentProps = {}
const DashboardComponent: FunctionComponent<DashboardComponentProps> = () => {
    const {
        board, getBoards, switchBoard, addPlayerToBoard, player,
        initializeCurrentPlayer, getBoard
    } = useContext(GameContext)
    const [boards, setBoards] = useState<Board[]>([]);
    const [refreshBoards, setRefreshBoards] = useState<boolean>(false);
    const history = useHistory();

    useEffect(() => {
        console.log('Getting boards')
        getBoards().then(boards => {
            console.log('Got boards', boards);
            setBoards(boards);
        });
        setRefreshBoards(false);
    }, [board, refreshBoards])

    const onSwitchBoard = useCallback(async (boardId: number) => {
        board.boardId = boardId;
        player.boardId = boardId;
        console.log('adding player: ', player);
        await addPlayerToBoard(boardId);
        await switchBoard(boardId)
        const updatedBoard = await getBoard(boardId)
        if (updatedBoard != null && updatedBoard.playerDtos.length >= 2) {
            await initializeCurrentPlayer(boardId, player.playerId);
            history.push('/board/' + boardId)
        }

    }, [])

    return (
        <div>
            <div>
                <h3 className={styles.boardsTitle}>Boards</h3>
                <CreateBoardButtonComponent getBoards={() => boards} setRefreshBoards={setRefreshBoards}/>
                <button onClick={() => setRefreshBoards(true)} className={styles.refreshButton}>
                    Refresh
                </button>
            </div>
            <ol>
                {boards.map((board) => (
                    <li key={board.boardId}>
                        <div>
                            <div className={styles.board}>{board.boardName}</div>
                            <button className={styles.editButton}>Edit</button>
                            <button onClick={() => onSwitchBoard(board.boardId)} className={styles.playButton}>Play
                            </button>
                        </div>
                        <ol>
                            {board.playerDtos.map((player) => (
                                <li key={player.playerId}>{player.playerName}</li>
                            ))}
                        </ol>
                    </li>
                ))}
            </ol>
        </div>

    )
}

type CreateBoardButtonProps = {
    getBoards: () => Board[],
    setRefreshBoards: (refresh: boolean) => void;
}
const CreateBoardButtonComponent: FunctionComponent<CreateBoardButtonProps> =
    ({getBoards, setRefreshBoards}) => {
        const {board, createBoard,} = useContext(GameContext)
        const onCreate = useCallback(async () => {
            console.log('Creating new board');
            let nextBoardId = 1;
            const boards = getBoards();
            if (boards.length > 0) {
                nextBoardId = boards[boards.length - 1].boardId + 1;
            }
            await createBoard({
                boardId: -1, boardName: "Board " + nextBoardId, width: 8, height: 8,
                playerDtos: board.playerDtos, spaceDtos: board.spaceDtos
            })
            setRefreshBoards(true);
        }, [getBoards, setRefreshBoards])

        return (
            <button onClick={onCreate}>
                Create new board
            </button>
        );
    }

export default DashboardComponent


