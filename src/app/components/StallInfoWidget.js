import React, {useEffect} from 'react';
import Grid from "@material-ui/core/Grid";
import "../css/common.css";
import StallStatusWidget from "./StallStatusWidget";

export default function StallInfoWidget(props){
	const LIMIT = 2;
	const [totalNum, setTotalNum] = React.useState(props.data.length);
	const [startIndex, setStartIndex] = React.useState(0);

	const handleUpBtn = () => {
		if (startIndex > 0) {
			setStartIndex(startIndex - 1);
		}
	}

	const handleDownBtn = () => {
		if (startIndex < totalNum - LIMIT) {
			setStartIndex(startIndex + 1);
		}
	}

	const handleClick = (appt, idx) => {
		props.selectedPanel(appt, props.puestoIndex, idx);
	}

	return (
		<Grid container spacing={1} className={"position-relative rounded px-2 pt-2"} style={{
			fontSize: 14,
			lineHeight: '10px',
			backgroundColor: '#3331',
			paddingBottom: 20,
		}}>
			<div className={"position-absolute"} style={{right: 10, top: 8}} onClick={handleUpBtn}>
				<i className={"fas fa-chevron-circle-up cursor-pointer"}/>
			</div>
			<div className={"position-absolute"} style={{right: 10, bottom: 6}} onClick={handleDownBtn}>
				<i className={"fas fa-chevron-circle-down cursor-pointer"}/>
			</div>
			<Grid item xs={12} className={"d-flex justify-content-center text-primary"}
						style={{fontSize: 16, lineHeight: '18px'}}>
				{props.title}
			</Grid>
			{props.data.map((appt, index) => {
				if (index >= startIndex && index < startIndex + LIMIT) {
					return (
						<Grid
							item xs={12}
							key={`${index}`}
							style={{margin: 3}}
							onClick={() => handleClick(appt, index)}
						>
							<Grid container spacing={1} className={"stall-status-widget position-relative rounded p-3"} style={{
								fontSize: 10,
								lineHeight: '11px',
								backgroundColor: appt.bgColor,
								backgroundImage: `url(${appt.icon})`,
								backgroundPosition: 'right top',
								backgroundRepeat: 'no-repeat',
								backgroundSize: '40px',
								cursor: 'pointer',
								border: (props.index1 === props.puestoIndex) && (index === props.index2) ? '2px solid #e91e63' : 'none'
							}}>
								{appt.asterisk ? (
									<div className={"position-absolute text-danger font-weight-bolder"}
										 style={{right: 40, top: 17, fontSize: 16}}>
										(*)
									</div>
								) : null}
								<Grid item xs={6} className={"py-0"}>
									Nº CITA:
								</Grid>
								<Grid item xs={6} className={"py-0"}>
									{appt.id}
								</Grid>
								<Grid item xs={6} className={"py-0"}>
									TIPO CITA:
								</Grid>
								<Grid item xs={6} className={"py-0"}>
									{appt.type}
								</Grid>
								<Grid item xs={6} className={"py-0"}>
									HORA PREVISTA CITA:
								</Grid>
								<Grid item xs={6} className={"py-0"}>
									{new Date(appt.expectedDate).toLocaleString('en')}
								</Grid>
								<Grid item xs={6} className={"py-0"}>
									USUARIO:
								</Grid>
								<Grid item xs={6} className={"py-0"}>
									{appt.user}
								</Grid>
								<Grid item xs={6} className={"py-0"}>
									EMAIL:
								</Grid>
								<Grid item xs={6} className={"py-0"}>
									{appt.email}
								</Grid>
								<Grid item xs={6} className={"py-0"}>
									TELEPHONE:
								</Grid>
								<Grid item xs={6} className={"py-0"}>
									{appt.phone}
								</Grid>
								<Grid item xs={6} className={"py-0"}>
									ASUNTO:
								</Grid>
								<Grid item xs={6} className={"py-0"}>
									{appt.subject}
								</Grid>
								{/*<Grid item xs={6} className={"py-0"}>*/}
								{/*	AGENTE:*/}
								{/*</Grid>*/}
								{/*<Grid item xs={6} className={"py-0"}>*/}
								{/*	{appt.agent}*/}
								{/*</Grid>*/}
							</Grid>
						</Grid>
					)
				} else {
					return null;
				}
			})}
			{/*{props.role !== 'Super' ? (*/}
			{/*	<Grid item xs={12} className="d-flex justify-content-center text-info"*/}
			{/*		  style={{fontSize: 12, lineHeight: '10px'}}>*/}
			{/*		{props.role}*/}
			{/*	</Grid>*/}
			{/*) : null}*/}
		</Grid>
	);
}
