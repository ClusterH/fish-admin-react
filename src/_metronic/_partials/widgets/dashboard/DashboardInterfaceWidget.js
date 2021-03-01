/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import {FormattedMessage} from "react-intl";
import {Link} from "react-router-dom";
import conf from "../../../../app/config";
import {getOption} from "../../../../redux/http/option";
import {getInterface} from "../../../../redux/http/interface";

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: 10,
        flexGrow: 1,
        width: '100%',
        borderRadius: 5,
        backgroundColor: '#0001',
    },
    logoBox: {
        display: 'flex',
        justifyContent: 'center',
        borderRadius: 4,
        overflow: 'hidden',
        objectFit: 'contain',
    },
    textItem: {
        textAlign: 'center',
        padding: 8,
        border: '1px solid #c4c4c4',
        height: 40,
        borderRadius: 4,
        marginBottom: 12,
    }
}));

export function DashboardInterfaceWidget({className}) {
    const classes = useStyles();

    const [logoUrl, setLogoUrl] = React.useState('');
    const [typography, setTypography] = React.useState('');
    const [pageTextColor, setPageTextColor] = React.useState('');
    const [pageBgColor, setPageBgColor] = React.useState('');
    const [btnTextColor, setBtnTextColor] = React.useState('');
    const [btnBgColor, setBtnBgColor] = React.useState('');

    useEffect(() => {
        getInterface()
            .then((res) => {
                const obj = res.data.results[0];
                setLogoUrl(obj.documento.documento);
                setTypography(obj.fontPagina);
                setPageTextColor(obj.colorTextoPagina);
                setPageBgColor(obj.colorFondoPagina);
                setBtnTextColor(obj.colorTextoBotones);
                setBtnBgColor(obj.colorFondoBotones);
            })
            .catch(err => console.log(err));
    }, [])

    return (
        <>
            {/* begin::Tiles Widget 1 */}
            <div className={`card card-custom ${className}`}>
                {/* begin::Header */}
                <div className="card-header border-0 pt-5">
                    <div className="card-title">
                        <div className="card-label">
                            <div className="font-weight-bolder"><FormattedMessage id={"CA.DASHBOARD.TITLE.CONFIGURATION"}/></div>
                            {/*<div className="font-size-sm text-muted mt-2">890,344 Sales</div>*/}
                        </div>
                    </div>
                </div>
                {/* end::Header */}

                {/* begin::Body */}
                <div className="card-body d-flex flex-column px-0 pt-0 pb-2">
                    {/* begin::Items */}
                    <div className="flex-grow-1 card-spacer-x">
                        <div className="d-flex mb-3">
                            <div style={{width: '50%'}}>
                                <label htmlFor=""><FormattedMessage id={"CA.DASHBOARD.SELECTED_LOGO"}/></label>
                                <div className={classes.logoBox}>
                                    <img src={conf.API_URL + '/public/files/' + logoUrl} style={{width: '60%'}} alt=""/>
                                </div>
                            </div>
                            <div style={{width: '50%'}}>
                                <label htmlFor=""><FormattedMessage id={"CA.DASHBOARD.SELECTED_FONT"}/></label>
                                <div className={classes.textItem}>{typography}</div>
                            </div>
                        </div>

                        <div className="d-flex align-items-center justify-content-between">
                            <div style={{width: '50%', marginRight: 5}}>
                                <label htmlFor=""><FormattedMessage id={"CA.DASHBOARD.PAGE_BACKGROUND_COLOR"}/></label>
                                <div className="d-flex align-items-center">
                                    <div style={{
                                        width: '30%',
                                        height: 20,
                                        backgroundColor: pageBgColor,
                                        borderRadius: 4,
                                        marginRight: 12
                                    }}/>
                                    <div>{pageBgColor}</div>
                                </div>
                            </div>
                            <div style={{width: '50%'}}>
                                <label htmlFor=""><FormattedMessage id={"CA.DASHBOARD.PAGE_TEXT_COLOR"}/></label>
                                <div className="d-flex align-items-center">
                                    <div style={{
                                        width: '30%',
                                        height: 20,
                                        backgroundColor: pageTextColor,
                                        borderRadius: 4,
                                        marginRight: 12
                                    }}/>
                                    <div>{pageTextColor}</div>
                                </div>
                            </div>
                        </div>
                        {/* end::Item */}
                        <hr/>
                        {/* begin::Item */}
                        <div className="d-flex align-items-center justify-content-between">
                            <div style={{width: '50%', marginRight: 5}}>
                                <label htmlFor=""><FormattedMessage id={"CA.DASHBOARD.BUTTON_BACKGROUND_COLOR"}/></label>
                                <div className="d-flex align-items-center">
                                    <div style={{
                                        width: '30%',
                                        height: 20,
                                        backgroundColor: btnBgColor,
                                        borderRadius: 4,
                                        marginRight: 12
                                    }}/>
                                    <div>{btnBgColor}</div>
                                </div>
                            </div>
                            <div style={{width: '50%'}}>
                                <label htmlFor=""><FormattedMessage id={"CA.DASHBOARD.BUTTON_TEXT_COLOR"}/></label>
                                <div className="d-flex align-items-center">
                                    <div style={{
                                        width: '30%',
                                        height: 20,
                                        backgroundColor: btnTextColor,
                                        borderRadius: 4,
                                        marginRight: 12
                                    }}/>
                                    <div>{btnTextColor}</div>
                                </div>
                            </div>
                        </div>
                        {/* end::Item */}

                        {/* begin::Item */}
                        <div className="d-flex align-items-center justify-content-center py-4">
                            <Link to={"/interface"} className={"btn btn-primary py-4"}>
                                <FormattedMessage id={"CA.DASHBOARD.ACCESS_CONFIGURATION"}/>
                            </Link>
                        </div>
                        {/* end::Item */}
                    </div>
                    {/* end::Items */}
                </div>
                {/* end::Body */}
            </div>
            {/* end::Tiles Widget 1 */}
        </>
    );
}
