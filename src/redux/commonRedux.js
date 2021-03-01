import {persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
    SetCompetitionTabValue: "[SetCompetitionTabValue] Action",
    SetNoticeTabValue: "[SetNoticeTabValue] Action",
    SetBreadcrumbs: "[SetBreadcrumbs] Action",
    SetNoticeCount: "[SetNoticeCount] Action",
    SetTermsCount: "[SetTermsCount] Action",
    SetQuestionCount: "[SetQuestionCount] Action",
};

const initialState = {
    competitionTabValue: 0,
    noticeTabValue: 0,
    breadcrumbs: [],
    noticeCount: 0,
    termsCount: 0,
    questionCount: 0,
};

export const reducer = persistReducer(
    {storage, key: "v-706-demo2-auth", whitelist: ["tabValue"]},
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.SetCompetitionTabValue: {
                return {
                    ...state,
                    competitionTabValue: action.payload,
                };
            }
            case actionTypes.SetNoticeTabValue: {
                return {
                    ...state,
                    noticeTabValue: action.payload,
                };
            }
            case actionTypes.SetBreadcrumbs: {
                const temp = state.breadcrumbs;
                temp.push(action.payload);
                return {
                    ...state,
                    breadcrumbs: temp,
                }
            }
            case actionTypes.SetNoticeCount: {
                return {
                    ...state,
                    noticeCount: state.noticeCount + action.payload,
                }
            }
            case actionTypes.SetTermsCount: {
                return {
                    ...state,
                    termsCount: state.termsCount + action.payload,
                }
            }
            case actionTypes.SetQuestionCount: {
                return {
                    ...state,
                    questionCount: state.questionCount + action.payload,
                }
            }
            default:
                return state;
        }
    }
);

export const actions = {
    setCompetitionTabValue: (tab) => ({
        type: actionTypes.SetCompetitionTabValue,
        payload: tab
    }),
    setNoticeTabValue: (tab) => ({
        type: actionTypes.SetNoticeTabValue,
        payload: tab
    }),
    setBreadcrumbs: (data) => ({
        type: actionTypes.SetBreadcrumbs,
        payload: data,
    }),
    setNoticeCount: (data) => ({
        type: actionTypes.SetNoticeCount,
        payload: data,
    }),
    setTermsCount: (data) => ({
        type: actionTypes.SetTermsCount,
        payload: data,
    }),
    setQuestionCount: (data) => ({
        type: actionTypes.SetQuestionCount,
        payload: data,
    })
};
