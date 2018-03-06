import React from 'react';
import io from 'socket.io-client';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import './../css/login.css';
import c2cLogo from './../images/logowhite.png';

let userSocket;

class Login extends React.Component {
    constructor(){
        super();
        this.state = {
            username: ''
        }
        console.log("ionside login constructior");
        userSocket = io(`http://159.89.173.175:3000`);
        userSocket.on('connect', () => {
            console.log("connected");
        });
        //below function is when user has already joined then redirect to next page
        userSocket.on('joinToken', (data) => {
            console.log("!CALLED!");
            userSocket.disconnect();
            this.props.history.push('/question');

        });

        userSocket.on('disconnect' , () => {
            console.log("disconnected");
        });
        this.usernameChange = this.usernameChange.bind(this);
        this.handleJoin = this.handleJoin.bind(this);
    }

    usernameChange = (e) => {
        this.setState({username : e.target.value});
    }
    handleJoin = () => {
        console.log("username is : "+this.state.username);
        let username = this.state.username;
        localStorage.setItem('username', username);
        userSocket.emit('join', {username: username}, (err) => {
            console.log(err);
            swal("Oops!", err.err , "error");
            this.setState({username : ''});
        });
    }
    render(){
        return(
            <div className="login-container">
                <div className="c2cLogo" >
                    <img src={ c2cLogo }  alt="code2create" />
                </div>
                <div className="login-wrapper z-depth-5">
                    <h4>Username: </h4>
                    <input type="text" onChange={this.usernameChange} />

                    <input type="submit" value="Join" className="btn" onClick={this.handleJoin} />
                </div>
            </div>
        );
    }
}

export default withRouter(Login);
