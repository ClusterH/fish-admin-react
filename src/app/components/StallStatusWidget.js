import React from 'react';
import "../css/common.css";
import Grid from "@material-ui/core/Grid";

export default function StallStatusWidget(props){
	return (
		<Grid container spacing={1} className={"stall-status-widget position-relative rounded p-3"} style={{
			fontSize: 10,
			lineHeight: '11px',
			backgroundColor: props.bgColor,
			backgroundImage: `url(${props.bgImageUrl})`,
			backgroundPosition: 'right top',
			backgroundRepeat: 'no-repeat',
			backgroundSize: '40px',
			cursor: 'pointer',
		}}>
			{props.asterisk ? (
				<div className={"position-absolute text-danger font-weight-bolder"} style={{right: 40, top: 17, fontSize: 16}}>
					(*)
				</div>
			) : null}
			<Grid item xs={6} className={"py-0"}>
				Nº CITA:
			</Grid>
			<Grid item xs={6} className={"py-0"}>
				{props.data.code}
			</Grid>
			<Grid item xs={6} className={"py-0"}>
				TIPO CITA:
			</Grid>
			<Grid item xs={6} className={"py-0"}>
				{props.data.type}
			</Grid>
			<Grid item xs={6} className={"py-0"}>
				HORA PREVISTA CITA:
			</Grid>
			<Grid item xs={6} className={"py-0"}>
				{props.data.time}
			</Grid>
			<Grid item xs={6} className={"py-0"}>
				USUARIO:
			</Grid>
			<Grid item xs={6} className={"py-0"}>
				{props.data.user}
			</Grid>
			<Grid item xs={6} className={"py-0"}>
				ASUNTO:
			</Grid>
			<Grid item xs={6} className={"py-0"}>
				{props.data.topic}
			</Grid>
		</Grid>
	);
}
