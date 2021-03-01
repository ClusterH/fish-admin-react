/* eslint-disable no-restricted-imports */
import React, {useEffect, useState} from "react";
import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@material-ui/core";
import {Card, CardHeader, CardBody} from "../../../_metronic/_partials/controls";
import {FormattedMessage} from "react-intl";
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../../_metronic/_helpers";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import {useSelector, useDispatch} from "react-redux";
import Spinner from "../../components/Spinner";
import {CSVLink} from "react-csv";
import {deleteCompetitionById, getAllCompetitions, getCompetitionByMultiFilter} from "../../../http/competitionCRUD";
import CompetitionTabs from "./CompetitionTabs";
import {deleteFishType, getAllFishTypes, registerFishType} from "../../../http/configurationCRUD";
import * as common from "../../../redux/commonRedux";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        marginTop: theme.spacing(2)
    },
    table: {
        minWidth: 400
    },
    tableWrapper: {
        overflowX: "auto"
    },
}));

export default function CompetitionListPage(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [rows, setRows] = useState([]);
    const [fishType, setFishType] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setLoading(true);
        dispatch(common.actions.setCompetitionTabValue(2));
        getAllFishTypes()
            .then((res) => {
                setRows(res.data.result);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    const registerAction = () => {
        if (fishType !== '') {
            registerFishType({name: fishType})
                .then((res) => {
                    const temp = [...rows];
                    temp.push(res.data.result);
                    setFishType('');
                    setRows(temp)
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    const deleteAction = async (id) => {
        const response = await deleteFishType({fishTypeId: id});
        if (response.status === 200) {
            const temp = [...rows];
            const idx = temp.findIndex(x => x.id === id);
            if (idx > -1) {
                temp.splice(idx, 1);
                setRows(temp);
            }
        }
    }

    const toolbar = (
        <div className="card-toolbar">
            <button
                type="button"
                className="btn btn-primary pt-3 my-2"
            >
                <CSVLink data={rows} filename='fish_type_list.csv' style={{color: '#fff'}}>
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
            <Card className="min-h-300px">
                <CompetitionTabs match={props.match} history={props.history}/>
                <CardHeader title={<FormattedMessage id={"COMPETITION.FISH_TYPE_ADD"}/>} toolbar={toolbar}/>
                <CardBody>
                    <Grid container spacing={2}>
                        <Grid item sm={12} md={4}>
                            <div className="py-3">새 물고기종류를 추가하세요</div>
                            <TextField
                                id="outlined-search"
                                label={<FormattedMessage id={"GENERAL.PLACEHOLDER_FISH_TYPE"}/>}
                                className={"d-flex my-3"}
                                margin="none"
                                variant="outlined"
                                value={fishType}
                                onChange={event => setFishType(event.target.value)}
                            />
                            <div className="d-flex justify-content-end">
                                <button className="btn btn-primary w-120px" onClick={registerAction}>
                                    <FormattedMessage id={"GENERAL.REGISTER"}/>
                                </button>
                            </div>
                        </Grid>
                        <Grid item sm={12} md={8}>
                            <div className={classes.root}>
                                <Paper>
                                    <div className={classes.tableWrapper}>
                                        {loading ? <Spinner/> : (
                                            <Table className={classes.table}>
                                                <TableHead>
                                                    <TableRow className="bg-primary-o-50">
                                                        <TableCell>아이디</TableCell>
                                                        <TableCell>물고기종</TableCell>
                                                        <TableCell>등록날짜</TableCell>
                                                        <TableCell align={"right"}>액션</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {rows.map((row, idx) => {
                                                        return (
                                                            <TableRow key={`${idx}`}>
                                                                <TableCell>{row.id}</TableCell>
                                                                <TableCell>{row.name}</TableCell>
                                                                <TableCell>{new Date(row.createdDate).toLocaleString()}</TableCell>
                                                                <TableCell align={"right"}>
                                                                    <button
                                                                        className={"btn btn-danger"}
                                                                        onClick={() => {
                                                                            deleteAction(row.id);
                                                                        }}
                                                                    ><FormattedMessage id={"GENERAL.DELETE"}/></button>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })}
                                                </TableBody>
                                            </Table>
                                        )}
                                    </div>
                                </Paper>
                            </div>
                        </Grid>
                    </Grid>
                </CardBody>
            </Card>
        </>
    );
}
