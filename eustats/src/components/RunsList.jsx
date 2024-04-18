import {useState} from 'react';
import Row from './Row';
import RemoveRow from './RemoveRow';
import EditRow from './EditRow';
import useAction from '../hooks/useAction';
import useAppState from '../hooks/useAppState';

import './RunsList.css';

const RunsList = () => {
	const [state,setState] = useState({
		removeIndex:-1,
		editIndex:-1
	});
	
	const {list} = useAppState();
	const {remove,edit,getList} = useAction();

	const changeMode = (mode,index) => {
		if (mode === "remove") {
			setState({
				removeIndex:index,
				editIndex:-1
			});
		}
		if (mode === "edit") {
			setState({
				removeIndex:-1,
				editIndex:index
			});
		}
		if (mode === "cancel") {
			setState({
				removeIndex:-1,
				editIndex:-1
			});
		}
	}
	
	const removeRun = (id) => {
		remove(id);
		changeMode("cancel");
	}

	const editRun = (run) => {
		edit(run);
		changeMode("cancel");
	}

	let runs = list.map((run,index) => {
		if (index === state.removeIndex) {
			return (
				<RemoveRow key={run._id} run={run} changeMode={changeMode} removeRun={removeRun}/>
			);
		}
		if (index === state.editIndex) {
			return (
				<EditRow key={run._id} run={run} changeMode={changeMode} editRun={editRun}/>
			);
		}
		return (
			<Row key={run._id} run={run} changeMode={changeMode} index={index}/>
		);
	})

	return(
	<div>
		<table className="table table-striped runsTable">
			<thead>
				<tr>
					<th>Sart Date</th>
					<th>End Date</th>
					<th>Shots</th>
					<th>Hits</th>
					<th>Hit%</th>
					<th>Crits</th>
					<th>Misses</th>
					<th>Total DMG</th>
					<th>Avg. DMG</th>
					<th>DMG Taken</th>
                    <th></th>
				</tr>
			</thead>
			<tbody>
				{runs}
			</tbody>
		</table>
	</div>
	);
}

export default RunsList;