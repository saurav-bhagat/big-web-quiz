import React from 'react';
import io from 'socket.io-client';

let statsSocket ;

class Stats extends React.Component{
    constructor(){
        super();

        this.state = {
            percentarray : [],
            empty : true
        }
        statsSocket = io(`http://192.168.43.12:3000`);
        statsSocket.on('connect', () => {
            statsSocket.emit('statsListener', {username: 'deathadder', password: '1516'},(data) => {
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
            this.setState({percentarray : newPerArray});

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
                { !this.state.empty &&
                    <div>
                    {
                        this.state.percentarray.map((percent, i) =>
                            <p key={i}>
                                {i+1} -> {percent}
                            </p>
                        )
                    }
                    </div>
                }
            </div>
        );
    }
}

export default Stats;
