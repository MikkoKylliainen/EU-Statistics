import moment from 'moment';

const Row = (props) => {

	// Parse the original timestamps using Moment.js
	const startDate = moment(props.run.startDate).format('YYYY-MM-DD HH:mm');
	const endDate = moment(props.run.endtDate).format('YYYY-MM-DD HH:mm');

	return (
		<tr>
			<td>{startDate}</td>
			<td>{endDate}</td>			
			<td>{props.run.shots}</td>		
			<td>{props.run.hits}</td>
			<td>{props.run.hitPerc}</td>
			<td>{props.run.crits}</td>
			<td>{props.run.misses}</td>
			<td>{props.run.totalDMG}</td>
			<td>{props.run.avgDMG}</td>
			<td>{props.run.dmgTaken}</td>

			<td> 
				<div className="buttonContainer">
					<button className="btn btn-danger removeButton" onClick={() => props.changeMode("remove",props.index)}>Remove</button>
				</div>
			</td>
		</tr>
	);
}

export default Row;