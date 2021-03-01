import Grid from "@material-ui/core/Grid";
import CalendarPanelWidget from "./CalendarPanelWidget";
import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {winterSchedule, summerSchedule} from "../../utils/constant";
import {getCalendarInfo} from "../../redux/http/controlCenter";
import {useSelector} from "react-redux";

const useStyles = makeStyles(theme => ({
	weekBarWrapper: {
		position: 'relative',
		display: 'flex',
		justifyContent: 'space-around',
		height: 'calc(100% - 32px)',
		minHeight: '200px',
		width: '100%'
	},
	weekBar: {
		minHeight: '100%',
		padding: '10px 2px',
		borderRadius: '0.42rem',
		margin: '0 3px',
		width: '16%'
	},
	weekBarTitle: {
		fontSize: 9,
		fontWeight: 600,
		textAlign: 'center',
	},
	weekBarText: {
		paddingTop: 8,
		fontSize: 9,
		textAlign: 'center',
	},
}));

export default function WeeksBarWidget(props){
	const classes = useStyles();
	const {user} = useSelector(state => state.auth);

	const weekFullName=['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
	const today = new Date();
	// const scheduleList = today.getMonth() > 3 && today.getMonth() < 11 ? summerSchedule : winterSchedule;

	const [timetables, setTimetables] = useState();

	useEffect(() => {
		getCalendarInfo({adminCode: user.adminCode}).then((res) => {
			const data = res.data.results.filter(x => x.idSeccionParametros === 2);
			const currentSeason = today.getMonth() in [1, 2, 3, 4, 11, 12] ? "Invierno" : "Verano";
			const calendar = data.filter(x => x.tipoCalendario === currentSeason);
			const temp = calendar.map(x => ({
				weekday: x.diaSemana,
				morningBegin: x.morningBegin,
				morningEnd: x.morningEnd,
				afternoonBegin: x.afternoonBegin,
				afternoonEnd: x.afternoonEnd,
			}));
			setTimetables(temp);
		}).catch(err => {
			console.log(err);
		})

	}, [])

	// const pickTime = (time) => {
	// 	props.pickTime(time)
	// }

	return (
		<>
			<Grid item xs={12} sm={12} md={12} lg={7} container spacing={1} className={"mt-5 pl-10 py-0"}>
				<div className={classes.weekBarWrapper}>
					<div className={"position-absolute"} style={{left: '-20px', top: '5px'}}>
						<i className={"fas fa-chevron-circle-down text-primary"}/>
					</div>
					<div className={"position-absolute"} style={{left: '-20px', bottom: '5px'}}>
						<i className={"fas fa-chevron-circle-up text-primary"}/>
					</div>
					{weekFullName.map((week, idx) => {
						const timetable = timetables ? timetables[idx] : {};
						return (
							<div key={`${idx}`} className={classes.weekBar} style={{backgroundColor: idx % 2 === 0 ? '#ccc2' : '#deeaf4'}}>
								<div className={classes.weekBarTitle}>{week}</div>
								<div className={classes.weekBarText}>
									{timetable.morningBegin ? `${timetable.morningBegin} - ${timetable.morningEnd}` : null}
								</div>
								<div className={classes.weekBarText}>
									{timetable.afternoonBegin ? `${timetable.afternoonBegin} - ${timetable.afternoonEnd}` : null}
								</div>
							</div>
						)
					})}
					<div className={classes.weekBar} style={{backgroundColor: '#f2cfcd'}}>
						<div className={classes.weekBarTitle}>FESTIVOS</div>
						<div className={classes.weekBarText}>
						</div>
						<div className={classes.weekBarText}>
						</div>
					</div>
					{/*<Grid item xs={6} sm={3} md={3} container spacing={1}>*/}
					{/*	<Grid item xs={6}>*/}
					{/*		<div className={classes.weekBar} style={{backgroundColor: '#ccc2'}}>*/}
					{/*			<div className={classes.weekBarTitle}>MIERCOLES</div>*/}
					{/*			{timetable[2].map((time, idx2) => {*/}
					{/*				return (*/}
					{/*					<div className={classes.weekBarText} key={`${idx2}`}>{time}</div>*/}
					{/*				)*/}
					{/*			})}*/}
					{/*		</div>*/}
					{/*	</Grid>*/}
					{/*	<Grid item xs={6}>*/}
					{/*		<div className={classes.weekBar} style={{backgroundColor: '#deeaf4'}}>*/}
					{/*			<div className={classes.weekBarTitle}>JUEVES</div>*/}
					{/*			{timetable[3].map((time, idx3) => {*/}
					{/*				return (*/}
					{/*					<div className={classes.weekBarText} key={`${idx3}`}>{time}</div>*/}
					{/*				)*/}
					{/*			})}*/}
					{/*		</div>*/}
					{/*	</Grid>*/}
					{/*</Grid>*/}
					{/*<Grid item xs={6} sm={3} md={3} container spacing={1}>*/}
					{/*	<Grid item xs={6}>*/}
					{/*		<div className={classes.weekBar} style={{backgroundColor: '#ccc2'}}>*/}
					{/*			<div className={classes.weekBarTitle}>VIERNES</div>*/}
					{/*			{timetable[4].map((time, idx4) => {*/}
					{/*				return (*/}
					{/*					<div className={classes.weekBarText} key={`${idx4}`}>{time}</div>*/}
					{/*				)*/}
					{/*			})}*/}
					{/*		</div>*/}
					{/*	</Grid>*/}
					{/*	<Grid item xs={6}>*/}
					{/*		<div className={classes.weekBar} style={{backgroundColor: '#deeaf4'}}>*/}
					{/*			<div className={classes.weekBarTitle}>SÁBADO</div>*/}
					{/*			{timetable[5].map((time, idx5) => {*/}
					{/*				return (*/}
					{/*					<div className={classes.weekBarText} key={`${idx5}`}>{time}</div>*/}
					{/*				)*/}
					{/*			})}*/}
					{/*		</div>*/}
					{/*	</Grid>*/}
					{/*</Grid>*/}
					{/*<Grid item xs={6} sm={3} md={3} container spacing={1}>*/}
					{/*	<Grid item xs={6}>*/}
					{/*		<div className={classes.weekBar} style={{backgroundColor: '#ccc2'}}>*/}
					{/*			<div className={classes.weekBarTitle}>DOMINGO</div>*/}
					{/*			{timetable[6].map((time, idx6) => {*/}
					{/*				return (*/}
					{/*					<div className={classes.weekBarText} key={`${idx6}`}>{time}</div>*/}
					{/*				)*/}
					{/*			})}*/}
					{/*		</div>*/}
					{/*	</Grid>*/}
					{/*	<Grid item xs={6}>*/}
					{/*		<div className={classes.weekBar} style={{backgroundColor: '#f2cfcd'}}>*/}
					{/*			<div className={classes.weekBarTitle}>FESTIVOS</div>*/}
					{/*			{timetable[7].map((time, idx7) => {*/}
					{/*				return (*/}
					{/*					<div className={classes.weekBarText} key={`${idx7}`}>{time}</div>*/}
					{/*				)*/}
					{/*			})}*/}
					{/*		</div>*/}
					{/*	</Grid>*/}
					{/*</Grid>*/}
				</div>
			</Grid>
			<Grid item xs={12} sm={12} md={12} lg={5} className={"mt-5 p-0"}>
				<CalendarPanelWidget
					selectedPuesto={props.selectedPuestoId}
				/>
			</Grid>
		</>
	);
}
