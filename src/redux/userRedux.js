import {persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
    SetUserList: "[SetUserList] Action",
    SetUser: "[SetUser] Action",
};

const initialState = {
    users: undefined,
    user: undefined,
};

export const reducer = persistReducer(
    {storage, key: "v-706-demo2-auth", whitelist: ["users", "user"]},
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.SetUserList: {
                // const temp = [...state.users, ...action.payload];
                return {
                    ...state,
                    users: action.payload,
                };
            }
            case actionTypes.SetUser: {
                return {
                    ...state,
                    user: action.payload,
                };
            }
            default:
                return state;
        }
    }
);

export const actions = {
    setUsers: (users) => ({
        type: actionTypes.SetUserList,
        payload: {users}
    }),
    setUser: (user) => ({
        type: actionTypes.SetUser,
        payload: {user}
    }),

};
