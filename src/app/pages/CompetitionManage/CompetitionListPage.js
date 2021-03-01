/* eslint-disable no-restricted-imports */
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableSortLabel,
    TablePagination,
    InputAdornment,
    InputLabel,
    MenuItem,
    FormControl,
    Select
} from "@material-ui/core";
import {Card, CardHeader, CardBody} from "../../../_metronic/_partials/controls";
import {FormattedMessage} from "react-intl";
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../../_metronic/_helpers";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';
import LockIcon from '@material-ui/icons/Lock';
import CancelIcon from '@material-ui/icons/Cancel';
import {getUserList, getUserById, deleteUserById} from '../../../http/userCRUD';
import {useSelector, useDispatch} from "react-redux";
import {actions} from "../../../redux/userRedux";
import * as common from "../../../redux/commonRedux";
import Spinner from "../../components/Spinner";
import {CSVLink} from "react-csv";
import {deleteCompetitionById, getAllCompetitions, getCompetitionByMultiFilter} from "../../../http/competitionCRUD";
import {getStatus} from "../../../utils/computations";
import CompetitionTabs from "./CompetitionTabs";
import conf from "../../../config";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import {isMobileDevice} from "detectrtc";


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
    popupImageBox: {
        borderRadius: '4px',
        width: '50%',
        overflow: "hidden",
    }
}));

