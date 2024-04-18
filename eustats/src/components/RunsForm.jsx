import {useState} from 'react';
import useAction from '../hooks/useAction';
import './RunsForm.css';

const RunsForm = () => {
	let currentDate = new Date();

	const [state,setState] = useState({
		userId:"",
		logFile:"",
		logFile_hidden:"",
		startDate:currentDate.toISOString().split('T')[0]+"T00:00",
		endDate:currentDate.toISOString().split('T')[0]+"T23:59"
	});
	
	const {add} = useAction();
	
	const onChange = (event) => {
		var logFileHidden = "";

		var logFile = document.getElementById("logFile").files[0];
		if (logFile) {
			let reader = new FileReader();
			reader.readAsText(logFile, "UTF-8");
			reader.onload = function (evt) {
				setState((state) => {
					return {
						...state,
						"logFile_hidden":evt.target.result,
						[event.target.name]:event.target.value
					}
				});
			}
			reader.onerror = function (evt) {
				console.log("Error reading file.");
			}
		}

		setState((state) => {
			return {
				...state,
				"logFile_hidden":logFileHidden,
				[event.target.name]:event.target.value
			}
		});
	}
	
	const onSubmit = (event) => {
		event.preventDefault();

		let item = {
			...state
		}

		add(item);
		setState({
			logFile:"",
			logFile_hidden:"",
			startDate:currentDate.toISOString().split('T')[0]+"T00:00",
			endDate:currentDate.toISOString().split('T')[0]+"T23:59"
		});
	}
	
	return(
		<form onSubmit={onSubmit}>
			<h3>Add run</h3>

			<label htmlFor="logFile">Logfile</label>
			<input type="file"
				name="logFile"
				id="logFile"
				className="form-control"
				onChange={onChange}
				value={state.logFile}/>

			<input type="hidden"
				name="logFile_hidden"
				id="logFile_hidden"
				onChange={onChange}
				value={state.logFile_hidden}/>		

			<label className="form-label" htmlFor="startDate">Start Time</label>
			<input type="datetime-local"
				name="startDate"
				id="startDate"
				className="form-control"
				onChange={onChange}
				value={state.startDate}/>

			<label className="form-label" htmlFor="endDate">End Time</label>
			<input type="datetime-local"
				name="endDate"
				id="endDate"
				className="form-control"
				onChange={onChange}
				value={state.endDate}/>

			<button name="Add" onClick={onSubmit}>Add</button>
		</form>	
	);
}

export default RunsForm;