import React from 'react';
import io from 'socket.io-client';
import swal from 'sweetalert';
import './../css/Question.css';

let userSocket2;
class Question extends React.Component {
    constructor(){
        super();
        this.state = {
            qnum : '',
            qstmt: '',
            qchoice: '',
            responseIndex : -1,
            response : 0,
            userIndex: -1,
            isDisabled : ''
        }
        userSocket2 = io(`http://159.89.173.175:3000`);
        userSocket2.on('connect', () => {
            let username  = localStorage.getItem('username');
            userSocket2.emit('join', {username: username}, (err) => {
                console.log("error is " + err.err);
                swal("Oops!", err.err , "error");
            });
        });
        userSocket2.on('getQue', (data) => {
            console.log("inside get Que");
            this.setState({
                qnum : data.qnum,
                qstmt : data.qstmt,
                qchoice : data.qchoice,
                response : 0,
                userIndex: -1,
                responseIndex : -1,
                isDisabled : ''
            });
        });

        if(this.state.userIndex !== -1) {
            document.getElementById(this.state.userIndex).checked = false;
        }

        userSocket2.on('corResponse', (data)=> {
            console.log(data);
            this.setState({ responseIndex : parseInt(data.dataQues) });
        });

        this.postResponse = this.postResponse.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
    }


    postResponse = () => {
        if(this.state.response.length <= 0){
            swal("Select a option first");
            return;
        }
        userSocket2.emit('postRes', {qnum : this.state.qnum, response : this.state.response}, (err) => {
            console.log(err);
            swal("Oops!", err.err , "error");
            // alert(err.err);
        });
        this.setState({ isDisabled: 'disabled' });
    }

    handleOptionChange = (e) => {
        let newResponse;
        newResponse = e.target.value;
        console.log("Id selected is: " + e.target.id);
        this.setState({response : newResponse , userIndex: parseInt(e.target.id) });
    }
    render(){
        let options = [];
        options = [...this.state.qchoice];
        console.log(options);

        return(
            <div>
                <div className="inc-margin-top"></div>
                <div className="question-card z-depth-5">
                    <br /><br />
                    <h4 className="margin-0">
                        {this.state.qnum}:
                        {this.state.qstmt}
                    </h4>
                    <div className="question-component">
                    {
                        options.map((opt,i) => {

                            console.table([this.state.responseIndex, this.state.userIndex]);

                            if( i  === this.state.userIndex && this.state.responseIndex !== i && this.state.responseIndex !== -1){
                                return (
                                    <p key={i}  className="input-para red-option">
                                        <input className="with-gap"
                                            name="group1"
                                            type="radio"
                                            id={i}
                                            value={opt}
                                            onChange={this.handleOptionChange}
                                         />
                                        <label htmlFor={i} >{ opt }</label>
                                    </p> );
                            }

                            else if( i === this.state.responseIndex){
                                return (
                                    <p key={i}  className="input-para green-option">
                                        <input className="with-gap"
                                            name="group1"
                                            type="radio"
                                            id={i}
                                            value={opt}
                                            onChange={this.handleOptionChange}
                                         />
                                        <label htmlFor={i} >{ opt }</label>
                                    </p> );
                            }

                            else {
                                return (
                                    <p key={i}  className="input-para">
                                        <input className="with-gap"
                                            name="group1"
                                            type="radio"
                                            id={i}
                                            value={opt}
                                            onChange={this.handleOptionChange}
                                            disabled = {this.state.isDisabled}
                                         />
                                        <label htmlFor={i} >{ opt }</label>
                                    </p> );
                            }

                        })
                    }
                    </div>

                    <button className="btn" onClick={this.postResponse} >Submit</button>
                    <br />
                    <br />
                </div>
            </div>
        );
    }
}



export default Question;
