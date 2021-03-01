import React, {Suspense, lazy, useEffect} from "react";
import {Redirect, Switch, Route} from "react-router-dom";
import {LayoutSplashScreen, ContentRoute} from "../_metronic/layout";
import {DashboardPage} from "./pages/DashboardPage";
import UsersPage from "./pages/UserManage/UsersPage";
import UserDetailPage from "./pages/UserManage/UserDetailPage";
import CompetitionListPage from "./pages/CompetitionManage/CompetitionListPage";
import CompetitionEditPage from "./pages/CompetitionManage/CompetitionEditPage";
import FishTypeAdd from "./pages/CompetitionManage/FishTypeAdd";
import FishListPage from "./pages/CompetitionManage/FishListPage";
import FishManualSetting from "./pages/CompetitionManage/FishManualSetting";
import WithdrawalPage from "./pages/WithdrawalManage/WithdrawalPage";
import NoticePage from "./pages/NoticeManage/NoticePage";
import TermsPage from "./pages/NoticeManage/TermsPage";
import QuestionList from "./pages/CustomerCenter/questionList";
import PostList from "./pages/PostManage/PostList";
import PostDetailPage from "./pages/PostManage/PostDetailPage";
import ReportList from "./pages/ReportManage/reportList";
import {Report} from "@material-ui/icons";

export default function BasePage() {
    useEffect(() => {
        console.log('Base page');
        const container_obj = document.getElementById("main_container");
        container_obj.style.maxWidth = 'null';
    }, []);

    return (
        <Suspense fallback={<LayoutSplashScreen/>}>
            <Switch>
                {
                    /* Redirect from root URL to /dashboard. */
                    <Redirect exact from="/" to="/dashboard"/>
                }

                <ContentRoute path="/dashboard" component={DashboardPage}/>
                <ContentRoute exact path="/user" component={UsersPage}/>
                <ContentRoute exact path="/user/detail/:id?" component={UserDetailPage}/>
                <ContentRoute exact path="/competition/list" component={CompetitionListPage}/>
                <ContentRoute exact path="/competition/edit/:id?" component={CompetitionEditPage}/>
                <ContentRoute exact path="/competition/fish-type/add" component={FishTypeAdd}/>
                <ContentRoute exact path="/competition/fish-list" component={FishListPage}/>
                <ContentRoute exact path="/competition/fish/manual-setting/:id?" component={FishManualSetting}/>
                <ContentRoute exact path="/point" component={WithdrawalPage}/>
                <ContentRoute exact path="/notice" component={NoticePage}/>
                <ContentRoute exact path="/terms" component={TermsPage}/>
                <ContentRoute exact path="/customer-center" component={QuestionList}/>
                <ContentRoute exact path="/post" component={PostList}/>
                <ContentRoute exact path="/post/detail/:id?" component={PostDetailPage}/>
                <ContentRoute exact path="/report" component={ReportList}/>

                <Redirect to="error/error-v1"/>
            </Switch>
        </Suspense>
    );
}
