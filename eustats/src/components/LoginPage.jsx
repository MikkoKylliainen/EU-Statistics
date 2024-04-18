import {useState} from 'react';
import useAction from '../hooks/useAction';
import { NavLink } from "react-router-dom";
import './LoginPage.css';

const LoginPage = () => {
	const [state,setState] = useState({
		username:"",
		password:""
	});
	
	const {login,register,setError,clearError} = useAction();
	
	const onChange = (event) => {
		setState((state) => {
			return {
				...state,
				[event.target.name]:event.target.value
			}
		});
	}
	
	const clearErrModal = () => {
		clearError();
    }

	const onSubmit = (event) => {
		event.preventDefault();
		if ((state.username === "c@") && (state.password === "c@")) {
			setError('<iframe src="https://cail.fi" scrolling="no" className="catWarning"></iframe>');
			return;
		}
		if (state.username.length < 4 || state.password.length < 8) {
			setError("Username must be atleast 4 and password 8 characters long.");
			return;
		}

		let user = {
			...state
		}

		if (event.target.name === "register") {
			register(user);
		} else {
			login(user);
		}
	}
	return(
		<><form>
			<h3>Login</h3>

			<label htmlFor="username">Username</label>
			<input
				type="text"
				placeholder="Username"
				id="username"
				name="username"
				onChange={onChange}
				value={state.username} />

			<label htmlFor="password">Password</label>
			<input
				type="password"
				placeholder="Password"
				name="password"
				id="password"
				onChange={onChange}
				value={state.password} />

			<button name="login" onClick={onSubmit}>Log In</button>
			<div className="social">
				<div className="go"><i className="fab fa-google"></i>  Google</div>
				<div className="fb"><i className="fab fa-facebook"></i>  Facebook</div>
			</div>
			<div className="registerField">Don't have an account? <NavLink to="/signup" name="register" className="registerLink">Sign up</NavLink></div>
		</form>

		<a onClick={clearErrModal} type="button" className="disclaimer">Disclaimer</a>
		</>
	);
}

export default LoginPage;