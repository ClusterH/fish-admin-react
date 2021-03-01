import React, {useEffect} from "react";
import {GraphicalWidget} from "../components/dashboard/GraphicalWidget";
import {TopLevelUserWidget} from "../components/dashboard/TopLevelUserWidget";
import {CompetitionWidget} from "../components/dashboard/CompetitionWidget";
import {UserWidget} from "../components/dashboard/UserWidget";
import {CustomerCenterWidget} from "../components/dashboard/CustomerCenterWidget";
import {WithdrawalWidget} from "../components/dashboard/WithdrawalWidget";

export function DashboardPage() {

  return <>
    {/* begin::Dashboard */}

    {/* begin::Row */}
    <div className="row">
      <div className="col-xl-4">
        <UserWidget className="gutter-b card-stretch"/>
      </div>
      <div className="col-xl-4">
        <TopLevelUserWidget className="gutter-b card-stretch"/>
      </div>
      <div className="col-xl-4">
        <CompetitionWidget className="gutter-b card-stretch"/>
      </div>
    </div>
    {/* end::Row */}

    {/* begin::Row */}
    <div className="row">
      <div className="col-xl-5">
          <div className="W-100">
            <WithdrawalWidget className="gutter-b"/>
          </div>
          <div className="W-100">
            <CustomerCenterWidget className="gutter-b card-stretch"/>
          </div>
      </div>
      <div className="col-xl-7">
        <GraphicalWidget className="gutter-b card-stretch"/>
      </div>
    </div>
    {/* end::Row */}

    {/* end::Dashboard */}
  </>;
}
