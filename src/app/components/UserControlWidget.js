import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PersonIcon from '@material-ui/icons/Person';
import {Switch} from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles(theme => ({
    item: {
        paddingTop: 0,
        paddingBottom: 0,
    },
}));

export default function UserControlWidget(props) {
    const classes = useStyles();

    return (
        <div className="px-4">
            {props.onlineUsers.map((user, index) => {
                return (
                    <div
                        key={`${index}`}
                        className="btn btn-secondary d-block my-2 text-left"
                        onClick={() => props.setSelectedUser(index, user)}
                    >
                        <span className="mx-3"><PersonIcon/></span>
                        <label>{user.nombre + ' ' + user.apellidos}</label>
                    </div>
                );
            })}
            <Divider light/>
            {/*{props.data.offlineUsers.map((offline_user, index) => {*/}
            {/*	return (*/}
            {/*		<ListItem button className={classes.item} key={`offline-${index}`}>*/}
            {/*			<ListItemIcon>*/}
            {/*				<FormControlLabel*/}
            {/*					control={<Switch name="checkedB" color="primary" // checked={state.checkedB}*/}
            {/*													 onChange={null}/>}*/}
            {/*					label={<PersonIcon/>}*/}
            {/*				/>*/}
            {/*			</ListItemIcon>*/}
            {/*			<ListItemText primary={offline_user}/>*/}
            {/*		</ListItem>*/}
            {/*	);*/}
            {/*})}*/}
        </div>
    );
}
