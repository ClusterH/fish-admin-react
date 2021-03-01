import React, {useEffect, useState} from "react";
import {Card, CardBody, CardHeader} from "../../../_metronic/_partials/controls";
import {FormattedMessage} from "react-intl";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useSelector, useDispatch} from "react-redux";
import {getProfileByUserId} from "../../../http/userCRUD";
import {toAbsoluteUrl} from "../../../_metronic/_helpers";
import Spinner from "../../components/Spinner";
import handleError from "../../../utils/handleError";


export default function UserPoints(props) {
    const {userId, history} = props;
    const [point, setPoint] = useState(0);

    useEffect(() => {
        getProfileByUserId({userId})
            .then(res => {
                setPoint(res.data.result?.pointAmount);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);
    return (
        <>
            <Card>
                <CardHeader title={<FormattedMessage id={"USER.TAB_WITHDRAWALS"}/>}/>
                <CardBody>
                    <div className="text-primary font-size-h3">{point}</div>
                </CardBody>
            </Card>
        </>
    )
}
