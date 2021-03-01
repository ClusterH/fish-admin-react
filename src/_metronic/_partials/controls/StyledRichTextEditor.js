import React, {Component} from "react";
import RTE from 'react-rte';

class RichTextEditor extends Component{
	constructor(props){
		super(props);

		this.state = {
			value: RTE.createEmptyValue(),
		};
	}

	onChange = (value) => {
		this.setState({value});
		if(this.props.onChange){
			this.props.onChange(value.toString('html'));
		}
	};

	render(){
		return (
			<RTE value={this.state.value} onChange={this.onChange}/>
		);
	}
}

export default RichTextEditor;
