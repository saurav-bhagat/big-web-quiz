import React from 'react';
import io from 'socket.io-client';
import swal from 'sweetalert';


let adminSocket;
class AdminIndex extends React.Component {
    constructor(){
        super();
        console.log("inside adin constructior");
        adminSocket = io('http://159.89.173.175:3000');
        adminSocket.on('connect', (back) => {
            console.log(back);
            adminSocket.emit('adminLogin', {username: "akshitgrover", password: "c2c_2.0"}, (res) => {
                console.log(res);
            })
        });

        adminSocket.on('getAdminToken', (data) => {

            adminSocket.emit('open');
        });

        adminSocket.on('disconnect', ()=> {
            console.log("admin disconnect");
        });
        adminSocket.on('saved', (data) => {

        });

        this.giveQuestion = this.giveQuestion.bind(this);
        this.lockQuiz     = this.lockQuiz.bind(this);
    }

    giveQuestion = () => {
        // console.log("give Question");
        adminSocket.emit('sendQue', (err) => {
            console.log("inside sendQue");

        });
    }
    lockQuiz = () => {
        console.log("Inside lock Quiz");
        adminSocket.emit('lockIt', (err) => {
            console.log(err);
        });
    }
    openQuiz = () => {
        console.log("Inside openQuiz");
        adminSocket.emit('open', (err) => {
            console.log(err);
        });
    }
    saveScore = () => {
        adminSocket.emit('saveScore' , (err) => {
            console.log(err);
        });
    }

    getCorRes = () => {
        adminSocket.emit('getCorRes', (data) => {
            console.log(data);
        });
    }
    render(){
        return(
            <div>
                I am a Amdin
                <br />
                <button className="btn" onClick={this.giveQuestion} >Give Question</button>
                <br /><br />
                <button className="btn" onClick={this.lockQuiz} >Lock Quiz</button>
                <br /><br />
                <button className="btn" onClick={this.openQuiz} >Open Quiz</button>
                <br /><br />
                <button className="btn" onClick={this.saveScore} >Save Score</button>
                <br /><br />
                <button className="btn" onClick={this.getCorRes} >Show Response</button>
            </div>
        );
    }
}

export default AdminIndex;
