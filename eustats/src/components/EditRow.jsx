import {useState} from 'react';

const EditRow = (props) => {
	const [state,setState] = useState({
		"shots":props.run.shots,
		"hits":props.run.hits,
		"hitPerc":props.run.hitPerc,
		"crits":props.run.crits,
		"misses":props.run.misses,
		"totalDMG":props.run.totalDMG,
		"avgDMG":props.run.avgDMG,	
		"dmgTaken":props.run.dmgTaken	
	});

	const onChange = (event) => {
		setState((state) => {
			return {
				...state,
				[event.target.name]:event.target.value
			}
		});
	}
	
	const editItem = () => {
		let item = {
			...state,
			_id:props.item._id
		}
		props.editItem(item);
	}
	
	return(
		<tr>
			<td><input type="number"
				name="shots"
				id="shots"
				className="form-control"
				onChange={onChange}
				value={state.shots}/></td>
			<td><input type="number"
				name="hits"
				id="hits"
				className="form-control"
				onChange={onChange}
				value={state.hits}/></td>
			<td><input type="number"
				name="crits"
				id="crits"
				className="form-control"
				onChange={onChange}
				value={state.crits}/></td>					
			<td><button className="btn btn-success"
				onClick={editItem}>Save</button></td>
			<td><button className="btn btn-danger"
				onClick={() => props.changeMode("cancel",0)}>Cancel</button></td>
		</tr>
	);
}

export default EditRow;