import React from 'react';
import io from 'socket.io-client';
import swal from 'sweetalert';
import renderHTML from 'react-render-html';
import './../css/Question.css';
import './../css/common.css';
import c2cImage from './../images/logowhite.png';

let userSocket2;
class Question extends React.Component {
    constructor(){
        super();
        this.state = {
            qnum : '',
            qstmt: '',
            qchoice: '',
            responseIndex : -1,
            response : '',
            userIndex: -1,
            isDisabled : '',
            showQuestion : false
        }
        userSocket2 = io(`http://139.59.7.242:80`);
        userSocket2.on('connect', () => {
            let username  = localStorage.getItem('username');
            userSocket2.emit('join', {username: username}, (err) => {
                console.log("error is " + err.err);
                swal("Oops!", err.err , "error");
            });
        });
        userSocket2.on('getQue', (data) => {
            console.log("inside get Que");
            console.log(data.qchoice)
            this.setState({
                qnum : data.qnum,
                qstmt : data.qstmt,
                qchoice : data.qchoice,
                response : '',
                userIndex: -1,
                responseIndex : -1,
                isDisabled : false,
                showQuestion : true
            });
            if(this.state.userIndex !== -1) {
                document.getElementById(this.state.userIndex).checked = false;
            }
        });
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
        else{
            userSocket2.emit('postRes', {qnum : this.state.qnum, response : this.state.response}, (err) => {
                console.log(err);
                swal("Oops!", err.err , "error");
                userSocket2.on('disconnect' , () => {
                    window.location.href="/"
                });

            });
            this.setState({ isDisabled: true });
        }
    }

    handleOptionChange = (i,opt) => {
        if(this.state.isDisabled===true)
         return;
        let newResponse;
        newResponse = opt;
        console.log("Id selected is: " + i);
        console.log("Response:"+newResponse);
        this.setState({response : newResponse , userIndex: parseInt(i) });
        userSocket2.emit('secRes', { qnum : this.state.qnum, response : newResponse }, (err) => {
            console.log("abhi kar rhe hai");
            userSocket2.on('disconnect' , () => {
                window.location.href="/"
            });
            swal("Oops!", err.err , "error");
        });
    }
    render(){
        let options = [];
        options = [...this.state.qchoice];
        console.log(options);
        const alpha=['A','B','C','D'];
        return(
            <div>

                <div className="c2cLogo">
                    <img src={c2cImage} alt="c2c" />
                </div>

                {
                    !this.state.showQuestion && <div className="make-card z-depth-5">
                        <h3 className="center-align margin-0"> Get Ready to Answer or Scratch your heads with Head-Scratcher </h3>
                    </div>
                }

                {
                    this.state.showQuestion &&
                    <div>
                        <div className="question-card z-depth-5" style={{padding:"20px 10px"}}>
                            <h4>Hello {localStorage.username}</h4>
                        </div>
                        <br/><br/>
                        <div className="inc-margin-top"> </div>
                        <div className="question-card z-depth-5">
                            <br /><br />
                            <h4 className="margin-0">
                                <span className="questionno">Q{Number(this.state.qnum)+1}.&nbsp;</span><br/>
                                { renderHTML(this.state.qstmt) }
                            </h4>
                            <div className="question-component">
                                <ul className="answerOptions">
                                {
                                    options.map((opt,i) => {

                                        console.table([this.state.responseIndex, this.state.userIndex]);

                                        if( i  === this.state.userIndex && this.state.responseIndex !== i && this.state.responseIndex !== -1){
                                            return (
                                                <li key={i} className="answerOption wrongattempted">
                                                    <div className="option-div-wrap">
                                                        <div className="row">
                                                            <div className="col s2 m1">
                                                                <span className="option-letter">
                                                                    {alpha[i]}
                                                                </span>
                                                            </div>
                                                            <div className="col s10 m11 option-col" style={{display: "inherit"}}>
                                                                { opt }
                                                            </div>
                                                        </div>
                                                        <span className="your-response">YOUR RESPONSE</span>
                                                    </div>
                                                </li>
                                            )
                                            }

                                            else if( i === this.state.responseIndex){
                                                return (
                                                    <li key={i} className="answerOption correct">
                                                        <div className="option-div-wrap">
                                                            <div className="row">
                                                                <div className="col s2 m1">
                                                                    <span className="option-letter">
                                                                        {alpha[i]}
                                                                    </span>
                                                                </div>
                                                                <div className="col s10 m11 option-col" style={{display: "inherit"}}>
                                                                    { opt }
                                                                </div>
                                                            </div>
                                                            {this.state.userIndex===i? <span className="your-response">YOUR RESPONSE</span>:<span className="your-response">CORRECT ANSWER</span>}
                                                        </div>
                                                    </li>
                                                )
                                                }

                                                else {
                                                    if(this.state.userIndex===i){
                                                        return (
                                                            <li key={i} className="answerOption selected" onClick={()=>this.handleOptionChange(i,opt)}>
                                                                <div className="option-div-wrap">
                                                                    <div className="row">
                                                                        <div className="col s2 m1">
                                                                            <span className="option-letter">
                                                                                {alpha[i]}
                                                                            </span>
                                                                        </div>
                                                                        <div className="col s10 m11 option-col" style={{display: "inherit"}}>
                                                                            { opt }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        );
                                                    }
                                                    else{
                                                        return (
                                                            <li key={i} className="answerOption" onClick={()=>this.handleOptionChange(i,opt)}>
                                                                <div className="option-div-wrap">
                                                                    <div className="row">
                                                                        <div className="col s2 m1">
                                                                            <span className="option-letter">
                                                                                {alpha[i]}
                                                                            </span>
                                                                        </div>
                                                                        <div className="col s10 m11 option-col" style={{display: "inherit"}}>
                                                                            { opt }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        );
                                                    }

                                                }
                                            })
                                        }
                                    </ul>
                                    </div>
                                    <br/>
                                    {(this.state.isDisabled || this.state.responseIndex!==-1)?
                                        <button className="btn" disabled={true} >Submitted</button>
                                        :
                                        <button className="btn" onClick={this.postResponse} >Submit</button>
                                    }

                                    <br />
                                    <br /><br />
                                </div>
                            </div>
                        }
                        <br/><br/>
                    </div>
                );
            }
        }



        export default Question;
