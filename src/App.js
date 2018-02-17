import React, { Component } from 'react';
import { BrowserRouter, Switch, Route,Redirect,Link } from 'react-router-dom';
import io from 'socket.io-client';
import Login from './components/Login';
import Question from './components/Question';


//const socket = io(url);


class App extends Component {
    constructor(){
        super();
        this.state = {
            isLoggedIn : false
        }
    }
    componentDidMount(){
        if(localStorage.getItem('token') === null){
            this.setState({isLoggedIn : false});
        }else {
            this.setState({isLoggedIn : true});
            <Redirect to="/question" />
        }
    }
    render() {
    return (
      <div className="App">
        <BrowserRouter>
            <div>
                {/* {!localStorage.getItem('token') &&
                    <Switch>
                        <Route exact path='/' component={Login} />
                        <Route render={() => <h1>Page not found</h1>} />
                    </Switch>
                } */}
                {/* {localStorage.getItem('token') &&
                    <div>
                        <Switch>
                            <Route exact path='/question' component={Question} />
                        </Switch>
                    </div>
                } */}
                { this.state.isLoggedIn ?
                    <Switch>
                        <Route exact path='/question' component={Question} />
                    </Switch> :
                    <Switch>
                        <Route exact path='/' component={Login} />
                        <Route render={() => <h1>Page not found <Link to="/">Login</Link></h1>} />
                    </Switch>
                 }
            </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
