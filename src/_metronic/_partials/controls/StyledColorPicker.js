import React, {useEffect} from "react";
import {SketchPicker} from "react-color";

export default function StyledColorPicker(props){
	const [pickedColor, setPickedColor] = React.useState(props.defaultColor);
	const [shownPicker, setShownPicker] = React.useState(false);

	function onClickColor(){
		props.getColor(pickedColor);
		setShownPicker(!shownPicker);
	}

	return (
		<div className={"form-control cursor-pointer"} onClick={onClickColor}>
			<div className={"w-100 h-100 border"} style={{backgroundColor: props.setColor}}/>
			{shownPicker ? (
				<div style={{position: "absolute", zIndex: "1000"}}>
					<SketchPicker
						disableAlpha={true} color={pickedColor} onChange={(color, e) => {
						setPickedColor(color.hex);
					}}/>
				</div>
			) : null}
		</div>
	)
}
