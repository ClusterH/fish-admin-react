/* eslint-disable no-restricted-imports */
import React, {useEffect, useState} from "react";
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
import {useSelector, useDispatch} from "react-redux";
import Spinner from "../../components/Spinner";
import {CSVLink} from "react-csv";
import {getQuestionsByFilter} from "../../../http/customCenterCRUD";
import {getReportByFilter, updateReport} from "../../../http/reportCURD";


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
    },
    cellContent: {
        maxWidth: '200px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
}));

export default function ReportList(props) {
    const classes = useStyles();

    const LIMIT = 25;
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);

    const [rows, setRows] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedReport, setSelectedReport] = useState({});
    const [progressStatus, setProgressStatus] = useState(0);
    const [showDetailPopup, setShowDetailPopup] = useState(false);

    const [loading, setLoading] = useState(false);


    useEffect(() => {
        getReportAction({limit: LIMIT});
    }, []);

    const getReportAction = (filter) => {
        setLoading(true);
        getReportByFilter(filter)
            .then((res) => {
                console.log(res.data.result);
                const temp = res.data.result?.map(x => ({
                    id: x.id,
                    user: x.user?.name,
                    reporter: x.reporter?.name,
                    content: x.type === 1 ? "다른 물고기등록" : x.type === 2 ? "불쾌감을 주는 회원" : x.content,
                    reportedDate: new Date(x.createdDate).toLocaleString(),
                    status: x.status === 1 ? "대기중" : x.status === 2 ? "완료됨" : "거부됨",
                    statusColor: x.status === 1 ? "btn-secondary" : x.status === 2 ? "btn-success" : "btn-danger",
                }));
                setLoading(false);
                setRows(temp);
                setReportData(temp);
                setTotalCount(res.data.totalCount);
            })
            .catch(err => {
                setLoading(false);
                console.log(err)
            })
    }

    const searchAction = (e) => {
        let searchKey = e.target.value.toUpperCase();
        let result = [];
        reportData.map(item => {
            if (item?.id?.toString()?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.user?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.reporter?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.content?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.reportedDate?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.status?.toUpperCase()?.indexOf(searchKey) > -1)
            {
                result.push(item);
            }
        })
        setRows(result);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        if (newPage * rowsPerPage === rows.length) {
            getReportAction({
                limit: LIMIT,
                offset: rows.length,
                status: progressStatus,
            });
        }
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
    }

    const filterAction = (status) => {
        getReportAction({status: status, limit: LIMIT});
    }

    const updateAction = (reportId, status) => {
        updateReport({reportId, status}).then(data => {
            const temp = [...rows];
            const idx = temp.findIndex(x => x.id === reportId);
            if (idx > -1) {
                temp[idx].status = status === 2 ? "완료됨" : "거부됨";
                temp[idx].statusColor = status === 2 ? "btn-success" : "btn-danger"
            }
            setRows(temp);
        }).catch(err => {
            console.log(err);
        })
    }

    const toolbar = (
        <div className="card-toolbar">
            <button
                type="button"
                className="btn btn-primary pt-3 my-2"
            >
                <CSVLink data={rows} filename='report_list.csv' style={{color: '#fff'}}>
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
                        <div className="p-3">
                            <div className="popup-text p-2">
                                날짜: <span className="ml-2">{selectedReport.reportedDate}</span>
                            </div>
                            <div className="popup-text p-2">
                                신소한 사람: <span className="ml-2">{selectedReport.reporter}</span>
                            </div>
                            <div className="popup-text p-2">
                                신소받은 사람: <span className="ml-2">{selectedReport.user}</span>
                            </div>
                            <div className="popup-text p-2">
                                신소내용: <span className="ml-2">{selectedReport.content}</span>
                            </div>
                        </div>

                        <div className={"d-flex justify-content-end pt-4"}>
                            <button className={"btn btn-primary w-120px"} onClick={() => setShowDetailPopup(false)}>
                                <FormattedMessage id={"GENERAL.CLOSE"}/>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Card className="min-h-300px">
                <CardHeader title={"신소목록"} toolbar={toolbar}/>
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
                                        filterAction(event.target.value);
                                    }}
                                    label={<FormattedMessage id={"GENERAL.COMPETITION_STATUS"}/>}
                                >
                                    <MenuItem value={0}>전체</MenuItem>
                                    <MenuItem value={1}>대기중</MenuItem>
                                    <MenuItem value={2}>처리완료</MenuItem>
                                    <MenuItem value={3}>거부</MenuItem>
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
                                                <TableCell>신소받은 사람</TableCell>
                                                <TableCell>신소내용</TableCell>
                                                <TableCell>신소자</TableCell>
                                                <TableCell>신소날짜</TableCell>
                                                <TableCell>처리상태</TableCell>
                                                <TableCell align={"right"}>액션</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.slice(
                                                page * rowsPerPage,
                                                page * rowsPerPage + rowsPerPage
                                            ).map((row, idx) => {
                                                return (
                                                    <TableRow key={`${idx}`}>
                                                        <TableCell>{row.id}</TableCell>
                                                        <TableCell>{row.user}</TableCell>
                                                        <TableCell className={classes.cellContent}>{row.content}</TableCell>
                                                        <TableCell>{row.reporter}</TableCell>
                                                        <TableCell>{row.reportedDate}</TableCell>
                                                        <TableCell>
                                                            <div className={`btn ${row.statusColor}`}>
                                                                {row.status}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell align={"right"}>
                                                            {row.status === "대기중" && (
                                                                <>
                                                                    <button className={"btn btn-primary mr-2"} onClick={() => {
                                                                        updateAction(row.id, 2);
                                                                    }}>
                                                                        처리완료
                                                                    </button>
                                                                    <button className={"btn btn-danger mr-2"} onClick={() => {
                                                                        updateAction(row.id, 3);
                                                                    }}>
                                                                        거부
                                                                    </button>
                                                                </>
                                                            )}
                                                            <button className={"btn btn-info mr-2"} onClick={() => {
                                                                setSelectedReport(row);
                                                                setShowDetailPopup(true);
                                                            }}>
                                                                보기
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
