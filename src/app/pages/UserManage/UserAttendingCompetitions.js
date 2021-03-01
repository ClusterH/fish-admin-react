/* eslint-disable no-restricted-imports */
import React, {useEffect, useState} from "react";
import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    InputAdornment,
} from "@material-ui/core";
import {Card, CardHeader, CardBody} from "../../../_metronic/_partials/controls";
import {FormattedMessage} from "react-intl";
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../../_metronic/_helpers";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import SearchIcon from '@material-ui/icons/Search';
import Spinner from "../../components/Spinner";
import {CSVLink} from "react-csv";
import {getProgressingCompetitionsByUser} from "../../../http/competitionCRUD";
import {getStatus} from "../../../utils/computations";


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

export default function UserAttendingCompetitions(props) {
    const {userId, history} = props;
    const classes = useStyles();

    const LIMIT = 25;
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);

    const [rows, setRows] = useState([]);
    const [competitionData, setCompetitionData] = useState([]);
    const [fullData, setFullData] = useState([]);
    const [detailData, setDetailData] = useState({});
    const [totalCount, setTotalCount] = useState(0);
    const [competitionId, setCompetitionId] = useState(0);
    const [showDetailPopup, setShowDetailPopup] = useState(false);

    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setLoading(true);
        getProgressingCompetitionsByUser({userId})
            .then((res) => {
                console.log(res.data.result)
                const temp = res.data.result?.map(x => ({
                    id: x.id,
                    competitionId: x.competition?.id,
                    type: x.competition?.type === 1 ? "상시대회" : "비정기대회",
                    name: x.competition?.name,
                    startDate: new Date(x.competition?.startDate).toLocaleString(),
                    endDate: new Date(x.competition?.endDate).toLocaleString(),
                    mode: x.competition?.mode === 1 ? "랭킹전" : "퀘스트전",
                    status: getStatus(x.competition?.startDate, x.competition?.endDate) === 1 ? "종료" : getStatus(x.competition?.startDate, x.competition?.endDate) === 2 ? "진행중" : "예견",
                    statusColor: getStatus(x.competition?.startDate, x.competition?.endDate) === 1 ? "btn-secondary" : getStatus(x.competition?.startDate, x.competition?.endDate) === 2 ? "btn-success" : "btn-warning",
                    updatedDate: new Date(x.competition?.updatedDate).toLocaleString()
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
    }, []);

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
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
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
                <CSVLink data={rows} filename='progressing_competition_list.csv' style={{color: '#fff'}}>
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
                        <div className="p-3">대회명: {detailData.competition.name}</div>
                        <div className="p-3">대회설명: {detailData.competition.description}</div>
                        <div className="p-3">대회형식: {detailData.competition.type === 1 ? '상시대회' : '비정기대회'}</div>
                        <div className="p-3">시작: {new Date(detailData.competition.startDate).toLocaleString()}</div>
                        <div className="p-3">종료: {new Date(detailData.competition.endDate).toLocaleString()}</div>
                        <div className="p-3">참가인원: {detailData.competition.maxAttendNumber}</div>
                        <div className="p-3">중복참여가능: {detailData.competition.duplicateAllow ? "허용" : "허용안됨"}</div>
                        <div className="p-3">
                            대회방식:
                            {detailData.competition.mode === 1 ? '랭킹전'
                                : detailData.competition.mode === 2 ? '퀘스트전(길이조건)'
                                    : detailData.competition.mode === 3 ? '퀘스트전(마리조건)'
                                        : detailData.competition.mode === 4 ? '퀘스트전(길이+마리조건)'
                                            : detailData.competition.mode === 5 ? '퀘스트전(특정길이조건)' : null}
                        </div>
                        <div className="p-3">참여포인트: {detailData.competition.attendCost}</div>
                        <div className="p-3">어종: {detailData.competition.fishType?.name}</div>
                        <div className="p-3">순위방식: {detailData.competition.rankFishNumber}</div>

                        <div className={"d-flex justify-content-end pt-4"}>
                            <button className={"btn btn-danger font-size-h5 w-120px"} onClick={() => setShowDetailPopup(false)}>
                                <FormattedMessage id={"GENERAL.CLOSE"}/>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Card className="min-h-300px">
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
                                                        <TableCell>{row.competitionId}</TableCell>
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
