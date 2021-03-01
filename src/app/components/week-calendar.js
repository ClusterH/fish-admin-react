import React, {Component} from 'react';
import "../css/popup.css";
import {connect} from "react-redux";
import * as UIActions from "../actions/ui-actions";

/**
 * @param selected {Date|null}
 * @param proc {fn} fnProc(date)
 */
class WeekCalendar extends Component{
	constructor(props){
		super(props);

		this.picked_day = this.props.selected || new Date();
		this.picked_day.setHours(12, 0, 0, 0);

		this.calculateDays();

		this.state = {
			this_year: this.picked_day.getFullYear(),
			this_month: this.picked_day.getMonth(),
			next_month: this.picked_day.getMonth() === 11 ? 0 : this.picked_day.getMonth() + 1,
		};
	}

	calculateDays = () => {
		this.first_day = new Date(this.picked_day);
		this.first_day = new Date(this.first_day.setDate(this.picked_day.getDate() - this.picked_day.getDay()));
		this.first_day.setHours(12, 0, 0, 0);

		this.days = [];
		for(let i = 0; i < 7; i++){
			const tmp_day = new Date(this.first_day.getTime() + i * 86400000);
			this.days.push(tmp_day);
		}

		if(this.props.proc)
			this.props.proc(this.picked_day);
	};

	updateState = () => {
		this.setState({
			this_year: this.picked_day.getFullYear(),
			this_month: this.picked_day.getMonth(),
			next_month: this.picked_day.getMonth() === 11 ? 0 : this.picked_day.getMonth() + 1,
		});
	};

	prevWeek = () => {
		this.picked_day = new Date(this.picked_day.getTime() - 604800000);
		this.calculateDays();
		this.updateState();
	};

	nextWeek = () => {
		this.picked_day = new Date(this.picked_day.getTime() + 604800000);
		this.calculateDays();
		this.updateState();
	};

	pickDate = date_obj => {
		this.picked_day = new Date(date_obj);
		this.calculateDays();
		this.updateState();
	};

	gotoToday = () => {
		this.picked_day = new Date();
		this.calculateDays();
		this.updateState();
	};

	render(){
		const {i18n} = this.props.ui;

		return (
			<div className={"week-calendar"}>
				<div className={"widget-link-left"}>
					<i className={"fas fa-chevron-left"} onClick={this.prevWeek}/>
				</div>
				<div className={"widget-link-right"}>
					<i className={"fas fa-chevron-right"} onClick={this.nextWeek}/>
				</div>
				<div className={"header-ym"}>
					<div className={"year"}>{this.state.this_year}</div>
					<div className={"title"}>{i18n['MONTHS'][this.state.this_month]} {this.state.this_year}</div>
					<div className={"month"}>{i18n['MONTHS'][this.state.next_month]}</div>
				</div>
				<div className={"header-week cols-7"}>
					{i18n['WEEK_DAYS'].map(wk => {
						return (
							<div key={`wk-${wk}`}>{wk}</div>
						);
					})}
				</div>
				<div className={"dates cols-7"}>
					{this.days.map((day, idx) => {
						return (
							<span key={`day-${idx}`}
										className={day.getDate() === this.picked_day.getDate() ? "selected" : ""} onClick={() => {
											this.pickDate(day);
										}}>
								{day.getDate()}
							</span>
						);
					})}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	ui: state.ui,
});

export default connect(mapStateToProps, UIActions)(WeekCalendar);
