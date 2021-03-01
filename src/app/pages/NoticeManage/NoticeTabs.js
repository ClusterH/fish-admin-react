import React, {useEffect, useState} from 'react';
import "../../css/config-header.css";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {useSelector, useDispatch} from "react-redux";
import {actions} from "../../../redux/commonRedux";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
    },
}));

export default function NoticeTabs(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const tabValue = useSelector(state => state.common.noticeTabValue);

    // const [value, setValue] = useState(props.match.params.tab ? parseInt(props.match.params.tab) : 0);
    const [value, setValue] = useState(tabValue);

    useEffect(() => {
        setValue(tabValue);
    }, [tabValue])

    function handleChange(event, newValue) {
        setValue(newValue);
        dispatch(actions.setNoticeTabValue(newValue));

        if (newValue === 0) {
            const breadcrumb = {
                title: "공지사항목록",
                path: "/notice"
            };
            dispatch(actions.setBreadcrumbs(breadcrumb));
            props.history.push('/notice');
        } else if (newValue === 1) {
            const breadcrumb = {
                title: "약관목록",
                path: "/terms"
            };
            dispatch(actions.setBreadcrumbs(breadcrumb));
            props.history.push('/terms');
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
                <Tab label={"공지사항목록"} className="font-size-h6"/>
                <Tab label={"약관목록"} className="font-size-h6"/>
            </Tabs>
        </>
    );
}
