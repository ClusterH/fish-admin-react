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
import EditIcon from '@material-ui/icons/Edit';
import LockIcon from '@material-ui/icons/Lock';
import CancelIcon from '@material-ui/icons/Cancel';
import {getUserList, getUserById, deleteUserById, test} from '../../../http/userCRUD';
import {useSelector, useDispatch} from "react-redux";
import {actions} from "../../../redux/userRedux";
import Spinner from "../../components/Spinner";
import {CSVLink} from "react-csv";
import {setBreadcrumbs} from "../../../utils/computations";
import {finishWithdrawal, getAllWithdrawal} from "../../../http/withdrawalCRUD";
import WithdrawalAccountType from "./WithdrawalAccountType";


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

export default function WithdrawalPage(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const path = window.location.pathname;

    const LIMIT = 25;
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);

    const [rows, setRows] = useState([]);
    const [withdrawalData, setWithdrawalData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [withdrawalId, setWithdrawalId] = useState(0);
    const [showAccountTypePopup, setShowAccountTypePopup] = useState(false);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setLoading(true);
        getAllWithdrawal({limit: LIMIT})
            .then((res) => {
                const withdrawalList = res.data.result?.map(x => ({
                    id: x.id,
                    user: x.user?.name,
                    pointAmount: x.pointAmount,
                    receiverName: x.receiverName,
                    phoneNumber: x.phoneNumber,
                    accountType: x.accountType?.type,
                    accountNumber: x.accountNumber,
                    citizenNumber: x.citizenNumber,
                    status: x.status === 0 ? "대기중" : x.status === 1 ? "성공" : "실패",
                    statusColor: x.status === 0 ? "btn-secondary" : x.status === 1 ? "btn-success" : "btn-danger",
                    createdDate: new Date(x.createdDate).toLocaleString(),
                }));
                setRows(withdrawalList);
                setWithdrawalData(withdrawalList);
                setTotalCount(res.data.totalCount);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });

        setBreadcrumbs(path);
    }, []);

    const searchAction = (e) => {
        let searchKey = e.target.value.toUpperCase();
        let result = [];
        withdrawalData.map(item => {
            if (item?.id?.toString()?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.user?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.receiverName?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.pointAmount?.toString()?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.receiverName?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.accountType?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.accountNumber?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.citizenNumber?.toUpperCase()?.indexOf(searchKey) > -1 ||
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
            setLoading(true);
            getAllWithdrawal({limit: LIMIT, offset: rows.length})
                .then((res) => {
                    const withdrawalList = res.data.result?.map(x => ({
                        id: x.id,
                        user: x.user?.name,
                        pointAmount: x.pointAmount,
                        receiverName: x.receiverName,
                        phoneNumber: x.phoneNumber,
                        accountType: x.accountType?.type,
                        accountNumber: x.accountNumber,
                        citizenNumber: x.citizenNumber,
                        status: x.status === 0 ? "대기중" : x.status === 1 ? "성공" : "실패",
                        statusColor: x.status === 0 ? "btn-secondary" : x.status === 1 ? "btn-success" : "btn-danger",
                        createdDate: new Date(x.createdDate).toLocaleString(),
                    }));
                    setRows(withdrawalList);
                    setWithdrawalData(withdrawalList);
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

    const statusAction = (id, status) => {

        finishWithdrawal({withdrawalId: id, status: status})
            .then(res => {
                console.log(id, status)
                const temp = [...rows];
                const item = temp.find(x => x.id === id);
                console.log(item.status)
                if (item.status === "대기중") {
                    item.statusColor = status === 1 ? "btn-success" : "btn-danger";
                    item.status = status === 1 ? "성공" : "실패";
                }
                setRows(temp);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <>
            {showAccountTypePopup && <WithdrawalAccountType setShowAccountTypePopup={setShowAccountTypePopup}/>}
            <Card>
                <CardHeader title={<FormattedMessage id={"WITHDRAWAL.WITHDRAWAL_LIST"}/>}/>
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
                        <Grid item xs={12} sm={6} md={6} className={"d-flex justify-content-end pt-3"}>
                            <button
                                type="button"
                                className="btn btn-success pt-3 m-2"
                                onClick={() => setShowAccountTypePopup(true)}
                            >
                                계좌유형추가
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary pt-3 my-2"
                            >
                                <CSVLink data={rows} filename='withdrawal_list.csv' style={{color: '#fff'}}>
                                <span className="svg-icon svg-icon-md svg-icon-white">
                                    <SVG src={toAbsoluteUrl(
                                        "/media/svg/icons/Files/Selected-file.svg"
                                    )} className="h-50 align-self-center"/>
                                </span>
                                    <FormattedMessage id={"GENERAL.EXPORT_EXCEL"}/>
                                </CSVLink>
                            </button>
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
                                                <TableCell>신청자이름</TableCell>
                                                <TableCell>출금포인트</TableCell>
                                                <TableCell>받을 사람이름</TableCell>
                                                <TableCell>받을 사람전화번호</TableCell>
                                                <TableCell>계좌유형</TableCell>
                                                <TableCell>계좌번호</TableCell>
                                                <TableCell>주민번호</TableCell>
                                                <TableCell>신청날짜</TableCell>
                                                <TableCell>출금상태</TableCell>
                                                <TableCell align={"center"}>액션</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.slice(
                                                page * rowsPerPage,
                                                page * rowsPerPage + rowsPerPage
                                            ).map((row, idx) => {
                                                const detailPath = '/user/detail/' + row.id;

                                                return (
                                                    <TableRow key={`${idx}`}>
                                                        <TableCell>{row.id}</TableCell>
                                                        <TableCell>{row.user}</TableCell>
                                                        <TableCell>{row.pointAmount}</TableCell>
                                                        <TableCell>{row.receiverName}</TableCell>
                                                        <TableCell>{row.phoneNumber}</TableCell>
                                                        <TableCell>{row.accountType}</TableCell>
                                                        <TableCell>{row.accountNumber}</TableCell>
                                                        <TableCell>{row.citizenNumber}</TableCell>
                                                        <TableCell>{row.createdDate}</TableCell>
                                                        <TableCell>
                                                            <button className={`btn ${row.statusColor}`}>
                                                                {row.status}
                                                            </button>
                                                        </TableCell>
                                                        {row.status === "대기중" ? (
                                                            <TableCell align={"center"}>
                                                                <button className={"btn btn-success mr-2"} onClick={() => statusAction(row.id, 1)}>
                                                                    성공
                                                                </button>
                                                                <button className={"btn btn-danger"} onClick={() => statusAction(row.id, 2)}>
                                                                    실패
                                                                </button>
                                                            </TableCell>
                                                        ) : (
                                                            <TableCell></TableCell>
                                                        )}
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


