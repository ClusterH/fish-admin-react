import {persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";
import {put, takeLatest} from "redux-saga/effects";
import {getUserByToken} from "../http/authCRUD";
import setAuthToken from "../utils/setAuthToken";

export const actionTypes = {
    Login: "[Login] Action",
    Logout: "[Logout] Action",
    Register: "[Register] Action",
    UserRequested: "[Request User] Action",
    UserLoaded: "[Load User] Auth API",
    SetUser: "[SetUser] Action",
};

const initialAuthState = {
    user: undefined,
    authToken: undefined,
};

export const reducer = persistReducer(
    {storage, key: "v-706-demo2-auth", whitelist: ["user", "authToken"]},
    (state = initialAuthState, action) => {
        switch (action.type) {
            case actionTypes.Login: {
                const {authToken} = action.payload;
                return {authToken, user: undefined};
            }

            case actionTypes.Register: {
                const {authToken} = action.payload;
                return {authToken, user: undefined};
            }

            case actionTypes.SetUser: {
                return {
                    ...state,
                    user: action.payload,
                };
            }

            case actionTypes.Logout: {
                // TODO: Change this code. Actions in reducer aren't allowed.
                return initialAuthState;
            }

            case actionTypes.UserLoaded: {
                const {user} = action.payload;
                return {...state, user};
            }

            default:
                return state;
        }
    }
);

export const actions = {
    login: (authToken) => {
        console.log(initialAuthState)
        return({
            type: actionTypes.Login,
            payload: {authToken}
        })
    },
    register: (authToken) => ({
        type: actionTypes.Register,
        payload: {authToken},
    }),
    logout: () => {
        console.log(initialAuthState)
        localStorage.removeItem('jwtToken');
        setAuthToken(false);
        return ({
            type: actionTypes.Logout
        });
    },
    setUser: (user) => ({
        type: actionTypes.SetUser,
        payload: user,
    }),
    requestUser: (user) => ({
        type: actionTypes.UserRequested,
        payload: {user},
    }),
    fulfillUser: (user) => ({
        type: actionTypes.UserLoaded,
        payload: {user}
    }),
};

export function* saga() {
    yield takeLatest(actionTypes.Login, function* loginSaga() {
        yield put(actions.requestUser());
    });

    yield takeLatest(actionTypes.Register, function* registerSaga() {
        yield put(actions.requestUser());
    });

    yield takeLatest(actionTypes.UserRequested, function* userRequested() {
        const {data} = yield getUserByToken();
        const user = data.result;
        console.log(user);
        yield put(actions.fulfillUser(user));
    });
}
