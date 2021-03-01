/* eslint-disable no-restricted-imports */
import React, {useEffect, useState} from "react";
import {makeStyles} from '@material-ui/core/styles';
import {Hidden, InputAdornment, InputLabel, MenuItem, Select} from "@material-ui/core";
import {FormattedMessage} from "react-intl";
import {Card, CardBody, CardHeader} from "../../../_metronic/_partials/controls";
import {
    Grid,
    FormControl,
    FormLabel,
    FormControlLabel,
    RadioGroup,
    Radio,
    TextField,
    Switch
} from "@material-ui/core/";
import StyledDropzone from "../../components/StyledDropzone";
import StyledFileDropzone from "../../components/StyledFileDropzone";
import {getCompetitionById, registerCompetition, updateCompetition} from "../../../http/competitionCRUD";
import {getDateByISOFormat, getDateTimeByISOFormat} from "../../../utils/computations";
import {getAllFishTypes, registerFishType} from "../../../http/configurationCRUD";
import Spinner from "../../components/Spinner";
import CompetitionTabs from "./CompetitionTabs";
import Alert from '@material-ui/lab/Alert';
import AlertTitle from "@material-ui/lab/AlertTitle";
import Link from "@material-ui/core/Link";
import * as common from "../../../redux/commonRedux";
import {useDispatch} from "react-redux";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(18),
        textAlign: "center",
        flexBasis: '20%',
        flexShrink: 0,
        color: '#0008',
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(18),
        fontWeight: "600",
        color: theme.palette.text.secondary,
    },
    nested: {
        paddingLeft: theme.spacing(5),
    },
    settingBg: {
        backgroundColor: '#bdbdbd',
        borderRadius: 3,
    }
}));

const START_DAY = 4;

