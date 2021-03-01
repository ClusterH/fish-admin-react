import React, {Component} from 'react';

export default class TimeDownCounter extends Component {
    constructor(props) {
        super(props);

        this.tmr = null;

        this.state = {
            duration: 0,
            minutes: 0,
            seconds: 0,
        };
    }

    componentDidMount(){
        this.setState({duration: this.props.duration / 1000});
        console.log('start: ', this.props.start);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if(prevProps.start !== this.props.start && this.props.start){
            console.log('prevProps:', prevProps.start);
            console.log('this.props.start:', this.props.start);
            this.setState({duration: this.props.duration / 1000});

            this.tmr = setInterval(() => {
                this.setState({duration: this.state.duration - 1});

                if(this.state.duration <= 0 || this.props.fault){
                    clearInterval(this.tmr);
                    this.props.updateStarted(false);
                    // this.props.setDuration(0);
                    this.setState({duration: 0});
                }
            }, 1000);
        }

        // if (prevProps.fault !== this.props.fault) {
        //     clearInterval(this.tmr);
        // }

        if(prevProps.duration !== this.props.duration){
            this.setState({duration: this.props.duration / 1000});
        }
    }

    render() {
        const min = Math.floor(this.state.duration / 60);
        const sec = Math.floor(this.state.duration % 60);

        return (
            <div style={{fontSize: 24}}>
                <h1> {min < 0 ? 0 : min}:{sec < 10 ? '0' : ''}{sec}</h1>
            </div>
        );
    }
}
