import React, {useEffect, useState} from "react";
import {Card, CardBody, CardHeader} from "../../../_metronic/_partials/controls";
import {FormattedMessage} from "react-intl";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useSelector, useDispatch} from "react-redux";
import {deleteUserById, getProfileByUserId, getUserList} from "../../../http/userCRUD";
import {toAbsoluteUrl} from "../../../_metronic/_helpers";
import Spinner from "../../components/Spinner";
import handleError from "../../../utils/handleError";
import {actions} from "../../../redux/userRedux";
import TextField from "@material-ui/core/TextField";
import {
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow
} from "@material-ui/core";
import {CSVLink} from "react-csv";
import SVG from "react-inlinesvg";
import {Link} from "react-router-dom";
import {deletePostById, getPostByUser} from "../../../http/postCRUD";
import SearchIcon from '@material-ui/icons/Search';

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
    postImageBox: {
        width: '100%'
    },
    postImage: {
        width: '100%'
    }
}));

export default function UserPosts(props) {
    const {userId, history} = props;
    const classes = useStyles();

    const LIMIT = 25;
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);

    const [rows, setRows] = useState([]);
    const [postData, setPostData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [postId, setPostId] = useState(0);
    const [selectedPost, setSelectedPost] = useState({});
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showLookPopup, setShowLookPopup] = useState(false);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setLoading(true);
        const data = {
            userId: userId,
            limit: LIMIT,
        }
        getPostByUser(data)
            .then((res) => {
                const postList = res.data.result?.map(x => ({
                    id: x.id,
                    image: x.image,
                    content: x.content,
                    createdDate: new Date(x.createdDate).toLocaleString(),
                }));
                setRows(postList);
                setPostData(postList);
                setTotalCount(res.data.totalCount);
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
        postData.map(item => {
            if (item?.id?.toString()?.toUpperCase()?.indexOf(searchKey) > -1 ||
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

            const data = {
                userId: userId,
                limit: LIMIT,
                offset: rows.length,
            }
            getPostByUser(data)
                .then(res => {
                    const postList = res.data.result?.map(x => ({
                        id: x.id,
                        image: x.image,
                        content: x.content,
                        createdDate: new Date(x.createdDate).toLocaleString(),
                    }));
                    const temp = rows.concat(postList);
                    setRows(temp);
                    setPostData(temp);
                    setTotalCount(res.data.count);
                    setLoading(false);
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

    const deletePost = async () => {
        const response = await deletePostById({postId});
        if (response.status === 200) {
            setShowDeletePopup(false);
            const posts = [...rows];
            const idx = posts.findIndex(x => x.id === postId);
            if (idx > -1) {
                posts.splice(idx, 1);
                setRows(posts);
            }
        }
    }

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <>
            {showDeletePopup && (
                <div className={"popup-container"}>
                    <div className={"popup-body warning"}>
                        <div className="popup-text font-size-h4 p-3">
                            <FormattedMessage id={"POST.DELETE"}/>
                        </div>
                        <div className={"popup-text font-size-h2 text-center py-10"}>
                            <FormattedMessage id={"GENERAL.DELETE_REALLY"}/>
                        </div>
                        <div className={"d-flex justify-content-between pt-4"}>
                            <button className={"btn btn-primary font-size-h5 w-120px"} onClick={() => deletePost()}>
                                <FormattedMessage id={"GENERAL.YES"}/>
                            </button>
                            <button className={"btn btn-danger font-size-h5 w-120px"} onClick={() => setShowDeletePopup(false)}>
                                <FormattedMessage id={"GENERAL.CANCEL"}/>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showLookPopup && (
                <div className={"popup-container"}>
                    <div className={"popup-body"}>
                        <div className="popup-text">
                            {selectedPost.createdDate}
                        </div>
                        <div className="popup-text font-size-h5 p-3">
                            {selectedPost.content}
                        </div>
                        <div className={classes.postImageBox}>
                            <img src={selectedPost.image || toAbsoluteUrl("/media/bg/img-29.jpg")} alt="" className={classes.postImage}/>
                        </div>

                        <div className={"d-flex justify-content-end pt-4"}>
                            <button className={"btn btn-primary font-size-h5 w-120px"} onClick={() => setShowLookPopup(false)}>
                                <FormattedMessage id={"GENERAL.CLOSE"}/>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Card>
                <CardHeader title={<FormattedMessage id={"USER.REGISTERED_POSTS"}/>}/>
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
                                className="btn btn-primary pt-3 my-2"
                            >
                                <CSVLink data={rows} filename='registered-post.csv' style={{color: '#fff'}}>
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
                                                <TableCell>이미지URL</TableCell>
                                                <TableCell>게시물내용</TableCell>
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
                                                    <TableRow key={`${idx}`} className="max-h-70px">
                                                        <TableCell>{row.id}</TableCell>
                                                        <TableCell>{row.image}</TableCell>
                                                        <TableCell className={classes.cellContent}>
                                                            {row.content}
                                                        </TableCell>
                                                        <TableCell>{row.createdDate}</TableCell>
                                                        <TableCell align={"center"}>
                                                            <button className={"btn btn-primary mr-2"}
                                                                    onClick={() => {
                                                                        setPostId(row.id);
                                                                        setSelectedPost(row);
                                                                        setShowLookPopup(true);
                                                                    }}
                                                            >
                                                                <FormattedMessage id={"GENERAL.LOOK"}/>
                                                            </button>
                                                            <button
                                                                className={"btn btn-danger"}
                                                                onClick={() => {
                                                                    setPostId(row.id);
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
                                count={totalCount}
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
