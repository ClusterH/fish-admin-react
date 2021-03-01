/* eslint-disable no-restricted-imports */
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
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
import Spinner from "../../components/Spinner";
import {CSVLink} from "react-csv";
import {getProgressingCompetitions} from "../../../http/competitionCRUD";
import CompetitionTabs from "./CompetitionTabs";
import {getAllFishes, getFishesByMultiFilter} from "../../../http/fishCRUD";
import {useDispatch} from "react-redux";
import * as common from "../../../redux/commonRedux";


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

export default function FishListPage(props) {
    const classes = useStyles();
    const dispatch = useDispatch();

    const LIMIT = 25;
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);

    const [rows, setRows] = useState([]);
    const [fishData, setFishData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [progressingCompetitions, setProgressingCompetitions] = useState([]);
    const [competition, setCompetition] = useState(0);
    const [settingStatus, setSettingStatus] = useState(0);

    const [loading, setLoading] = useState(false);


    useEffect(() => {
        dispatch(common.actions.setCompetitionTabValue(3));
        getProgressingCompetitions()
            .then((res) => {
                console.log(res.data.result);
                setProgressingCompetitions(res.data.result);
            })
            .catch(err => {
                console.log(err);
            });

        getFishesAction({limit: LIMIT});
    }, []);

    const getFishesAction = (filter) => {
        setLoading(true);
        getFishesByMultiFilter(filter)
            .then((res) => {
                console.log(res.data.result);
                const temp = res.data.result?.map(x => ({
                    id: x.id,
                    user: x.user?.name,
                    competition: x.competition?.name,
                    fishType: x.fishType?.name,
                    fishWidth: x.fishWidth,
                    status: x.status === 3 ? "대기중" : x.status === 1 ? "등록" : "거부",
                    statusColor: x.status === 3 ? "btn-secondary" : x.status === 1 ? "btn-success" : "btn-danger",
                    action: x.status === 3 ? "수동판별" : "편집",
                    updatedDate: x.registerDate ? new Date(x.registerDate).toLocaleString() : ''
                }));
                setRows(temp);
                setFishData(temp);
                setTotalCount(res.data.totalCount);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            })
    }

    const searchAction = (e) => {
        let searchKey = e.target.value.toUpperCase();
        let result = [];
        fishData.map(item => {
            if (item?.id?.toString()?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.user?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.competition?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.fishType?.toUpperCase()?.indexOf(searchKey) > -1 ||
                item?.fishWidth?.toString()?.toUpperCase()?.indexOf(searchKey) > -1 ||
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
            getFishesAction({
                limit: LIMIT,
                offset: rows.length,
                competitionId: competition,
                status: settingStatus,
            });
        }
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
    }

    const filterAction = (competition, status) => {
        console.log(competition, status)
        getFishesAction({
            competitionId: competition,
            status: status,
            limit: LIMIT,
        });
    }

    const toolbar = (
        <div className="card-toolbar">
            <button
                type="button"
                className="btn btn-primary pt-3 my-2"
            >
                <CSVLink data={rows} filename='fish_list.csv' style={{color: '#fff'}}>
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
            <Card className="min-h-300px">
                <CompetitionTabs match={props.match} history={props.history}/>
                <CardHeader title={"등록된 물고기목록"} toolbar={toolbar}/>
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
                                    진행중인 대회
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={competition}
                                    onChange={event => {
                                        setCompetition(event.target.value);
                                        filterAction(event.target.value, settingStatus);
                                    }}
                                    label={"진행중인 대회"}
                                >
                                    <MenuItem value={0}>전체</MenuItem>
                                    {progressingCompetitions.map((item, idx) => {
                                        return (
                                            <MenuItem value={item.id} key={`${idx}`}>{item.name}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl variant="outlined" className="w-150px mr-2">
                                <InputLabel id="demo-simple-select-outlined-label">
                                    판별상태
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={settingStatus}
                                    onChange={event => {
                                        setSettingStatus(event.target.value);
                                        filterAction(competition, event.target.value);
                                    }}
                                    label={"판별상태"}
                                >
                                    <MenuItem value={0}>전체</MenuItem>
                                    <MenuItem value={2}>거부</MenuItem>
                                    <MenuItem value={1}>등록</MenuItem>
                                    <MenuItem value={3}>대기중</MenuItem>
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
                                                <TableCell>물고기아이디</TableCell>
                                                <TableCell>유저이름</TableCell>
                                                <TableCell>대회이름</TableCell>
                                                <TableCell>물고기이름</TableCell>
                                                <TableCell>물고기길이</TableCell>
                                                <TableCell>등록날짜</TableCell>
                                                <TableCell>상태</TableCell>
                                                <TableCell align={"right"}>액션</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.slice(
                                                page * rowsPerPage,
                                                page * rowsPerPage + rowsPerPage
                                            ).map((row, idx) => {
                                                const editPath = '/competition/fish/manual-setting/' + row.id;

                                                return (
                                                    <TableRow key={`${idx}`}>
                                                        <TableCell>{row.id}</TableCell>
                                                        <TableCell>{row.user}</TableCell>
                                                        <TableCell>{row.competition}</TableCell>
                                                        <TableCell>{row.fishType}</TableCell>
                                                        <TableCell>{row.fishWidth}</TableCell>
                                                        <TableCell>{row.updatedDate}</TableCell>
                                                        <TableCell>
                                                            <div className={`btn ${row.statusColor}`}>
                                                                {row.status}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell align={"right"}>
                                                            <Link to={editPath}>
                                                                <div className="btn btn-primary mr-2">
                                                                    {row.action}
                                                                </div>
                                                            </Link>
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
