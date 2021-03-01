/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from "react";
import clsx from "clsx";
import {Dropdown} from "react-bootstrap";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {toAbsoluteUrl} from "../../../../_helpers";
import {useLang, setLanguage} from "../../../../i18n";
import {DropdownTopbarItemToggler} from "../../../../_partials/dropdowns";
import {FormattedMessage} from "react-intl";


const languages = [
	{
		lang: "ko",
		name: "한국어",
		flag: toAbsoluteUrl("/media/svg/flags/018-south-korea.svg"),
	},
	{
		lang: "en",
		name: "English",
		flag: toAbsoluteUrl("/media/svg/flags/226-united-states.svg"),
	},
];

export function LanguageSelectorDropdown(){
	const lang = useLang();
	const currentLanguage = languages.find((x) => x.lang === lang);
	return (
		<Dropdown drop="down" alignRight>
			<Dropdown.Toggle
				as={DropdownTopbarItemToggler}
				id="dropdown-toggle-my-cart"
			>
				<OverlayTrigger
					placement="bottom"
					overlay={
						<Tooltip id="language-panel-tooltip"><FormattedMessage id={"AUTH.SELECT_LANG"}/></Tooltip>
					}
				>
					<div className="btn btn-icon btn-hover-transparent-white btn-dropdown btn-lg mr-1">
						<img
							className="h-20px w-20px rounded-sm"
							src={currentLanguage.flag}
							alt={currentLanguage.name}
						/>
					</div>
				</OverlayTrigger>
			</Dropdown.Toggle>
			<Dropdown.Menu className="dropdown-menu p-0 m-0 dropdown-menu-anim-up dropdown-menu-sm dropdown-menu-right">
				<ul className="navi navi-hover py-4">
					{languages.map((language) => (
						<li
							key={language.lang}
							className={clsx("navi-item", {
								active: language.lang === currentLanguage.lang,
							})}
						>
							<a
								href="#"
								onClick={() => setLanguage(language.lang)}
								className="navi-link"
							>
                <span className="symbol symbol-20 mr-3">
                  <img src={language.flag} alt={language.name}/>
                </span>
								<span className="navi-text">{language.name}</span>
							</a>
						</li>
					))}
				</ul>
			</Dropdown.Menu>
		</Dropdown>
	);
}


