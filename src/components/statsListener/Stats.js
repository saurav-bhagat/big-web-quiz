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
            percentarray : [],
            empty : true,
            progress : 0.5
        }
        statsSocket = io(`http://159.89.173.175:3000`);
        statsSocket.on('connect', () => {
            statsSocket.emit('statsListener', {username: 'akshitgrover', password: 'c2c_2.0'},(data) => {
                console.log(data);
            });
        });

        statsSocket.on('response', (argument) => {
            console.log(argument);
            this.setState({ empty : false });
            let responseArray = [...argument.response];
            let newPerArray = [];
            for(let i=0;i<responseArray.length;i++){
                newPerArray.push( (responseArray[i]/argument.joined)*100 );
            }
            this.setState({ percentarray : newPerArray });
        });

        statsSocket.on('empty', (data) => {
            this.setState({ empty : true });
        });
    }
    render(){
        return(
            <div>
                { this.state.empty && <h1 className="margin-0"> wait for new response </h1> }
                statsListener
                    <div>
                        {
                            this.state.percentarray.map((percent, i) =>
                                <CircularProgressbar
                                    percentage={percent}
                                    strokeWidth="8"
                                    initialAnimation={true}
                                    textForPercentage= {(percent) => `{percent}` }
                                />
                            )
                        }
                    </div>
            </div>
        );
    }
}


export default Stats;
