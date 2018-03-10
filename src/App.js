import React, { Component } from 'react';
import { BrowserRouter, Switch, Route} from 'react-router-dom';
// import io from 'socket.io-client';
import Login from './components/Login';
import Question from './components/Question';
import AdminIndex from './components/admin/adminIndex';
import statsListener from './components/statsListener/Stats';
import './css/common.css';


class App extends Component {
    constructor(){
        super();
        this.state = {
            isLoggedIn : false
        }
    }
    // componentDidMount(){
    //     if(localStorage.getItem('token') === null){
    //         this.setState({isLoggedIn : false});
    //     }else {
    //         this.setState({isLoggedIn : true});
    //         <Redirect to="/question" />
    //     }
    // }
    render() {
    return (
      <div className="App">
        <BrowserRouter>
            <div>
                {/* { this.state.isLoggedIn ?
                    <Switch>
                        <Route exact path='/question' component={Question} />
                    </Switch> :
                    <Switch>
                        <Route exact path='/' component={Login} />
                        <Route render={() => <h1>Page not found <Link to="/">Login</Link></h1>} />
                    </Switch>
                 } */}
                 <Switch>
                     <Route exact path='/question' component={Question}  />
                     <Route exact path='/' component={Login}  />
                     <Route exact path='/admin-c2c-hidden-97' component= {AdminIndex} />
                     <Route exact path='/stats' component = {statsListener} />
                 </Switch>
            </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
