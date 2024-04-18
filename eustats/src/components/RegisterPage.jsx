import {useState} from 'react';
import useAction from '../hooks/useAction';
import './RegisterPage.css';

const RegisterPage = () => {
	const [state,setState] = useState({
		username:"",
		password:"",
		society:""
	});
	
	const {register,setError,clearError} = useAction();
	
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
		if (state.username.length < 4 || state.password.length < 8) {
			setError("Username must be atleast 4 and password 8 characters long.");
			return;
		}
		let user = {
			...state
		}
		if (event.target.name === "register") {
			register(user);
		}
	}

	return (
		<><form>
			<h3>Sign up</h3>

			<label htmlFor="username">Username *</label>
			<input
				type="text"
				placeholder="Username"
				id="username"
				name="username"
				onChange={onChange}
				value={state.username} />

			<label htmlFor="password">Password *</label>
			<input
				type="password"
				placeholder="Password"
				name="password"
				id="password"
				onChange={onChange}
				value={state.password} />

			<label htmlFor="society">Society name</label>
			<input
				type="society"
				placeholder="society"
				name="society"
				id="society"
				onChange={onChange}
				value={state.society} />

			<button name="register" onClick={onSubmit}>Sign up</button>
		</form>
		<a onClick={clearErrModal} type="button" className="disclaimer">Disclaimer</a>
		</>
	);
}

export default RegisterPage;