export default function CompetitionEditPage(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const competitionId = props.location.pathname.split("/").pop();

    const [competitionType, setCompetitionType] = useState('NORMAL');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [start, setStart] = useState(new Date(0));
    const [end, setEnd] = useState(new Date(0));
    const [attendNumber, setAttendNumber] = useState(0);
    const [attendStart, setAttendStart] = useState(new Date(0));
    const [attendEnd, setAttendEnd] = useState(new Date(0));
    const [isDuplicated, setIsDuplicated] = useState(false);
    const [mode, setMode] = useState('');
    const [attendCost, setAttendCost] = useState(0);
    const [totalReward, setTotalReward] = useState(0);
    const [fishType, setFishType] = useState(0);
    const [rankFishNumber, setRankFishNumber] = useState(0);
    const [questFishNumber, setQuestFishNumber] = useState(0);
    const [questFishWidth, setQuestFishWidth] = useState(0);
    const [questSpecialWidth, setQuestSpecialWidth] = useState(0);
    const [reward1, setReward1] = useState(0);
    const [reward2, setReward2] = useState(0);
    const [reward3, setReward3] = useState(0);
    const [terms, setTerms] = useState('');
    const [fishTypeList, setFishTypeList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toastMsg, setToastMsg] = useState(false);
    const [toastErrMsg, setToastErrMsg] = useState(false);
    let tmr = -1;
    let tmr1 = -1;

    useEffect(() => {
        dispatch(common.actions.setCompetitionTabValue(1));
        getAllFishTypes()
            .then((res) => {
                setFishTypeList(res.data.result);
            })
            .catch(err => {
                console.log(err);
            });

        setNextStartAndEndDate();

        if (competitionId !== 'edit') {
            setLoading(true);
            getCompetitionById({competitionId}).then((res) => {
                const competition = res.data.result;
                console.log(competition)
                setCompetitionType(competition.type === 1 ? "NORMAL" : "SPECIAL");
                setName(competition.name);
                setDescription(competition.description);
                setImage(competition.image);
                setStart(getDateTimeByISOFormat(competition.startDate));
                setEnd(getDateTimeByISOFormat(competition.endDate));
                setAttendNumber(competition.maxAttendNumber);
                setAttendStart(getDateTimeByISOFormat(competition.startApplication));
                setAttendEnd(getDateTimeByISOFormat(competition.endApplication));
                setIsDuplicated(competition.duplicateAllow);
                setMode(competition.mode);
                setAttendCost(competition.attendCost);
                setTotalReward(competition.totalReward);
                setFishType(competition.fishTypeId);
                setRankFishNumber(competition.rankFishNumber);
                setQuestFishNumber(competition.questFishNumber);
                setQuestFishWidth(competition.questFishWidth);
                setQuestSpecialWidth(competition.questSpecialWidth);
                setReward1(competition.reward1);
                setReward2(competition.reward2);
                setReward3(competition.reward3);
                setTerms(competition.termsAndConditions);
                setLoading(false);
            }).catch(err => {
                console.log(err);
                setLoading(false);
            });
        }
    }, []);

    const initialize = () => {
        setNextStartAndEndDate();
        setCompetitionType('NORMAL');
        setName('');
        setDescription('');
        setImage('')
        setStart('');
        setEnd('');
        setAttendNumber('');
        setAttendStart('');
        setAttendEnd('');
        setIsDuplicated(false);
        setMode('');
        setAttendCost('');
        setTotalReward('');
        setFishType('');
        setRankFishNumber('');
        setQuestFishNumber('');
        setQuestFishWidth('');
        setQuestSpecialWidth('');
        setReward1('');
        setReward2('');
        setReward3('');
        setTerms('');
    }

    const registerAction = () => {
        const data = {
            competitionId,
            type: competitionType === "NORMAL" ? 1 : 2,
            name: name,
            description: description,
            image: image,
            startDate: start,
            endDate: end,
            maxAttendNumber: attendNumber,
            startApplication: attendStart,
            endApplication: attendEnd,
            duplicateAllow: isDuplicated,
            totalReward: totalReward,
            fishTypeId: fishType,
            mode: mode,
            rankFishNumber: rankFishNumber,
            questFishNumber: questFishNumber,
            questFishWidth: questFishWidth,
            questSpecialWidth: questSpecialWidth,
            reward1: reward1,
            reward2: reward2,
            reward3: reward3,
            attendCost: attendCost,
            termsAndConditions: terms,
        };
        console.log(data)
        if ((['NORMAL', 'SPECIAL'].includes(competitionType)) && name !== '' && start !== '' && end !== '' && mode !== '') {
            if (competitionId === 'edit') {
                registerCompetition(data)
                    .then((res) => {
                        setToastMsg(true);

                        tmr = setTimeout(function () {
                            setToastMsg(false);
                        }, 5000);

                        initialize();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                updateCompetition(data)
                    .then((res) => {
                        props.history.push("/competition/list");
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        } else {
            setToastErrMsg(true);
            tmr1 = setTimeout(function () {
                setToastErrMsg(false);
            }, 5000);
        }
    }

    const setImageUploadUrl = (url) => {
        setImage(url);
    }

    const setFileUploadUrl = (url) => {
        console.log(url)
        setTerms(url);
    }

    const setNextStartAndEndDate = () => {
        const now = new Date();
        let diff = START_DAY - now.getDay();
        if (diff < 1) diff += 7;
        const startDate = new Date(now.getTime() + diff * 86400000); // a day = 86400000 milliseconds
        const endDate = new Date(startDate.getTime() + 6 * 86400000);

        setStart(getDateByISOFormat(startDate) + 'T00:00:00');
        setEnd(getDateByISOFormat(endDate) + 'T23:59:59');
    }

    const handleChangeType = (e) => {
        const type = e.target.value;
        setCompetitionType(type);

        // set the default value of the start time and the end time
        if (type === "NORMAL") {
            setNextStartAndEndDate();
        } else {
            setStart('');
            setEnd('');
        }
    }

    const handleChangeMode = (e) => {
        setMode(e.target.value);
    }

    const toolbar = (
        <div className="card-toolbar">
            <button className={"btn btn-primary mr-4 w-120px"} onClick={registerAction}>
                <FormattedMessage id={"GENERAL.SAVE"}/>
            </button>
            <button
                className="btn btn-danger w-120px"
                onClick={() => competitionId === 'edit' ? initialize() : props.history.push('/competition/list')}
            >
                <FormattedMessage id={"GENERAL.CANCEL"}/>
            </button>
        </div>
    );

    return (
        <>
            {toastMsg ? (
                <div className={'toast-msg-box'}>
                    <Alert severity="success" className={'toast-msg'}>
                        <AlertTitle>Success</AlertTitle>
                        <strong>Registered New Competition Successfully!</strong>
                    </Alert>
                </div>
            ) : null}
            {toastErrMsg ? (
                <div className={'toast-msg-box'}>
                    <Alert severity="error" className={'toast-msg'}>
                        <AlertTitle>Error</AlertTitle>
                        Some fields are empty — <strong>check it out!</strong>
                    </Alert>
                </div>
            ) : null}
            <Card>
                <CompetitionTabs match={props.match} history={props.history}/>
                <CardHeader
                    title={<FormattedMessage id={competitionId === 'edit'
                        ? "COMPETITION.COMPETITION_ADD"
                        : "COMPETITION.COMPETITION_EDIT"}/>}
                    toolbar={toolbar}
                />
                {loading ? <Spinner/> : (
                    <CardBody>
                        <Grid item xs={12}>
                            <FormControl component="fieldset">
                                <RadioGroup aria-label="CompetitionType"
                                            name="competitionType"
                                            className={classes.radioGroup}
                                            value={competitionType}
                                            onChange={handleChangeType}
                                            row
                                >
                                    <FormControlLabel value={"NORMAL"} control={<Radio/>} label="상시대회"/>
                                    <FormControlLabel value={"SPECIAL"} control={<Radio/>} label="비정기대회"/>
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item sm={12} md={6}>
                                <Grid item xs={12}>
                                    <TextField
                                        className={"d-flex mb-5"}
                                        label={"대회이름"}
                                        variant="outlined"
                                        value={name}
                                        onChange={event => setName(event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        className={"d-flex mb-5"}
                                        label={"대회설명"}
                                        multiline
                                        rows={4}
                                        rowsMax={4}
                                        variant="outlined"
                                        value={description}
                                        onChange={event => setDescription(event.target.value)}
                                    />
                                </Grid>
                                <Grid container spacing={2} className={"mb-3"}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            className={"d-flex"}
                                            label={"시작날짜"}
                                            type={"datetime-local"}
                                            variant="outlined"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            value={start}
                                            onChange={event => setStart(event.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            className={"d-flex"}
                                            label={"종료날짜"}
                                            type={"datetime-local"}
                                            variant="outlined"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            value={end}
                                            onChange={event => setEnd(event.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} className={"mb-3"}>
                                    <Grid item xs={6} sm={4}>
                                        <TextField
                                            className={"d-flex mb-4"}
                                            label={"참가인원"}
                                            variant="outlined"
                                            type={"number"}
                                            value={attendNumber}
                                            onChange={event => setAttendNumber(event.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={4}>
                                        <TextField
                                            className={"d-flex mb-4"}
                                            label={"참여포인트"}
                                            variant="outlined"
                                            type={"number"}
                                            value={attendCost}
                                            onChange={event => setAttendCost(event.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4} className={"mt-2"}>
                                        <FormControlLabel
                                            className={"mb-0"}
                                            control={<Switch
                                                name={"allowDuplicate"}
                                                color="primary"
                                                checked={isDuplicated}
                                                onChange={() => setIsDuplicated(!isDuplicated)}
                                            />}
                                            label={"중복참여가능"}
                                        />
                                    </Grid>
                                </Grid>
                                {competitionType === "SPECIAL" && (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                className={"d-flex"}
                                                label={"접수시작날짜"}
                                                type={"datetime-local"}
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={attendStart}
                                                onChange={event => setAttendStart(event.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                className={"d-flex"}
                                                label={"접수마감날짜"}
                                                type={"datetime-local"}
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={attendEnd}
                                                onChange={event => setAttendEnd(event.target.value)}
                                            />
                                        </Grid>
                                    </Grid>
                                )}
                            </Grid>
                            <Grid item sm={12} md={6}>
                                <Grid container spacing={2} className={"mb-5"}>
                                    <Grid item xs={12} sm={6} md={7}>
                                        <FormControl variant="outlined" className="d-flex mr-2">
                                            <InputLabel id="demo-simple-select-outlined-label">
                                                대회방식
                                            </InputLabel>
                                            <Select
                                                labelId="demo-simple-select-outlined-label"
                                                id="demo-simple-select-outlined"
                                                value={mode}
                                                onChange={event => setMode(event.target.value)}
                                                label={"대회방식"}
                                            >
                                                <MenuItem value={1}>랭킹전</MenuItem>
                                                <MenuItem value={2}>퀘스트전(길이조건)</MenuItem>
                                                <MenuItem value={3}>퀘스트전(마리조건)</MenuItem>
                                                <MenuItem value={4}>퀘스트전(길이+마리조건)</MenuItem>
                                                <MenuItem value={5}>퀘스트전(특정길이조건)</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={5}>
                                        <FormControl variant="outlined" className="d-flex mr-2">
                                            <InputLabel id="demo-simple-select-outlined-label">
                                                대상어종
                                            </InputLabel>
                                            <Select
                                                labelId="demo-simple-select-outlined-label"
                                                id="demo-simple-select-outlined"
                                                value={fishType}
                                                onChange={event => setFishType(event.target.value)}
                                                label={"대상어종"}
                                            >
                                                <MenuItem value={0}>전체</MenuItem>
                                                {fishTypeList.map((item, idx) => {
                                                    return (
                                                        <MenuItem key={`${idx}`} value={item.id}>{item.name}</MenuItem>
                                                    )
                                                })}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                {mode === 1 && (
                                    <Grid item xs={12}>
                                        <TextField
                                            className={"d-flex mb-4"}
                                            label={"합계마리수"}
                                            variant="outlined"
                                            type={"number"}
                                            value={rankFishNumber}
                                            onChange={event => setRankFishNumber(event.target.value)}
                                        />
                                    </Grid>
                                )}
                                {(mode === 2 || mode === 4) && (
                                    <Grid item xs={12}>
                                        <TextField
                                            className={"d-flex mb-4"}
                                            label={"길이조건"}
                                            variant="outlined"
                                            type={"number"}
                                            value={questFishWidth}
                                            onChange={event => setQuestFishWidth(event.target.value)}
                                        />
                                    </Grid>
                                )}
                                {(mode === 3 || mode === 4) && (
                                    <Grid item xs={12}>
                                        <TextField
                                            className={"d-flex mb-4"}
                                            label={"마리조건"}
                                            variant="outlined"
                                            type={"number"}
                                            value={questFishNumber}
                                            onChange={event => setQuestFishNumber(event.target.value)}
                                        />
                                    </Grid>
                                )}
                                {mode === 5 && (
                                    <Grid item xs={12}>
                                        <TextField
                                            className={"d-flex mb-4"}
                                            label={"특정길이조건"}
                                            variant="outlined"
                                            type={"number"}
                                            value={questSpecialWidth}
                                            onChange={event => setQuestSpecialWidth(event.target.value)}
                                        />
                                    </Grid>
                                )}
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            className={"d-flex mb-4"}
                                            label={"총상금"}
                                            variant="outlined"
                                            type={"number"}
                                            value={totalReward}
                                            onChange={event => setTotalReward(event.target.value)}
                                        />
                                    </Grid>
                                    {(mode === 1 || mode === 5) && (
                                        <Grid item xs={6}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    className={"d-flex mb-3"}
                                                    label={"1위"}
                                                    variant="outlined"
                                                    type={"number"}
                                                    value={reward1}
                                                    onChange={event => setReward1(event.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    className={"d-flex mb-3"}
                                                    label={"2위"}
                                                    variant="outlined"
                                                    type={"number"}
                                                    value={reward2}
                                                    onChange={event => setReward2(event.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    className={"d-flex mb-3"}
                                                    label={"3위"}
                                                    variant="outlined"
                                                    type={"number"}
                                                    value={reward3}
                                                    onChange={event => setReward3(event.target.value)}
                                                />
                                            </Grid>
                                        </Grid>
                                    )}
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item sm={12} md={6}>
                                        <div className="mt-4">
                                            <div className="mr-4 text-dark-50">대표이미지</div>
                                            <div>
                                                <StyledDropzone func={setImageUploadUrl} image={image}/>
                                            </div>
                                        </div>
                                    </Grid>
                                    <Grid item sm={12} md={6}>
                                        <div className="mt-4">
                                            <div className="mr-4 text-dark-50">대회약관</div>
                                            <div>
                                                <StyledFileDropzone func={setFileUploadUrl} file={terms}/>
                                            </div>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardBody>
                )}
            </Card>
        </>
    );
}
