import React, {Component} from 'react';
const CanvasJS = require('./canvasjs.min');
const canvas_lib = CanvasJS.Chart ? CanvasJS : window.CanvasJS;

class CanvasJSChart extends Component {
	static _cjsContainerId = 0

	constructor(props) {
		super(props);
		this.options = props.options || {};
		this.containerProps = props.containerProps ? props.containerProps : {width: "100%", position: "relative"};
		this.containerProps.height = props.containerProps && props.containerProps.height ? props.containerProps.height : this.options.height ? this.options.height + "px" : "320px";
		this.chartContainerId = "canvasjs-react-chart-container-" + CanvasJSChart._cjsContainerId++;
	}

	componentDidMount() {
		this.chart = new canvas_lib.Chart(this.chartContainerId, this.options);
		this.chart.render();
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !(nextProps.options === this.options);
	}

	componentDidUpdate() {
		this.chart.options = this.props.options;
		this.chart.render();
	}

	componentWillUnmount() {
		this.chart.destroy();
	}

	render() {
		return <div id={this.chartContainerId} style={this.containerProps}/>
	}
}

const CanvasJSReact = {
	CanvasJSChart: CanvasJSChart,
	CanvasJS: canvas_lib
};

export default CanvasJSReact;
