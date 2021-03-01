import React from 'react';
import "../../css/config-header.css";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DvrIcon from '@material-ui/icons/Dvr';
import ExtensionIcon from '@material-ui/icons/Extension';
import StorefrontIcon from '@material-ui/icons/Storefront';
import AppsIcon from '@material-ui/icons/Apps';
import UserAttendingCompetitions from "./UserAttendingCompetitions";
import UserAttendedCompetitions from "./UserAttendedCompetitions";
import UserProfile from "./UserProfile";
import UserPosts from "./UserPosts";
import UserPoints from "./UserPoints";
import {FormattedMessage} from "react-intl";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
    },
}));

export default function UserDetailPage(props) {
    const classes = useStyles();
    const userId = props.location.pathname.split("/").pop();

    const [value, setValue] = React.useState(props.match.params.tab ? parseInt(props.match.params.tab) : 0);

    // window.history.pushState("object or string", "Title", "/detail");

    function handleChange(event, newValue){
        setValue(newValue);
    }

    return (
        <>
            <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="on"
                indicatorColor="primary"
                textColor="secondary"
                className={classes.root}
            >
                <Tab label={<FormattedMessage id={"USER.TAB_PROFILE"}/>} icon={<DvrIcon/>} className="font-size-h6"/>
                <Tab label={<FormattedMessage id={"USER.TAB_POSTS"}/>} icon={<ExtensionIcon/>} className="font-size-h6"/>
                <Tab label={<FormattedMessage id={"USER.TAB_ATTENDING"}/>} icon={<StorefrontIcon/>} className="font-size-h6"/>
                <Tab label={<FormattedMessage id={"USER.TAB_ATTENDED"}/>} icon={<AppsIcon/>} className="font-size-h6"/>
                <Tab label={<FormattedMessage id={"USER.TAB_WITHDRAWALS"}/>} icon={<AppsIcon/>} className="font-size-h6"/>
            </Tabs>
            {value === 0 && <UserProfile userId={userId} history={props.history}/>}
            {value === 1 && <UserPosts userId={userId} history={props.history}/>}
            {value === 2 && <UserAttendingCompetitions userId={userId} history={props.history}/>}
            {value === 3 && <UserAttendedCompetitions userId={userId} history={props.history}/>}
            {value === 4 && <UserPoints userId={userId} history={props.history}/>}
        </>
    );
}
