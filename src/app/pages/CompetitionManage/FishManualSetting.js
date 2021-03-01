/* eslint-disable no-restricted-imports */
import React, {useEffect, useState} from "react";
import {
    InputLabel,
    MenuItem,
    FormControl,
    Select
} from "@material-ui/core";
import {Card, CardHeader, CardBody} from "../../../_metronic/_partials/controls";
import {FormattedMessage} from "react-intl";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import CompetitionTabs from "./CompetitionTabs";
import {getFishById, registerCheckedFish, updateFish} from "../../../http/fishCRUD";
import {getAllFishTypes} from "../../../http/configurationCRUD";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import ImageGallery from 'react-image-gallery';


const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        marginTop: theme.spacing(2)
    },
    table: {
        minWidth: 1200
    },
    tableWrapper: {
        overflowX: "auto"
    },
}));

const images = [
    {
        original: 'https://picsum.photos/id/1018/1000/600/',
        thumbnail: 'https://picsum.photos/id/1018/250/150/',
    },
    {
        original: 'https://picsum.photos/id/1015/1000/600/',
        thumbnail: 'https://picsum.photos/id/1015/250/150/',
    },
    {
        original: 'https://picsum.photos/id/1019/1000/600/',
        thumbnail: 'https://picsum.photos/id/1019/250/150/',
    },
];

export default function FishManualSetting(props) {
    const classes = useStyles();
    const fishId = window.location.pathname.split("/").pop();

    const [fishTypeList, setFishTypeList] = useState([]);
    const [user, setUser] = useState('');
    const [competition, setCompetition] = useState('');
    const [fishTypeId, setFishTypeId] = useState('');
    const [fishWidth, setFishWidth] = useState('');
    const [fishImages, setFishImages] = useState([]);
    const [note, setNote] = useState('');
    const [showRejectPopup, setShowRejectPopup] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [toastMsg, setToastMsg] = useState(false);

    useEffect(() => {
        setLoading1(true);
        setLoading2(true);
        getAllFishTypes()
            .then((res) => {
                setLoading1(false);
                setFishTypeList(res.data.result);
            })
            .catch(err => {
                console.log(err);
                setLoading1(false);
            });

        getFishById({fishId})
            .then((res) => {
                setLoading2(false);
                const data = res.data.result;
                console.log(data)
                setUser(data.user?.name);
                setCompetition(data.competition?.name);
                setFishTypeId(data.fishTypeId || '');
                setFishWidth(data.fishWidth || '');
                setFishImages(data.fishImage?.image);
            })
            .catch(err => {
                console.log(err);
                setLoading2(false);
            })

    }, []);

    const registerAction = () => {
        const data = {
            fishId,
            fishTypeId,
            fishWidth,
        };
        registerCheckedFish(data)
            .then((res) => {
                setToastMsg(true);
                props.history.push('/competition/fish-list');
            })
            .catch(err => {
                console.log(err);
            })
    }

    const rejectAction = () => {
        const data = {
            fishId,
            note,
            status: 2
        };

        updateFish(data)
            .then((res) => {
                setShowRejectPopup(false);
                props.history.push('/competition/fish-list');
            })
            .catch(err => {
                console.log(err);
            })
    }

    const toolbar = (
        <div className="card-toolbar">
            <button
                className="btn btn-info w-120px"
                onClick={() => props.history.push('/competition/fish-list')}
            >
                <FormattedMessage id={"GENERAL.CANCEL"}/>
            </button>
        </div>
    );

    return (
        <>
            {showRejectPopup && (
                <div className={"popup-container"}>
                    <div className={"popup-body warning"}>
                        <div className="popup-text font-size-h4 p-3">
                            물고기접수거부
                        </div>
                        <div className={"popup-text font-size-h2 text-center py-10"}>
                            <TextField
                                className={"d-flex mb-4"}
                                label={"거부하는 이유를 입력해주세요"}
                                variant="outlined"
                                value={note}
                                onChange={event => setNote(event.target.value)}
                            />
                        </div>
                        <div className={"d-flex justify-content-between pt-4"}>
                            <button className={"btn btn-primary font-size-h5 w-120px"} onClick={() => rejectAction()}>
                                확인
                            </button>
                            <button className={"btn btn-danger font-size-h5 w-120px"} onClick={() => setShowRejectPopup(false)}>
                                <FormattedMessage id={"GENERAL.CANCEL"}/>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Card className="min-h-300px">
                <CompetitionTabs match={props.match} history={props.history}/>
                <CardHeader title={"물고기판별"} toolbar={toolbar}/>
                <CardBody>
                    <Grid container spacing={2}>
                        <Grid item sm={12} md={6}>
                            <ImageGallery items={images}/>
                        </Grid>
                        <Grid item sm={12} md={6} className={"p-10"}>
                            <Grid container spacing={2} className="d-flex align-items-center mb-5">
                                <Grid item xs={3} sm={3}>대회명</Grid>
                                <Grid item xs={9} sm={9}>
                                    <div className="text-primary font-size-h3">{competition}</div>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} className="d-flex align-items-center mb-5">
                                <Grid item xs={3} sm={3}>회원이름</Grid>
                                <Grid item xs={9} sm={9}>
                                    <div className="text-primary font-size-h3">{user}</div>
                                </Grid>
                            </Grid>
                            <Grid item xl={12}>
                                <div className="text-danger text-center mb-10">
                                    물고기사진에 기초하여 물고기명과 물고기길이를 판별하세요.
                                </div>
                            </Grid>
                            <Grid container spacing={2} className="d-flex align-items-center mb-5">
                                <Grid item xs={3}>물고기명</Grid>
                                <Grid item xs={9}>
                                    <FormControl variant="outlined" className="d-flex mr-2" style={{width: '100%'}}>
                                        <InputLabel id="demo-simple-select-outlined-label">
                                            물고기명
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            value={fishTypeId}
                                            onChange={event => setFishTypeId(event.target.value)}
                                            label={"물고기명"}
                                        >
                                            {fishTypeList.map((item, idx) => {
                                                return (
                                                    <MenuItem value={item.id} key={`${idx}`}>{item.name}</MenuItem>
                                                )
                                            })}
                                            <MenuItem value={0}>기타</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} className="d-flex align-items-center mb-5">
                                <Grid item xs={3}>물고기길이</Grid>
                                <Grid item xs={9}>
                                    <TextField
                                        className={"d-flex mb-4"}
                                        label={"물고기길이"}
                                        variant="outlined"
                                        type={"number"}
                                        value={fishWidth}
                                        onChange={event => setFishWidth(event.target.value)}
                                    />
                                </Grid>
                            </Grid>
                            <div className="d-flex justify-content-end">
                                <button className={"btn btn-primary mr-4 w-120px"} onClick={registerAction}>
                                    <FormattedMessage id={"GENERAL.REGISTER"}/>
                                </button>
                                <button
                                    className="btn btn-danger w-120px"
                                    onClick={() => setShowRejectPopup(true)}
                                >
                                    거부
                                </button>
                            </div>
                        </Grid>
                    </Grid>
                </CardBody>
            </Card>
        </>
    );
}
