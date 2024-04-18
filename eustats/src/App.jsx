import useAction from './hooks/useAction'	
import useAppState from './hooks/useAppState';
import {useEffect} from 'react';
import RunsForm from './components/RunsForm';
import RunsList from './components/RunsList';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import {Routes,Route,Navigate} from 'react-router-dom';
import Parser from 'html-react-parser';
import './App.css';

function App() {
	const {getList} = useAction();
	const {loading,isLogged,error} = useAppState();

	useEffect(() => {
		if(isLogged) {
			getList();
		}
	},[isLogged]);

	let message = <></>
	if(loading) {
		message = <h4>Loading ...</h4>
	}
	if(error) {
		message = <h4>{Parser(error)}</h4>
	}
	if(isLogged) {
		return (
			<>
				<Navbar />
				<div className="messageModal">
					{message}
				</div>
				<Routes>
					<Route path="/" element={<RunsList />}/>
					<Route path="/form" element={<RunsForm />}/>
					<Route path="*" element={<Navigate to="/"/>}/>
				</Routes>
			</>
		);
	} else {
		return (
			<>
				<Navbar />
				<div className="messageModal">
					{message}
				</div>
				<Routes>
					<Route path="/" element={<LoginPage />}/>
					<Route path="/signup" element={<RegisterPage />}/>
					<Route path="*" element={<Navigate to="/"/>}/>
				</Routes>
				<div className="floatingLogoImg"></div>
			</>
		);
	}
}

export default App
