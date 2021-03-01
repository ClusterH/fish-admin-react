/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {getAllAgents} from "../../../../redux/userManage/userManageCRUD";

export function DashboardCreditsWidget(props){
	const {className, data} = props;
	const [userList, setUserList] = React.useState([]);
	const [selectedUser, setSelectedUser] = React.useState(0);
	const [credit, setCredit] = React.useState(0);

	useEffect(() => {
		getAllAgents().then((res) => {
			setUserList(res.data.results);
		}).catch(err => console.log(err));
	}, [])

	const handleChangeUser = (e) => {
		const userId = e.target.value;
		setSelectedUser(userId);
		const user = userList.filter(x => x.id === userId)[0];
		setCredit(user.creditosContratados);
	}

	return (
		<>
			{/* begin::Tiles Widget 1 */}
			<div className={`card card-custom ${className}`}>
				{/* begin::Header */}
				<div className="card-header border-0 pt-5">
					<div className="card-title">
						<div className="card-label">
							<div className="font-weight-bolder">Créditos</div>
							{/*<div className="font-size-sm text-muted mt-2">890,344 Sales</div>*/}
						</div>
					</div>
					<div className="card-toolbar">
					</div>
				</div>
				{/* end::Header */}

				{/* begin::Body */}
				<div className="card-body d-flex flex-column px-0 pt-0 pb-2">
					{/* begin::Items */}
					<div className="flex-grow-1 card-spacer-x">
						{/* begin::Item */}
						<div className="d-flex align-items-center justify-content-center pt-5 pb-1">
							<FormControl className={"w-100"} variant="outlined">
								<InputLabel id="demo-simple-select-outlined-label">Seleccione un usuario</InputLabel>
								<Select
									labelId="demo-simple-select-outlined-label"
									id="demo-simple-select-outlined"
									value={selectedUser}
									onChange={handleChangeUser}
									label="Seleccione un usuario"
								>
									{userList.map((user, idx) => {
										return (
											<MenuItem value={user.id} key={`${idx}`}>
												{`${user.nombre} ${user.apellidos}`}
											</MenuItem>
										)
									})}
								</Select>
							</FormControl>
						</div>
						{/* end::Item */}

						{/* begin::Item */}
						<div className="d-flex align-items-center justify-content-center pt-5 pb-1">
							<div className="d-flex flex-wrap align-items-center justify-content-between w-100">
								<div className="text-dark-75 font-weight-bold font-size-lg mb-1">
									Nº de créditos:
								</div>
								<span className="label label-lg label-light-primary label-inline font-weight-bold py-4">
									{credit}
								</span>
							</div>
						</div>
						{/* end::Item */}

						{/* begin::Item */}
						<div className="d-flex align-items-center justify-content-center py-5">
							<Link to={"/credits"} className={"btn btn-primary py-4"}>
								ACCESO PANEL CRÉDITOS
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
