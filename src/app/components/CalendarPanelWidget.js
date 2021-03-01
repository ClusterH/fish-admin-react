import React, {useEffect} from "react";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Switch from "@material-ui/core/Switch";
import {makeStyles} from "@material-ui/core/styles";
import {KeyboardTimePicker} from '@material-ui/pickers';
import TextField from "@material-ui/core/TextField";
import {getConfigParamsValue} from "../../redux/http/config";
import {getAppointmentById, getAppointmentFilter, updateAppointment} from "../../redux/http/appointment";
import {winterSchedule, summerSchedule} from "../../utils/constant";
import {toAbsoluteUrl} from "../../_metronic/_helpers";
import {useSelector} from "react-redux";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        marginTop: theme.spacing(2)
    },
    table: {
        minWidth: 600
    },
    tableWrapper: {
        overflowX: "auto"
    },
    formControl: {
        margin: theme.spacing(0),
    },
    weekBar: {
        minHeight: '100%',
        padding: '10px 2px',
        borderRadius: '0.42rem',
        cursor: 'pointer',
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
    weekDay: {
        color: '#2196f3',
        fontSize: 10,
    },
    dateLabel: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 4,
        fontSize: 10,
        cursor: "pointer",
        borderRadius: '50%',
        width: 30,
        height: 30,
    },
    todayMark: {
        padding: 4,
        fontSize: 10,
        borderRadius: '50%',
        color: '#fff',
        backgroundColor: '#2196f3',
    },
    textField: {
        height: 70,
    }
}));

