import React from 'react';
import io from 'socket.io-client';
import ProgressBar from 'progressbar.js';
import './../../css/common.css';

let statsSocket ;
var Circle = ProgressBar.Circle;

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

                {/* <Bar progress = { this.state.progress } /> */}
            </div>
        );
    }
}

class Bar extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        var options = {
            strokeWidth: 2,
            trailWidth: 1,
            easing: 'easeInOut',
            duration: 1400,
            text: {
                autoStyleContainer: false
            },
            from: { color: '#aaa', width: 1 },
            to: { color: '#333', width: 4 },
            // Set default step function for all animate calls
            step: function(state, circle) {
                circle.path.setAttribute('stroke', state.color);
                circle.path.setAttribute('stroke-width', state.width);

                var value = Math.round(circle.value() * 100);
                if (value === 0) {
                    circle.setText('');
                } else {
                    circle.setText(value);
                }
            }
        };

        // For demo purposes so the container has some dimensions.
        // Otherwise progress bar won't be shown
        var containerStyle = {
            width: '200px',
            height: '200px'
        };

        return(
            <Circle
                progress={this.props.progress}
                text={'test'}
                options={options}
                initialAnimate={true}
                containerStyle={containerStyle}
                containerClassName={'.progressbar'} />
        );
    }
}

export default Stats;
