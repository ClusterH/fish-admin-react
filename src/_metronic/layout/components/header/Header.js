import React, {useMemo} from "react";
import {Link} from "react-router-dom";
import objectPath from "object-path";
import {toAbsoluteUrl} from "../../../_helpers";
import {useHtmlClassService} from "../..";
import {Topbar} from "./Topbar";
import {HeaderMenuWrapper} from "./header-menu/HeaderMenuWrapper";

export function Header(){
	const uiService = useHtmlClassService();

	const layoutProps = useMemo(() => {
		return {
			headerClasses: uiService.getClasses("header", true),
			headerAttributes: uiService.getAttributes("header"),
			headerContainerClasses: uiService.getClasses("header_container", true),
			menuHeaderDisplay: objectPath.get(
				uiService.config,
				"header.menu.self.display"
			),
		};
	}, [uiService]);

	return (
		<>
			{/*begin::Header*/}
			<div
				className={`header ${layoutProps.headerClasses}`}
				id="kt_header"
				{...layoutProps.headerAttributes}
			>
				{/*begin::Container*/}
				<div
					className={` ${layoutProps.headerContainerClasses} d-flex align-items-stretch justify-content-between`}
				>
					{/* begin::Left */}
					<div className="d-flex align-items-stretch mr-5">
						{/* begin::Header Logo */}
						<div className="header-logo mr-15">
							<Link to="/">
								<img
									className="logo-default max-h-65px"
									alt="Logo"
									src={toAbsoluteUrl("/media/logos/logo-1.svg")}
								/>
							</Link>
						</div>
						{/* end::Header Logo */}
						{layoutProps.menuHeaderDisplay && <HeaderMenuWrapper/>}
					</div>
					{/* end::Left */}

					{/*begin::Topbar*/}
					<Topbar/>
					{/*end::Topbar*/}
				</div>
				{/*end::Container*/}
			</div>
			{/*end::Header*/}
		</>
	);
}
