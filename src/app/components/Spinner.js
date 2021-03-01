import React, {useEffect, useState} from "react";
import "../css/common.css";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        marginTop: theme.spacing(2)
    },
}));

export default function Spinner(props) {
    const classes = useStyles();

    if (props.shape === 'ellipsis') {
        return (
            <div className="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        )
    } else if (props.shape === "ring") {
        return (
            <div className={"spinner-container"}>
                <div className={"lds-ring"}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        )
    } else if (props.shape === "ripple") {
        return (
            <div className={"spinner-container"}>
                <div className="lds-ripple">
                    <div></div>
                    <div></div>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className={"spinner-container"}>
                <div className="lds-dual-ring"></div>
            </div>
        )
    }
}
