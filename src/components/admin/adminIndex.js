import React from 'react';
import io from 'socket.io-client';
import swal from 'sweetalert';


let adminSocket;
class AdminIndex extends React.Component {
    constructor(){
        super();
        console.log("inside adin constructior");
        adminSocket = io('http://192.168.43.12:3000');
        adminSocket.on('connect', (back) => {
            console.log(back);
            adminSocket.emit('adminLogin', {username: "deathadder", password: "1516"}, (res) => {
                console.log(res);
                swal(res);
            })
        });

        adminSocket.on('getAdminToken', (data) => {
            swal(data);
            adminSocket.emit('open');
        });

        adminSocket.on('disconnect', ()=> {
            console.log("admin disconnect");
        });
        adminSocket.on('saved', (data) => {
            swal(data);
        });

        this.giveQuestion = this.giveQuestion.bind(this);
        this.lockQuiz     = this.lockQuiz.bind(this);
    }

    giveQuestion = () => {
        // console.log("give Question");
        adminSocket.emit('sendQue', (err) => {
            console.log("inside sendQue");
            console.log(err);
            swal("Oops!", err.err, "error");
        });
    }
    lockQuiz = () => {
        console.log("Inside lock Quiz");
        adminSocket.emit('lockIt', (err) => {
            console.log(err);
            swal("Oops!", err.err, "error");
        });
    }
    openQuiz = () => {
        console.log("Inside openQuiz");
        adminSocket.emit('open', (err) => {
            console.log(err);
            swal("Oops!", err.err, "error");
        });
    }
    saveScore = () => {
        adminSocket.emit('saveScore' , (err) => {
            console.log(err);
            swal("Oops!", err.err, "error");
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
                <button className="btn" onClick={this.getCorRes} >Save Score</button>
            </div>
        );
    }
}

export default AdminIndex;
