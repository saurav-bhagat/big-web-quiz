import React from 'react';
import io from 'socket.io-client';
// import ProgressBar from 'progressbar.js';
import CircularProgressbar from 'react-circular-progressbar';
import './../../css/common.css';
import './../../css/circularProgress.css';

let statsSocket ;

class Stats extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            percentarray : ['0','0','0','0'],
            empty : true,
            progress : 0.5,
            barWait : false,
            currentQuote : 'Hi! Welcome To Code2Create.'
        }
        statsSocket = io(`http://159.89.173.175:3000`);
        statsSocket.on('connect', () => {
            statsSocket.emit('statsListener', {username: 'akshitgrover', password: 'c2c_2.0'},(data) => {
                console.log(data);
            });
        });

        statsSocket.on('response', (argument) => {
            console.log(argument);
            let responseArray = [...argument.response];
            console.log(argument.response);
            this.setState({ empty : false });
            let newPerArray = ['0','0','0','0'];
            let newValue;
            for(let i=0;i<responseArray.length;i++){
                newValue = (responseArray[i]/argument.joined)*100 ;
                newValue = Math.ceil(newValue);
                if(newValue === 0) { newValue = '0' };
                newPerArray[i] = newValue;
            }

            (function(){
                if(this.state.empty === false){
                    setTimeout( function(){ this.setState({ barWait: true }) }.bind(this) , 2000 );
                }
            }).bind(this)();

            this.setState({ percentarray : newPerArray });
        });

        statsSocket.on('empty', (data) => {
            let quotes = [
                "The world is changing very fast. Big will not beat small anymore. It will be the fast beating the slow. – Rupert Murdoch" ,
                "If you don't jump on the new, you don't survive. Satya Nadella",
                "Technology, like art, is a soaring exercise of the human imagination. Daniel Bell",
                "Every opportunity I got, I took it as a learning experience. Satya Nadella",
                "Every once in a while, a new technology, an old problem, and a big idea turn into an innovation. Dean Kamen",
                "Technology is best when it brings people together. Matt Mullenweg",
                "The only constant in the technology industry is change. Marc Benioff",
                "The real problem is not whether machines think but whether men do. B. F. Skinner"
            ];
            let randomQuote = quotes[Math.floor((Math.random() * 8))];
            this.setState({ empty : true , currentQuote: randomQuote});
        });
    }
    render(){
        console.log(this.state.percentarray);
        return(
            <div>
                { this.state.empty && <div className="center-align make-card z-depth-5" style={{ marginTop: "30vh" }}>
                        <h3 className=" margin-0"> {this.state.currentQuote} </h3>
                    </div>
                    }

                {
                    !this.state.empty && this.state.barWait &&
                    <div className="row cus-container">
                        {

                            this.state.percentarray.map((percent, i) =>
                                <div className="circular-bar col s6 m3" key ={i}>
                                    <CircularProgressbar
                                        percentage={percent}
                                        strokeWidth="8"
                                        initialAnimation={true}
                                        textForPercentage= {(percent) => percent }
                                    />
                                </div>
                            )

                        }
                    </div>
                }

            </div>
        );
    }
}


export default Stats;