export default function CalendarPanelWidget(props) {
    const classes = useStyles();
    const {user} = useSelector(state => state.auth);
    const aDay = 86400000;
    const weekName = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];
    const monthName = ['enero', 'febrero', 'marzo', 'abril', 'Mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const iconUrls = {
        VIDEO: toAbsoluteUrl('/media/svg/icons/Devices/Video-camera.svg'),
        PHONE: toAbsoluteUrl('media/svg/icons/Communication/Active-call.svg'),
        TEXT: toAbsoluteUrl('/media/svg/icons/Communication/Chat4.svg'),
        FACE2FACE: toAbsoluteUrl('/media/svg/icons/Communication/Group.svg'),
        MULTI: toAbsoluteUrl('/media/svg/icons/Devices/Video-camera.svg'),
    }

    const today = new Date();

    const [pickedDate, setPickedDate] = React.useState(today);
    const [year, setYear] = React.useState(today.getFullYear());
    const [month, setMonth] = React.useState(today.getMonth());
    const [date, setDate] = React.useState(today.getDate());
    const [weekday, setWeekday] = React.useState(today.getDay());
    const [startWeek, setStartWeek] = React.useState(today);
    const [startIndex, setStartIndex] = React.useState(0);
    const [selectIndex, setSelectIndex] = React.useState(-1);
    const [searchType, setSearchType] = React.useState(0);
    const [pickerType, setPickerType] = React.useState('tipo');
    const [selectedTime, setSelectedTime] = React.useState(new Date('2014-08-18T21:11:54'));
    // const [selectedPuesto, setSelectedPuesto] = React.useState(props.puestos[0] && props.puestos[0].id);
    const [selectedPuesto, setSelectedPuesto] = React.useState(props.selectedPuesto);
    const [timeSlot, setTimeSlot] = React.useState([]);
    const [cntTimeSlot, setCntTimeSlot] = React.useState(0);
    const [appointmentList, setAppointmentList] = React.useState([]);
    const [scheduleList, setScheduleList] = React.useState([]);
    const [startTime, setStartTime] = React.useState(0);
    const [endTime, setEndTime] = React.useState(0);
    const [showSlotDetail, setShowSlotDetail] = React.useState(false);
    const [detailList, setDetailList] = React.useState([]);

    useEffect(() => {
        // if (props.for === 'ATTENTION_PANEL') {
        //     setSelectedPuesto(props.puestos[0] && props.puestos[0].id);
        // }
        setSelectedPuesto(props.selectedPuesto);
        setScheduleList(month > 3 && month < 11 ? summerSchedule : winterSchedule);
        setStartWeek(prevDate(today.getTime(), weekday));
    }, [props.selectedPuesto])

    const afterDate = (now, d) => {
        return new Date(now + d * aDay);
    }

    const prevDate = (now, d) => {
        return new Date(now - d * aDay);
    }

    const goPrevWeek = () => {
        const day = prevDate(startWeek.getTime(), 7);
        setStartWeek(day);
        setMonth(day.getMonth());
        setYear(day.getFullYear());
    }

    const goNextWeek = () => {
        const day = afterDate(startWeek.getTime(), 7);
        setStartWeek(day);
        setMonth(day.getMonth());
        setYear(day.getFullYear());
    }

    const pickDate = (idx) => {
        setPickedDate(afterDate(startWeek.getTime(), idx));
        props.selectDate(afterDate(startWeek.getTime(), idx));
        setWeekday(idx);
    }

    const pickTime = (time) => {
        setSelectedTime(time);
        console.log(time)
        // props.pickTime(time);
    }

    const handleNextTime = () => {
        if (startIndex < cntTimeSlot - 4) {
            setStartIndex(startIndex + 4)
        }
    }

    const handlePrevTime = () => {
        if (startIndex > 3) {
            setStartIndex(startIndex - 4)
        }
    }

    const handleTimeClick = (idx) => {
        setSelectIndex(idx);
        if (timeSlot[idx].appointments.length > 0 && timeSlot[idx].status !== 1) {
            setShowSlotDetail(true);
            const temp = [];
            for (const item of timeSlot[idx].appointments) {
                temp.push({
                    id: item.id,
                    type: item.esCita ? 'CITA PREVIA' : 'CITA INMEDIATA',
                    status: item.idEstado,
                    user: item.loginusuario?.username,
                    expectedDate: new Date(item.fechahoraPrevista).toLocaleString(),
                    subject: item.descAsunto,
                    icon: iconUrls[item.citastiposatencion?.codTipoAtencion || 0],
                    bgColor: item.esCita ? '#f0eab4' : '#f4c2d3',
                })
            }
            setDetailList(temp);
        }
    }

    const searchAppointment = async () => {
        if (selectedPuesto > 0) {
            try {
                const filter = JSON.stringify({
                    idPuesto: selectedPuesto,
                    idConfigItems: [29, 30] // appointment time and time between appointments
                });
                const res1 = await getConfigParamsValue({filter});
                const appointmentTime = parseInt(res1.data.results[0]?.valor);
                const betweenTime = parseInt(res1.data.results[1]?.valor);
                const interval = appointmentTime + betweenTime;

                const res2 = await getAppointmentFilter({
                    puestoId: selectedPuesto,
                    date: pickedDate,
                });
                const appointments = res2.data.results;

                const cntSlot = parseInt(1440 / interval);
                const temp = [];
                for (let i = 0; i < cntSlot; i++) {
                    const start = increaseTime('00:00', i * interval);
                    const end = increaseTime(start, appointmentTime);
                    let slotStatus = outOfTime(start, end) ? 2 : 0;
                    const subtemp = [];
                    for (const appt of appointments) {
                        const localTime = new Date(appt.fechahoraPrevista).toLocaleString().split(', ')[1];
                        if (to24Form(localTime) === start) {
                            subtemp.push(appt);
                            if (appt.idEstado > 1) {
                                slotStatus = 1;
                            }
                        }
                    }

                    temp.push({
                        timeSlot: start + '-' + end,
                        appointments: subtemp,
                        status: slotStatus
                    })
                }
                if (parseInt(searchType) === 0) {
                    setTimeSlot(temp);
                    setCntTimeSlot(temp.length);
                } else {
                    const search = temp.filter(x => x.status === parseInt(searchType) - 1);
                    setTimeSlot(search);
                    setCntTimeSlot(search.length);
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            alert('Select a puesto');
        }
    }

    // 03:20:35 PM -> 15:20
    const to24Form = (time) => {
        const tList = time.split(' ')[0].split(':');
        const mode = time.split(' ')[1];
        if (mode === 'PM') {
            return (ft(parseInt(tList[0]) + 12)) + ':' + ft(parseInt(tList[1]));
        } else {
            return ft(parseInt(tList[0])) + ':' + ft(parseInt(tList[1]));
        }
    }

    const increaseTime = (start, time) => {
        const hour = parseInt(start.split(':')[0]);
        const min = parseInt(start.split(':')[1]);
        const newHour = hour + parseInt((min + time) / 60);
        const newMin = (min + time) % 60;
        return ft(newHour) + ':' + ft(newMin);
    }

    const ft = (t) => {
        return t < 10 ? `0${t}` : `${t}`;
    }

    const outOfTime = (start, end) => {
        const schedule = scheduleList.filter(x => x.weekday === weekday)[0];
        const mb = schedule.morningBegin;
        const me = schedule.morningEnd;
        const ab = schedule.afternoonBegin;
        const ae = schedule.afternoonEnd;

        if (mb !== null && ab !== null) {
            if (start >= mb && end <= me) return false;
            return !(start >= ab && end <= ae);

        } else if (mb !== null && ab === null) {
            return !(start >= mb && end <= me);
        } else if (mb === null && ab !== null) {
            return !(start >= ab && end <= ae);
        } else {
            return true;
        }
    }

    const acceptAppointment = (appointment, idx) => {
        if (!props.isSelectedAppt) {
            updateAppointment({
                appointmentId: appointment.id,
                idEstado: 2, // ATTENDING status
                idAgenteAsignado: user.id,
            }).then((res) => {
                props.setSelectedAppt(appointment);
                setShowSlotDetail(false);
            }).catch(err => console.log(err));
        } else {
            alert('The other appointment already assigned.')
        }
    }

    const modifyAppointment = (appointment) => {
        setShowSlotDetail(false);
        props.setSelectedTab(2);
    }

    return (
        <Grid container spacing={1} className={"rounded p-1"}
              style={{backgroundColor: '#3331'}}>
            <Grid item xs={12} sm={12} md={8} container spacing={1}>
                {props.for === 'ATTENTION_PANEL' ? (
                    <Grid item xs={12}>
                        <div className="d-flex">
                            <div>Puesto seleccionado:</div>
                            <select
                                className={"form-control"}
                                value={selectedPuesto}
                                onChange={event => {
                                    setSelectedPuesto(event.target.value);
                                    props.setSelectedPuesto(event.target.value);
                                }}
                            >
                                {props.puestos.map((pue, idx) => {
                                    return (
                                        <option value={pue.id} key={`${idx}`}>{pue.panelName}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </Grid>
                ) : null}
                <Grid item xs={12}>
                    {pickerType === 'tipo' ? (
                        <div className={"bg-white rounded px-10 py-2 position-relative"}>
                            <div
                                className={"position-absolute"}
                                style={{left: '2px', top: '33px'}}
                                onClick={goPrevWeek}
                            >
                                <i className={"fas fa-chevron-circle-left text-primary"}/>
                            </div>
                            <div
                                className={"position-absolute"}
                                style={{right: '2px', top: '33px'}}
                                onClick={goNextWeek}
                            >
                                <i className={"fas fa-chevron-circle-right text-primary"}/>
                            </div>
                            <div className={"d-flex justify-content-between mb-2"}>
                                <div className={"text-success"}>{year}</div>
                                <div className={"text-primary"}>{monthName[month] + ' ' + year}</div>
                                <div className={"text-success"}>{}</div>
                            </div>
                            <div className={"d-flex justify-content-between"}>
                                {weekName.map((week, idx) => {
                                    return (
                                        <span className={classes.weekDay} key={`${idx}`}>{week}</span>
                                    )
                                })}
                            </div>
                            <div className={"d-flex justify-content-between"}>
                                {weekName.map((week, idx) => {
                                    return (
                                        <span
                                            className={classes.dateLabel}
                                            style={idx === weekday ? {backgroundColor: '#6993FF', color: '#fff'} : null}
                                            key={`${idx}`}
                                            onClick={() => pickDate(idx)}
                                        >
											{afterDate(startWeek.getTime(), idx).getDate()}
										</span>
                                    )
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded px-10 py-2 position-relative d-flex justify-content-between">
                            <TextField
                                id="time"
                                label="From"
                                type="time"
                                value={selectedTime}
                                onChange={event => pickTime(event.target.value)}
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    step: 300, // 5 min
                                }}
                            />
                        </div>
                    )}
                </Grid>
                <Grid item xs={8} sm={8} md={8} lg={8}>
                    <FormControl component="fieldset">
                        <RadioGroup aria-label="gender" name="gender1" value={pickerType}
                                    onChange={event => setPickerType(event.target.value)}
                        >
                            <FormControlLabel value="tipo" control={<Radio/>} label={
                                <select
                                    className={"form-control"}
                                    value={searchType}
                                    onChange={event => setSearchType(event.target.value)}
                                >
                                    <option value={0}>Vista TIPO CITA</option>
                                    <option value={1}>Free</option>
                                    <option value={2}>Complete</option>
                                    <option value={3}>Out of Hours</option>
                                    <option value={4}>Holidays</option>
                                </select>
                            }/>
                            <FormControlLabel value="hora" control={<Radio/>} label={
                                'Vista CITAS/HORA'
                            }/>
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <FormControlLabel
                        control={<Switch name="checkedB" color="primary" // checked={state.checkedB}
                                         onChange={null}/>}
                        label={"24h"}
                    />
                    <button className="btn btn-primary" onClick={searchAppointment}>Buscar</button>
                </Grid>
                <Grid item xs={1}/>
                <Grid item xs={5} className={"d-flex"}>
                    <FormControlLabel
                        control={<div
                            style={{width: "36px", height: "20px", borderRadius: 10, backgroundColor: '#cddc39'}}/>}
                        label={<>&nbsp;Libres</>}
                    />
                </Grid>
                <Grid item xs={5} className={"d-flex"}>
                    <FormControlLabel
                        control={<div
                            style={{width: "36px", height: "20px", borderRadius: 10, backgroundColor: '#f7efa0'}}/>}
                        label={<>&nbsp;Completo</>}
                    />
                </Grid>
                <Grid item xs={1}/>
                <Grid item xs={1}/>
                <Grid item xs={5} className={"d-flex"}>
                    <FormControlLabel
                        control={<div
                            style={{width: "36px", height: "20px", borderRadius: 10, backgroundColor: '#f08fb0'}}/>}
                        label={<>&nbsp;Fuera horario</>}
                    />
                </Grid>
                <Grid item xs={5} className={"d-flex"}>
                    <FormControlLabel
                        control={<div
                            style={{width: "36px", height: "20px", borderRadius: 10, backgroundColor: '#f44336'}}/>}
                        label={<>&nbsp;Festivo</>}
                    />
                </Grid>
                <Grid item xs={1}/>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
                <div className={"rounded bg-white h-100 pl-3 pr-10 py-3 h-100"}>
                    <div className={"text-primary"} style={{fontSize: "18px"}}>Horarios citas</div>
                    <Grid container spacing={1} className={"position-relative"}>
                        {timeSlot.length > 0 ? (
                            <div className={"position-absolute"}
                                 style={{right: '-16px', top: '5px'}}
                                 onClick={handlePrevTime}
                            >
                                <i className={"fas fa-chevron-circle-up text-primary"}/>
                            </div>
                        ) : null}
                        {timeSlot.length > 0 ? (
                            <div className={"position-absolute"}
                                 style={{right: '-16px', bottom: '5px'}}
                                 onClick={handleNextTime}
                            >
                                <i className={"fas fa-chevron-circle-down text-primary"}/>
                            </div>
                        ) : null}

                        {timeSlot.map((slot, idx) => {
                            if (idx >= startIndex && idx < startIndex + 4) {
                                return (
                                    <Grid item xs={12} key={`${idx}`} onClick={() => handleTimeClick(idx)}>
                                        <div
                                            className={"d-flex justify-content-center rounded py-4"}
                                            style={{
                                                cursor: 'pointer',
                                                backgroundColor: slot.status === 0 ? '#cddc39'
                                                    : slot.status === 1 ? '#f7efa0'
                                                        : slot.status === 2 ? '#f08fb0'
                                                            : '#f44336',
                                                border: idx === selectIndex ? '2px solid #6993ff' : 'none'
                                            }}
                                        >
                                            {slot.timeSlot + '/' + (slot.status === 1 ? 'C' : slot.appointments.length)}
                                        </div>
                                    </Grid>
                                )
                            }
                        })}
                    </Grid>
                </div>
            </Grid>
            {showSlotDetail ? (
                <div className={"popup-container"}>
                    <div className={"popup-body position-relative"}>
                        {detailList.map((item, idx1) => {
                            return (
                                <div className="d-flex my-3 align-items-center" key={`${idx1}`}>
                                    <div className={"rounded"}>
                                        <Grid container spacing={1}
                                              className={"stall-status-widget position-relative rounded p-3"}
                                              style={{
                                                  fontSize: 10,
                                                  lineHeight: '11px',
                                                  backgroundColor: item.bgColor,
                                                  backgroundImage: `url(${item.icon})`,
                                                  backgroundPosition: 'right top',
                                                  backgroundRepeat: 'no-repeat',
                                                  backgroundSize: '40px',
                                                  cursor: 'pointer',
                                              }}
                                        >
                                            {item.asterisk ? (
                                                <div className={"position-absolute text-danger font-weight-bolder"}
                                                     style={{right: 40, top: 17, fontSize: 16}}>
                                                    (*)
                                                </div>
                                            ) : null}
                                            <Grid item xs={6} className={"py-0"}>
                                                Nº CITA:
                                            </Grid>
                                            <Grid item xs={6} className={"py-0"}>
                                                {item.id}
                                            </Grid>
                                            <Grid item xs={6} className={"py-0"}>
                                                TIPO CITA:
                                            </Grid>
                                            <Grid item xs={6} className={"py-0"}>
                                                {item.type}
                                            </Grid>
                                            <Grid item xs={6} className={"py-0"}>
                                                HORA PREVISTA CITA:
                                            </Grid>
                                            <Grid item xs={6} className={"py-0"}>
                                                {item.expectedDate}
                                            </Grid>
                                            <Grid item xs={6} className={"py-0"}>
                                                USUARIO:
                                            </Grid>
                                            <Grid item xs={6} className={"py-0"}>
                                                {item.user}
                                            </Grid>
                                            <Grid item xs={6} className={"py-0"}>
                                                EMAIL:
                                            </Grid>
                                            <Grid item xs={6} className={"py-0"}>
                                                {item.email}
                                            </Grid>
                                            <Grid item xs={6} className={"py-0"}>
                                                TELEPHONE:
                                            </Grid>
                                            <Grid item xs={6} className={"py-0"}>
                                                {item.phone}
                                            </Grid>
                                            <Grid item xs={6} className={"py-0"}>
                                                ASUNTO:
                                            </Grid>
                                            <Grid item xs={6} className={"py-0"}>
                                                {item.subject}
                                            </Grid>
                                        </Grid>
                                    </div>
                                    <div className={"ml-3"}>
                                        <button className="btn btn-primary my-1 w-lg-140px" onClick={() => acceptAppointment(item, idx1)}>
                                            CONFIRMAR CITA
                                        </button>
                                        <button className={"btn btn-warning my-1 w-lg-140px"} onClick={() => modifyAppointment(item)}>
                                            MODIFICAR CITA
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-danger" onClick={() => setShowSlotDetail(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            ) : null}
        </Grid>
    )
}