export default function CompetitionListPage(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const users = useSelector(state => state.user.users);

    const LIMIT = 25;
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);

    const [rows, setRows] = useState([]);
    const [competitionData, setCompetitionData] = useState([]);
    const [fullData, setFullData] = useState([]);
    const [detailData, setDetailData] = useState({});
    const [totalCount, setTotalCount] = useState(0);
    const [competitionId, setCompetitionId] = useState(0);
    const [competitionType, setCompetitionType] = useState(0);
    const [competitionMode, setCompetitionMode] = useState(0);
    const [progressStatus, setProgressStatus] = useState(0);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showDetailPopup, setShowDetailPopup] = useState(false);

    const [loading, setLoading] = useState(false);


    useEffect(() => {
        dispatch(common.actions.setCompetitionTabValue(0));
        getCompetitionsAction({limit: LIMIT});
    }, []);

    const getCompetitionsAction = (filter) => {
        setLoading(true);
        getCompetitionByMultiFilter(filter)
            .then((res) => {
                console.log(res.data.result)
                const temp = res.data.result?.map(x => ({
                    id: x.id,
                    type: x.type === 1 ? "상시대회" : "비정기대회",
                    name: x.name,
                    startDate: new Date(x.startDate).toLocaleString(),
                    endDate: new Date(x.endDate).toLocaleString(),
                    mode: x.mode === 1 ? "랭킹전" : "퀘스트전",
                    status: getStatus(x.startDate, x.endDate) === 1 ? "종료" : getStatus(x.startDate, x.endDate) === 2 ? "진행중" : "예견",
                    statusColor: getStatus(x.startDate, x.endDate) === 1 ? "btn-secondary" : getStatus(x.startDate, x.endDate) === 2 ? "btn-success" : "btn-warning",
                    updatedDate: new Date(x.updatedDate).toLocaleString()
                }));
                setRows(temp);
                setCompetitionData(temp);
                setTotalCount(res.data.totalCount);
                setFullData(res.data.result);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }

    const searchAction = (e) => {
        let searchKey = e.target.value.toUpperCase();
        let result = [];
        competitionData.map(item => {
            if (item?.id?.toString()?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.type?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.name?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.startDate?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.endDate?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.mode?.toUpperCase()?.indexOf(searchKey) > -1)
            {
                result.push(item);
            }
        })
        setRows(result);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        if (newPage * rowsPerPage === rows.length) {
            getCompetitionsAction({
                limit: LIMIT,
                offset: rows.length,
                type: competitionType,
                mode: competitionMode,
                status: progressStatus,
            });
        }
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
    }

    const deleteAction = async () => {
        const response = await deleteCompetitionById({competitionId});
        if (response.status === 200) {
            setShowDeletePopup(false);
            const competitions = [...rows];
            const idx = competitions.findIndex(x => x.id === competitionId);
            if (idx > -1) {
                competitions.splice(idx, 1);
                setRows(competitions);
            }
        }
    }

    const filterAction = (type, mode, status) => {
        console.log(type, mode, status)
        getCompetitionsAction({
            type: type,
            mode: mode,
            status: status,
            limit: LIMIT,
        });
    }

    const detailAction = (id) => {
        const temp = fullData.find(x => x.id === id);
        setDetailData(temp);
        setCompetitionId(id);
        setShowDetailPopup(true);
    }

    const toolbar = (
        <div className="card-toolbar">
            <button
                type="button"
                className="btn btn-primary pt-3 my-2"
            >
                <CSVLink data={rows} filename='competition_list.csv' style={{color: '#fff'}}>
					<span className="svg-icon svg-icon-md svg-icon-white">
						<SVG src={toAbsoluteUrl(
                            "/media/svg/icons/Files/Selected-file.svg"
                        )} className="h-50 align-self-center"/>
					</span>
                    <FormattedMessage id={"GENERAL.EXPORT_EXCEL"}/>
                </CSVLink>
            </button>
        </div>
    );

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <>
            {showDetailPopup && (
                <div className={"popup-container"}>
                    <div className={"popup-body"}>
                        <div className="d-flex">
                            <div className={classes.popupImageBox}>
                                <img src={detailData.image} alt="" style={{width: '100%', borderRadius: '4px'}}/>
                            </div>
                            <div style={{width: '50%'}} className={"pl-2"}>
                                <div className="p-3">대회명: {detailData.name}</div>
                                <div className="p-3">대회형식: {detailData.type === 'NORMAL' ? '상시대회' : '비정기대회'}</div>
                                <div className="p-3">시작: {new Date(detailData.startDate).toLocaleString()}</div>
                                <div className="p-3">종료: {new Date(detailData.endDate).toLocaleString()}</div>
                                <div className="p-3">참가인원: {detailData.maxAttendNumber}</div>
                            </div>
                        </div>
                        <div className="d-flex">
                            <div className="p-3" style={{width: '50%'}}>
                                <div className={"p-3"}>대회설명: {detailData.description}</div>
                                <div className={"p-3"}>
                                    <a href={`${conf.API_URL}/public/files/${detailData.termsAndConditions}`} target={'_blank'}>
                                        대회약관
                                    </a>
                                </div>
                            </div>
                            <div className="p-3" style={{width: '50%'}}>
                                <div className="p-3">중복참여가능: {detailData.duplicateAllow ? "허용" : "허용안됨"}</div>
                                <div className="p-3">
                                    대회방식:
                                    {detailData.mode === 1 ? '랭킹전'
                                        : detailData.mode === 2 ? '퀘스트전(길이조건)'
                                            : detailData.mode === 3 ? '퀘스트전(마리조건)'
                                                : detailData.mode === 4 ? '퀘스트전(길이+마리조건)'
                                                    : detailData.mode === 5 ? '퀘스트전(특정길이조건)' : null}
                                </div>
                                <div className="p-3">참여포인트: {detailData.attendCost}</div>
                                <div className="p-3">어종: {detailData.fishType?.name}</div>
                                <div className="p-3">순위방식: {detailData.rankFishNumber}</div>
                            </div>
                        </div>
                        <div className={"d-flex justify-content-end pt-4"}>
                            <button className={"btn btn-danger font-size-h5 w-120px"} onClick={() => setShowDetailPopup(false)}>
                                <FormattedMessage id={"GENERAL.CLOSE"}/>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDeletePopup && (
                <div className={"popup-container"}>
                    <div className={"popup-body warning"}>
                        <div className="popup-text font-size-h4 p-3">
                            <FormattedMessage id={"COMPETITION.DELETE_INFO"}/>
                        </div>
                        <div className={"popup-text font-size-h2 text-center py-10"}>
                            <FormattedMessage id={"GENERAL.DELETE_REALLY"}/>
                        </div>
                        <div className={"d-flex justify-content-between pt-4"}>
                            <button className={"btn btn-primary font-size-h5 w-120px"} onClick={deleteAction}>
                                <FormattedMessage id={"GENERAL.YES"}/>
                            </button>
                            <button className={"btn btn-danger font-size-h5 w-120px"} onClick={() => setShowDeletePopup(false)}>
                                <FormattedMessage id={"GENERAL.CANCEL"}/>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Card className="min-h-300px">
                <CompetitionTabs match={props.match} history={props.history}/>
                <CardHeader title={<FormattedMessage id={"COMPETITION.COMPETITION_SEARCH"}/>} toolbar={toolbar}/>
                <CardBody>
                    <Grid container spacing={2}>
                        <Grid item sm={12} md={6}>
                            <TextField
                                id="outlined-search"
                                label={<FormattedMessage id={"GENERAL.PLACEHOLDER_SEARCH"}/>}
                                type="search"
                                className={"d-flex"}
                                margin="none"
                                variant="outlined"
                                onKeyUp={searchAction}
                                InputProps={{
                                    endAdornment: <InputAdornment position={"end"}><SearchIcon/></InputAdornment>
                                }}
                            />
                        </Grid>
                        <Grid item sm={12} md={6} className={"d-flex"}>
                            <FormControl variant="outlined" className="w-150px mr-2">
                                <InputLabel id="demo-simple-select-outlined-label">
                                    <FormattedMessage id={"GENERAL.COMPETITION_TYPE"}/>
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={competitionType}
                                    onChange={event => {
                                        setCompetitionType(event.target.value);
                                        filterAction(event.target.value, competitionMode, progressStatus);
                                    }}
                                    label={<FormattedMessage id={"GENERAL.COMPETITION_TYPE"}/>}
                                >
                                    <MenuItem value={0}>전체</MenuItem>
                                    <MenuItem value={1}>상시대회</MenuItem>
                                    <MenuItem value={2}>비정기대회</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl variant="outlined" className="w-150px mr-2">
                                <InputLabel id="demo-simple-select-outlined-label">
                                    <FormattedMessage id={"GENERAL.COMPETITION_MODE"}/>
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={competitionMode}
                                    onChange={event => {
                                        setCompetitionMode(event.target.value);
                                        filterAction(competitionType, event.target.value, progressStatus);
                                    }}
                                    label={<FormattedMessage id={"GENERAL.COMPETITION_MODE"}/>}
                                >
                                    <MenuItem value={0}>전체</MenuItem>
                                    <MenuItem value={1}>랭킹전</MenuItem>
                                    <MenuItem value={2}>퀘스트전</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl variant="outlined" className="w-150px">
                                <InputLabel id="demo-simple-select-outlined-label">
                                    <FormattedMessage id={"GENERAL.COMPETITION_STATUS"}/>
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={progressStatus}
                                    onChange={event => {
                                        setProgressStatus(event.target.value);
                                        filterAction(competitionType, competitionMode, event.target.value);
                                    }}
                                    label={<FormattedMessage id={"GENERAL.COMPETITION_STATUS"}/>}
                                >
                                    <MenuItem value={0}>전체</MenuItem>
                                    <MenuItem value={3}>예견</MenuItem>
                                    <MenuItem value={2}>진행중</MenuItem>
                                    <MenuItem value={1}>종료</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <div className={classes.root}>
                        <Paper>
                            <div className={classes.tableWrapper}>
                                {loading ? <Spinner/> : (
                                    <Table className={classes.table}>
                                        <TableHead>
                                            <TableRow className="bg-primary-o-50">
                                                <TableCell>아이디</TableCell>
                                                <TableCell>대회형식</TableCell>
                                                <TableCell>이름</TableCell>
                                                <TableCell>방식</TableCell>
                                                <TableCell>시작날짜</TableCell>
                                                <TableCell>종료날짜</TableCell>
                                                <TableCell>상태</TableCell>
                                                <TableCell align={"right"}>액션</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.slice(
                                                page * rowsPerPage,
                                                page * rowsPerPage + rowsPerPage
                                            ).map((row, idx) => {
                                                const editPath = '/competition/edit/' + row.id;

                                                return (
                                                    <TableRow key={`${idx}`}>
                                                        <TableCell>{row.id}</TableCell>
                                                        <TableCell>{row.type}</TableCell>
                                                        <TableCell>{row.name}</TableCell>
                                                        <TableCell>{row.mode}</TableCell>
                                                        <TableCell>{row.startDate}</TableCell>
                                                        <TableCell>{row.endDate}</TableCell>
                                                        <TableCell>
                                                            <div className={`btn ${row.statusColor}`}>
                                                                {row.status}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell align={"right"}>
                                                            <button
                                                                className={"btn btn-info mr-2"}
                                                                onClick={() => detailAction(row.id)}
                                                            >
                                                                <FormattedMessage id={"GENERAL.DETAIL"}/>
                                                            </button>

                                                            <Link to={editPath}>
                                                                <div className="btn btn-primary mr-2">
                                                                    <FormattedMessage id={"GENERAL.EDIT"}/>
                                                                </div>
                                                            </Link>

                                                            <button
                                                                className={"btn btn-danger"}
                                                                onClick={() => {
                                                                    setCompetitionId(row.id);
                                                                    setShowDeletePopup(true);
                                                                }}
                                                            >
                                                                <FormattedMessage id={"GENERAL.DELETE"}/>
                                                            </button>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                            {emptyRows > 0 && (
                                                <TableRow style={{height: 78 * emptyRows}}>
                                                    <TableCell colSpan={10}/>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                )}
                            </div>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={totalCount || 0}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                backIconButtonProps={{
                                    "aria-label": "Previous Page"
                                }}
                                nextIconButtonProps={{
                                    "aria-label": "Next Page"
                                }}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </div>
                </CardBody>
            </Card>
        </>
    );
}
