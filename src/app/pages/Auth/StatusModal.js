import React, {useState} from "react";
import {FormattedMessage, injectIntl} from "react-intl";
import {Link, Redirect} from "react-router-dom";

export default function StatusModal(props) {
    const {msg, setErrModal} = props;
    const [toLogin, setToLogin] = useState(false);

    const handleClick = () => {
        console.log(msg)
        if (msg === 'AUTH.VERIFY_CODE_EXPIRED') {
            setToLogin(true);
        } else {
            setErrModal(false);
        }
    }

    return (
        <>
            {toLogin && <Redirect to="/auth"/>}
            {!toLogin && (
                <div className="position-absolute top-0 left-0 w-100 h-100"
                     style={{backgroundColor: '#ffffff', zIndex: 10}}
                >
                    <div className="text-center font-size-h3 p-2">
                        <FormattedMessage id={msg || 'NONE'}/>
                    </div>
                    <div className="mt-4 text-center">
                        <button className="btn btn-primary py-4"
                                onClick={handleClick}
                        >
                            <FormattedMessage id={"AUTH.BUTTON.OK"}/>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
