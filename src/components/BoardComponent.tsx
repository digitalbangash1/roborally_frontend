import React, {FunctionComponent, useContext} from 'react';
import {SpaceComponent} from "./SpaceComponent";
import styles from "../styling/BoardComponent.module.scss" //Import css module
import GameContext from "../context/GameContext";
/*
If the board component took any props/arguments they would be declared inside the type below
see the space component for an example.
 */

const numbers = [1, 2, 3, 4, 5];

type BoardComponentProps = {}
const BoardComponent: FunctionComponent<BoardComponentProps> = () => {
    //{...} context is known as object destructuring
    const {board, loaded, player, currentPlayer, getBoard} = useContext(GameContext) //Hook form of Context.Consumer, used to access the context
    return (
        /*Apply css on div below*/
        <div>
            <h3>{player.playerName} ({player.playerColor}) - You</h3>
            <h3>Current player: {currentPlayer.playerName} - {currentPlayer.playerColor}</h3>
            <div className={styles.container}>
                {/*
                The {...} notation is JSX allowing us to blend HTML and JS/TS together
                The first map call returns an array of "divs" which are rendered.
                Keys helps react identify where a change has happend and thus which component to rerender upon changes
                The last map returns an array of space components, note that a prop/argument is passed ("space")
                The result of the code segment below will be something like:
                    <div key="spaceArray0">
                        <SpaceComponent key="space0" space={SOME_SPACE_OBJECT}/>
                        ...
                        <SpaceComponent key="space7" space={SOME_SPACE_OBJECT}/>
                    </div>
                    ....
                    <div key="spaceArray7">
                        <SpaceComponent key="space0" space={SOME_SPACE_OBJECT}/>
                        ...
                        <SpaceComponent key="space7" space={SOME_SPACE_OBJECT}/>
                    </div>

            */}
                {loaded ? (

                    board.spaceDtos.map((spaceArray, index) =>
                        <div key={"spaceArray" + index}>
                            {
                                spaceArray.map((space, index) => <SpaceComponent key={"space" + index} space={space}/>)
                            }
                        </div>
                    )

                ) : <h1>loading...</h1>}


            </div>
        </div>
    )
}

export default BoardComponent


