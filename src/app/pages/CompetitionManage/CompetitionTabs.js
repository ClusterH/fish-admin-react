import React, {useEffect, useState} from 'react';
import "../../css/config-header.css";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {FormattedMessage} from "react-intl";
import {useSelector, useDispatch} from "react-redux";
import {actions} from "../../../redux/commonRedux";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
    },
}));

export default function CompetitionTabs(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const tabValue = useSelector(state => state.common.competitionTabValue);

    // const [value, setValue] = useState(props.match.params.tab ? parseInt(props.match.params.tab) : 0);
    const [value, setValue] = useState(tabValue);

    useEffect(() => {
        setValue(tabValue);
    }, [tabValue])

    function handleChange(event, newValue) {
        setValue(newValue);
        dispatch(actions.setCompetitionTabValue(newValue));

        if (newValue === 0) {
            const breadcrumb = {
                title: "대회검색",
                path: "/competition/list"
            };
            dispatch(actions.setBreadcrumbs(breadcrumb));
            props.history.push('/competition/list');
        } else if (newValue === 1) {
            const breadcrumb = {
                title: "대회생성",
                path: "/competition/edit"
            };
            dispatch(actions.setBreadcrumbs(breadcrumb));
            props.history.push('/competition/edit');
        } else if (newValue === 2) {
            const breadcrumb = {
                title: "물고기종류등록",
                path: "/competition/fish-type/add"
            };
            dispatch(actions.setBreadcrumbs(breadcrumb));
            props.history.push('/competition/fish-type/add');
        } else if (newValue === 3) {
            const breadcrumb = {
                title: "물고기판별",
                path: "/competition/fish-list"
            };
            dispatch(actions.setBreadcrumbs(breadcrumb));
            props.history.push('/competition/fish-list');
        }
    }

    return (
        <>
            <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="on"
                indicatorColor="primary"
                textColor="primary"
                className={classes.root}
            >
                <Tab label={<FormattedMessage id={"COMPETITION.COMPETITION_SEARCH"}/>} className="font-size-h6"/>
                <Tab label={<FormattedMessage id={"COMPETITION.COMPETITION_ADD"}/>} className="font-size-h6"/>
                <Tab label={<FormattedMessage id={"COMPETITION.FISH_TYPE_ADD"}/>} className="font-size-h6"/>
                <Tab label={<FormattedMessage id={"COMPETITION.FISH_MANUAL_SETTING"}/>} className="font-size-h6"/>
            </Tabs>
        </>
    );
}
