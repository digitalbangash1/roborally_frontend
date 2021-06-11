import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import BoardComponent from "./components/BoardComponent";
import GameContextProvider from "./context/GameContextProvider";
import DashboardComponent from "./components/DashboardComponent";

function App() {

    return (
        <GameContextProvider>
            <Router>
                <div>
                    <h2>Roborally</h2>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <ul className="navbar-nav mr-auto">
                            <li><Link to={'/'} className="nav-link">Dashboard</Link></li>
                        </ul>
                    </nav>
                    <hr/>
                    <Switch>
                        <Route exact path='/' component={DashboardComponent}/>
                        <Route path='/board/:id' component={BoardComponent}/>
                    </Switch>
                </div>
            </Router>
        </GameContextProvider>
    );

    // return (
    //     <div className="App">
    //         <header className="App-header">
    //         </header>
    //         {/*Context provider component below makes sure the context is accessible in any children components*/}
    //         <GameContextProvider>
    //             <DashboardComponent/>
    //         </GameContextProvider>
    //     </div>
    // );
}

export default App;
