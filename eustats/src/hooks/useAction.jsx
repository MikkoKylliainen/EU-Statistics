import {useState,useEffect,useContext} from 'react';
import useAppState from './useAppState';
import * as actionConstants from '../context/actionConstants';
import ActionContext from '../context/ActionContext';

const useAction = () => {
	const {dispatch} = useContext(ActionContext);
	const {token} = useAppState();
	
	const [urlRequest,setUrlRequest] = useState({
		url:"",
		request:{},
		action:""
	})
	
	// Useeffect fetch
	useEffect(() => {
		const fetchData = async () => {
			if(!urlRequest.url) {
				return;
			}
			dispatch({
				type:actionConstants.LOADING
			});

			const response = await fetch(urlRequest.url,urlRequest.request);
			dispatch({
				type:actionConstants.STOP_LOADING
			});

			if (!response) {
				dispatch({
					type:actionConstants.LOGOUT_FAILED,
					error:"Server never responded. Logging you out."
				});
				return;
			}
			if (response.ok) {
				switch (urlRequest.action) {
					case "getlist":
						const data = await response.json();
						if (!data) {
							dispatch({
								type:actionConstants.FETCH_LIST_FAILED,
								error:"Failed to parse your logfile. Try again later."
							});
							return;
						}
						dispatch({
							type:actionConstants.FETCH_LIST_SUCCESS,
							list:data
						});
						return;
					case "add":
						dispatch({
							type:actionConstants.ADD_RUN_SUCCESS
						});
						getList();
						return;
					case "remove":
						dispatch({
							type:actionConstants.REMOVE_RUN_SUCCESS
						});
						getList();
						return;
					case "edit":
						dispatch({
							type:actionConstants.EDIT_RUN_SUCCESS
						});
						getList();
						return;
					case "register":
						const registerLoginData = await response.json();
						if(!registerLoginData) {
							dispatch({
								type:actionConstants.LOGIN_FAILED,
								error:"Register succesful but failed to login."
							});
							return;
						}
						dispatch({
							type:actionConstants.LOGIN_SUCCESS,
							token:registerLoginData.token,
							userId:registerLoginData.userId
						});
						console.dir(registerLoginData);
						return;
					case "login":
						const loginData = await response.json();
						if (!loginData) {
							dispatch({
								type:actionConstants.LOGIN_FAILED,
								error:"Failed to parse login information. Try again later"
							});
							return;
						}
						dispatch({
							type:actionConstants.LOGIN_SUCCESS,
							token:loginData.token,
							userId:loginData.userId
						});
						console.dir(loginData);
						return;
					case "logout":
						dispatch({
							type:actionConstants.LOGOUT_SUCCESS
						});
						return;
					default:
						return;
				}
			} else {
				if(response.status === 403) {
					dispatch({
						type:actionConstants.LOGOUT_FAILED,
						error:"Your session has expired. Logging you out."
					});
					return;
				}
				let errorMessage = " Server responded with a status "+response.status+" "+response.statusText;
				switch (urlRequest.action) {
					case "register":
						if (response.status === 409) {
							dispatch({
								type:actionConstants.REGISTER_FAILED,
								error:"Username already in use"
							});
							return;
						} else {
							dispatch({
								type:actionConstants.REGISTER_FAILED,
								error:"Register failed."+errorMessage
							});
							return;
						}
					case "login":
						dispatch({
								type:actionConstants.LOGIN_FAILED,
								error:"Login failed."+errorMessage
							});
							return;
					case "getlist":
						dispatch({
								type:actionConstants.FETCH_LIST_FAILED,
								error:"Failed to fetch the run information."+errorMessage
							});
							return;
					case "add":
						dispatch({
								type:actionConstants.ADD_RUN_FAILED,
								error:"Failed to add new run."+errorMessage
							});
							return;
					case "remove":
						dispatch({
								type:actionConstants.REMOVE_RUN_FAILED,
								error:"Failed to remove run."+errorMessage
							});
							return;
					case "edit":
						dispatch({
								type:actionConstants.EDIT_RUN_FAILED,
								error:"Failed to edit run."+errorMessage
							});
							return;
					case "logout":
						dispatch({
								type:actionConstants.LOGOUT_FAILED,
								error:"Server responded with an error. Logging you out."
							});
							return;
					default:
						return;
				}
			}
		}
		
		fetchData();
		
	}, [urlRequest]);

	//REST API
	const getList = (t,search) => {
		let tempToken = token;
		if(t) {
			tempToken = t;
		}
		let url = "/api/runs";

		setUrlRequest({
			url:url,
			request:{
				"method":"GET",
				"headers":{
					"token":tempToken
				}
			},
			action:"getlist"
		});
	}

	const add = (run) => {
		setUrlRequest({
			url:"/api/runs",
			request:{
				"method":"POST",
				"headers":{
					"Content-type":"application/json",
					"token":token
				},
				"body":JSON.stringify(run)
			},
			action:"add"
		});
	}
	
	const remove = (id) => {
		setUrlRequest({
			url:"/api/runs/"+id,
			request:{
				"method":"DELETE",
				"headers":{
					"token":token
				}
			},
			action:"remove"
		});
	}

	const edit = (run) => {
		setUrlRequest({
			url:"/api/runs/"+run._id,
			request:{
				"method":"PUT",
				"headers":{
					"Content-type":"application/json",
					"token":token
				},
				"body":JSON.stringify(run)
			},
			action:"edit"
		});
	}
	
	//REGISTER
	const register = (user) => {
		setUrlRequest({
			url:"/register",
			request:{
				"method":"POST",
				"headers":{
					"Content-type":"application/json"
				},
				"body":JSON.stringify(user)
			},
			action:"register"
		});
	}

	// LOGIN
	const login = (user) => {
		dispatch({
			type:actionConstants.SET_USERNAME,
			user:user.username
		});

		setUrlRequest({
			url:"/login",
			request:{
				"method":"POST",
				"headers":{
					"Content-type":"application/json"
				},
				"body":JSON.stringify(user)
			},
			action:"login"
		});
	}

	// LOGOUT
	const logout = () => {
		setUrlRequest({
			url:"/logout",
			request:{
				"method":"POST",
				"headers":{
					"token":token
				}
			},
			action:"logout"
		});
	}
	
	const setError = (error) => {
		dispatch({
			type:actionConstants.REGISTER_FAILED,
			error:error
		});
	}
	const clearError = (error) => {
		dispatch({
			type:actionConstants.REGISTER_FAILED,
			error:""
		});
	}

	return {add,remove,edit,register,login,logout,setError,clearError,getList}
}

export default useAction;