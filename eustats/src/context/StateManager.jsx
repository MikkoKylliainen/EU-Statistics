import {useReducer} from 'react';
import ActionContext from './ActionContext';
import AppStateContext from './AppStateContext';
import * as actionConstants from './actionConstants';

const getInitialState = () => {
	if (sessionStorage.getItem("state")) {
		let state = JSON.parse(sessionStorage.getItem("state"));
		return state;
	} else {
		return {
			list:[],
			loading:false,
			isLogged:false,
			error:"",
			token:"",
			user:""
		}
	}
}

const saveToStorage = (state) => {
	sessionStorage.setItem("state",JSON.stringify(state));
}

const initialState = getInitialState();

const runsReducer = (state,action) => {
	let tempState = {};
	switch (action.type) {
		case actionConstants.LOADING:
			return {
				...state,
				loading:true,
				error:""
			}
		case actionConstants.STOP_LOADING:
			return {
				...state,
				loading:false
			}
		case actionConstants.REGISTER_SUCCESS:
			tempState = {
				...state,
				error:"Register success"
			}
			saveToStorage(tempState);
			return tempState;
		case actionConstants.LOGIN_SUCCESS:
			tempState = {
				...state,
				isLogged:true,
				userId:action._userId,
				token:action.token
			}
			saveToStorage(tempState);
			return tempState;
		case actionConstants.LOGOUT_SUCCESS:
			tempState = {
				list:[],
				isLogged:false,
				loading:false,
				token:"",
				error:"",
				user:""
			}
			saveToStorage(tempState);
			return tempState;
		case actionConstants.LOGOUT_FAILED:
			tempState = {
				list:[],
				isLogged:false,
				loading:false,
				token:"",
				error:action.error,
				user:""
			}
			saveToStorage(tempState);
			return tempState;			
		case actionConstants.FETCH_LIST_SUCCESS:
			tempState = {
				...state,
				list:action.list
			}
			saveToStorage(tempState);
			return tempState;
		case actionConstants.ADD_ITEM_SUCCESS:
		case actionConstants.REMOVE_ITEM_SUCCESS:
		case actionConstants.EDIT_ITEM_SUCCESS:
			return state; // Not in use atm.
		case actionConstants.REGISTER_FAILED:
		case actionConstants.LOGIN_FAILED:
		case actionConstants.FETCH_LIST_FAILED:
		case actionConstants.ADD_ITEM_FAILED:
		case actionConstants.REMOVE_ITEM_FAILED:
		case actionConstants.EDIT_ITEM_FAILED:
			tempState = {
				...state,
				error:action.error
			}
			saveToStorage(tempState);
			return tempState;
		case actionConstants.SET_USERNAME:
			tempState = {
				...state,
				user:action.user
			}
			saveToStorage(tempState);
			return tempState;
		default:
			return state;
	}
}

const StateManager = (props) => {
	const [state,dispatch] = useReducer(runsReducer,initialState);
	
	return(
	<AppStateContext.Provider value={state}>
		<ActionContext.Provider value={{dispatch:dispatch}}>
			{props.children}
		</ActionContext.Provider>
	</AppStateContext.Provider>
	);
}

export default StateManager;