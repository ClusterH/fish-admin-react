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
import AddNotice from "../NoticeManage/AddNotice";
import SettingAnswer from "./SettingAnswer";


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

export default function QuestionList(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const cntQuestion = useSelector(state => state.common.questionCount);

    const LIMIT = 25;
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);

    const [rows, setRows] = useState([]);
    const [questionData, setQuestionData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedQuestion, setSelectedQuestion] = useState({});
    const [progressStatus, setProgressStatus] = useState(0);
    const [showAnswerPopup, setShowAnswerPopup] = useState(false);

    const [loading, setLoading] = useState(false);


    useEffect(() => {
        getQuestionAction({limit: LIMIT});
    }, [cntQuestion]);

    const getQuestionAction = (filter) => {
        setLoading(true);
        getQuestionsByFilter(filter)
            .then((res) => {
                const temp = res.data.result?.map(x => ({
                    id: x.id,
                    user: x.user?.name,
                    question: x.question,
                    questionDate: new Date(x.questionDate).toLocaleString(),
                    answer: x.answer,
                    answerDate: x.answerDate ? new Date(x.answerDate).toLocaleString() : '',
                    status: x.status === 1 ? "답변완료" : "답변대기중",
                    statusColor: x.status === 1 ? "btn-success" : "btn-secondary",
                }));
                setLoading(false);
                setRows(temp);
                setQuestionData(temp);
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
        questionData.map(item => {
            if (item?.id?.toString()?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.user?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.question?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.questionDate?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.answer?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.answerDate?.toUpperCase()?.indexOf(searchKey) > -1 ||
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
            getQuestionAction({
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
        getQuestionAction({status: status, limit: LIMIT});
    }

    const toolbar = (
        <div className="card-toolbar">
            <button
                type="button"
                className="btn btn-primary pt-3 my-2"
            >
                <CSVLink data={rows} filename='question_list.csv' style={{color: '#fff'}}>
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
            {showAnswerPopup && <SettingAnswer setShowAnswerPopup={setShowAnswerPopup} data={selectedQuestion}/>}

            <Card className="min-h-300px">
                <CardHeader title={"문의관리"} toolbar={toolbar}/>
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
                                    <MenuItem value={1}>답변완료</MenuItem>
                                    <MenuItem value={2}>대기중</MenuItem>
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
                                                <TableCell>문의자</TableCell>
                                                <TableCell>문의내용</TableCell>
                                                <TableCell>문의한 날짜</TableCell>
                                                <TableCell>답변내용</TableCell>
                                                <TableCell>답변날짜</TableCell>
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
                                                        <TableCell>{row.user}</TableCell>
                                                        <TableCell>{row.question}</TableCell>
                                                        <TableCell>{row.questionDate}</TableCell>
                                                        <TableCell>{row.answer}</TableCell>
                                                        <TableCell>{row.answerDate}</TableCell>
                                                        <TableCell>
                                                            <div className={`btn ${row.statusColor}`}>
                                                                {row.status}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell align={"right"}>
                                                            {row.status === "답변대기중" ? (
                                                                <button className={"btn btn-primary mr-2"} onClick={() => {
                                                                    setSelectedQuestion(row);
                                                                    setShowAnswerPopup(true);
                                                                }}>
                                                                    답변하기
                                                                </button>
                                                            ) : (
                                                                <button className={"btn btn-info"} onClick={() => {
                                                                    setSelectedQuestion(row);
                                                                    setShowAnswerPopup(true);
                                                                }}>
                                                                    보기
                                                                </button>
                                                            )}
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
