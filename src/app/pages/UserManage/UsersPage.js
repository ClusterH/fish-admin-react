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

export default function UsersPage(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const users = useSelector(state => state.user.users);
    const path = window.location.pathname;

    const LIMIT = 25;
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);

    const [rows, setRows] = useState([]);
    const [userData, setUserData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [userId, setUserId] = useState(0);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setLoading(true);
        getUserList({limit: LIMIT})
            .then((res) => {
                const userList = res.data.result?.map(x => ({
                    id: x.id,
                    name: x.name,
                    email: x.email,
                    createdDate: new Date(x.createdDate).toLocaleString(),
                    active: x.active ? "인증됨" : "인증안됨",
                }));
                setRows(userList);
                setUserData(userList);
                setTotalCount(res.data.totalCount);
                setLoading(false);
                dispatch(actions.setUsers(userList));
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
        userData.map(item => {
            if (item?.id?.toString()?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.name?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.email?.toUpperCase()?.indexOf(searchKey) > -1)
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
            getUserList({limit: LIMIT, offset: rows.length})
                .then(res => {
                    const userList = res.data.result?.map(x => ({
                        id: x.id,
                        name: x.name,
                        email: x.email,
                        createdDate: new Date(x.createdDate).toLocaleString(),
                        active: x.active ? "인증됨" : "인증안됨",
                    }));
                    const temp = rows.concat(userList);
                    setRows(temp);
                    setUserData(temp);
                    setTotalCount(res.data.totalCount);
                    setLoading(false);
                    dispatch(actions.setUsers(temp));
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                })
        }
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
    }

    const deleteUser = async () => {
        const response = await deleteUserById({userId});
        if (response.status === 200) {
            setShowDeletePopup(false);
            const users = [...rows];
            const idx = users.findIndex(x => x.id === userId);
            if (idx > -1) {
                users.splice(idx, 1);
                setRows(users);
            }
        }
    }

    // const ttttt = () => {
    //     test().then(res => console.log(res.data.result)).catch(err => console.log(err));
    // }

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <>
            {showDeletePopup && (
                <div className={"popup-container"}>
                    <div className={"popup-body warning"}>
                        <div className="popup-text font-size-h4 p-3">
                            <FormattedMessage id={"USER.DELETE_USER_INFO"}/>
                        </div>
                        <div className={"popup-text font-size-h2 text-center py-10"}>
                            <FormattedMessage id={"GENERAL.DELETE_REALLY"}/>
                        </div>
                        <div className={"d-flex justify-content-between pt-4"}>
                            <button className={"btn btn-primary font-size-h5 w-120px"} onClick={() => deleteUser()}>
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
                <CardHeader title={<FormattedMessage id={"USER.USERS_LIST"}/>}/>
                <CardBody>
                    {/*<button onClick={ttttt}>aaa</button>*/}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={6}>
                            <TextField
                                id="outlined-search"
                                label={<FormattedMessage id={"USERS.PLACEHOLDER_SEARCH"}/>}
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
                                className="btn btn-primary pt-3 my-2"
                            >
                                <CSVLink data={rows} filename='user_list.csv' style={{color: '#fff'}}>
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
                                                <TableCell>이름</TableCell>
                                                <TableCell>이메일</TableCell>
                                                <TableCell>가입날자</TableCell>
                                                <TableCell>인증상태</TableCell>
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
                                                        <TableCell>{row.name}</TableCell>
                                                        <TableCell>{row.email}</TableCell>
                                                        <TableCell>{row.createdDate}</TableCell>
                                                        <TableCell>{row.active}</TableCell>
                                                        <TableCell align={"center"}>
                                                            <Link to={detailPath}>
                                                                <div className="btn btn-primary px-5 mr-2">
                                                                    <FormattedMessage id={"GENERAL.DETAIL"}/>
                                                                </div>
                                                            </Link>
                                                            <button
                                                                className={"btn btn-danger"}
                                                                onClick={() => {
                                                                    setUserId(row.id);
                                                                    setShowDeletePopup(true);
                                                                }}
                                                            ><FormattedMessage id={"GENERAL.DELETE"}/></button>
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
