import React, {useState} from "react";

export function FooterCompact(
    {
        today,
        footerClasses,
        footerContainerClasses,
    }) {

    return (
        <>
            {/* begin::Footer */}
            <div
                className={`footer bg-white py-4 d-flex flex-lg-column  ${footerClasses}`}
                id="kt_footer"
            >
                {/* begin::Container */}
                <div
                    className={`${footerContainerClasses} text-center py-2`}
                >
                    {/* begin::Copyright */}
                    <div className="text-dark order-2 order-md-1">
                        <span className="text-muted font-weight-bold mr-2">{today} &copy; 낚시의 맛 관리자페이지</span>
                    </div>
                    {/* end::Copyright */}
                </div>
                {/* end::Container */}
            </div>
            {/* end::Footer */}
        </>
    );
}
