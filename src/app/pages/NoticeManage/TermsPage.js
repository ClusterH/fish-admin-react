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
import {actions} from "../../../redux/commonRedux";
import Spinner from "../../components/Spinner";
import {CSVLink} from "react-csv";
import {setBreadcrumbs} from "../../../utils/computations";
import {deleteNotice, deleteTerms, getAllNotice, getAllTerms} from "../../../http/noticeCRUD";
import NoticeType from "./NoticeType";
import AddNotice from "./AddNotice";
import NoticeTabs from "./NoticeTabs";
import * as common from "../../../redux/commonRedux";
import AddTerms from "./AddTerms";


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
    cellContent: {
        maxWidth: '200px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
}));

export default function TermsPage(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const cntTerms = useSelector(state => state.common.termsCount);
    const path = window.location.pathname;

    const LIMIT = 25;
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);

    const [rows, setRows] = useState([]);
    const [termsData, setTermsData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [termsId, setTermsId] = useState(0);
    // const [addedNotice, setAddedNotice] = useState({});
    const [showAddTermsPopup, setShowAddTermsPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [selectedTerms, setSelectedTerms] = useState({});
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setLoading(true);
        dispatch(common.actions.setNoticeTabValue(1));
        getAllTerms({limit: LIMIT})
            .then((res) => {
                console.log(res.data.result)
                const termsList = res.data.result?.map(x => ({
                    id: x.id,
                    title: x.title,
                    content: x.content,
                    createdDate: new Date(x.createdDate).toLocaleString(),
                }));
                setRows(termsList);
                setTermsData(termsList);
                setTotalCount(res.data.totalCount);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });

        setBreadcrumbs(path);
    }, [cntTerms]);

    const searchAction = (e) => {
        let searchKey = e.target.value.toUpperCase();
        let result = [];
        termsData.map(item => {
            if (item?.id?.toString()?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.title?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.content?.toUpperCase()?.indexOf(searchKey) > -1)
            {
                result.push(item);
            }
        })
        setRows(result);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        if (newPage * rowsPerPage === rows.length) {
            setLoading(true);
            getAllNotice({limit: LIMIT, offset: rows.length})
                .then((res) => {
                    const termsList = res.data.result?.map(x => ({
                        id: x.id,
                        title: x.title,
                        content: x.content,
                        createdDate: new Date(x.createdDate).toLocaleString(),
                    }));
                    setRows(termsList);
                    setTermsData(termsList);
                    setTotalCount(res.data.totalCount);
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                });
        }
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
    }

    const deleteAction = () => {
        deleteTerms({termsId: termsId}).then((res) => {
            dispatch(actions.setTermsCount(-1));
            setShowDeletePopup(false);
        }).catch(err => {
            console.log(err);
        })
    }

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    const toolbar = (
        <div className="card-toolbar">
            {/*<button className={"btn btn-primary mr-2"} onClick={() => setShowAddNoticePopup(true)}>공지사항추가</button>*/}
            <button className={"btn btn-info mr-2"}
                    onClick={() => setShowAddTermsPopup(true)}>
                약관추가
            </button>
            <button
                type="button"
                className="btn btn-success pt-3 my-2"
            >
                <CSVLink data={rows} filename='terms_list.csv' style={{color: '#fff'}}>
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

    return (
        <>
            {showAddTermsPopup && <AddTerms setShowAddTermsPopup={setShowAddTermsPopup}
                                              data={selectedTerms}
                                              setSelectedTerms={setSelectedTerms}
            />}
            {/*{showNoticeTypePopup && <NoticeType setShowNoticeTypePopup={setShowNoticeTypePopup}/>}*/}
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

            <Card>
                <NoticeTabs match={props.match} history={props.history}/>
                <CardHeader title={"약관목록"} toolbar={toolbar}/>
                <CardBody>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={6}>
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
                                                <TableCell>제목</TableCell>
                                                <TableCell>내용</TableCell>
                                                <TableCell>등록날짜</TableCell>
                                                <TableCell align={"center"}>액션</TableCell>
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
                                                        <TableCell>{row.title}</TableCell>
                                                        <TableCell className={classes.cellContent}>{row.content}</TableCell>
                                                        <TableCell>{row.createdDate}</TableCell>
                                                        <TableCell align={"center"}>
                                                            <button className={"btn btn-primary mr-2"} onClick={() => {
                                                                setSelectedTerms(row);
                                                                setShowAddTermsPopup(true);
                                                            }}>
                                                                편집
                                                            </button>
                                                            <button className={"btn btn-danger"} onClick={() => {
                                                                setTermsId(row.id);
                                                                setShowDeletePopup(true);
                                                            }}>
                                                                삭제
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


