import express from 'express';
import runsModel from '../models/runs.js';

let router = express.Router();

router.get("/runs",function(req,res) {
	let query = {"user":req.session.user}

	runsModel.find(query).sort({startDate: 'asc'}).then(function(runs) {
		return res.status(200).json(runs);
	}).catch(function(err) {
		console.log(err);
		return res.status(500).json({"Message":"Internal server error"});
	})
})

router.post("/runs",function(req,res) {
	if(!req.body) {
		return res.status(400).json({"Message":"Bad Request"});
	}
	if(!req.body.logFile_hidden) {
		return res.status(400).json({"Message":"Bad Request"});
	}

	// Start and End date/time to parse the log
	let startDate = req.body.startDate.split('T').slice(0,2).join(' ')+":00";
	let endDate = req.body.endDate.split('T').slice(0,2).join(' ')+":00";

	// Variables for parsing info to
	let run_shots = 0;
	let run_hits = 0;
	let run_crits = 0;
	let run_misses = 0;
	let run_totalDMG = 0.0;
	let run_avgDMG = 0.0;
	let run_dmgTaken = 0.0;
	let run_hitPerc = 0.0;

	// Split the logfile to individual lines, and loop through them to parse
	let item = req.body.logFile_hidden.split("\n");

	for (let i = 0; i < item.length; i++) {
		let logLine = item[i];
		let logLineDate = logLine.split(' ').slice(0,2).join(' ');

		// Parse the log between given start and end dates/times
		if ((logLineDate >= startDate) && (logLineDate <= endDate)) {

			// Shot - Hit - normal
			if (logLine.split(' ').slice(4,6).join(' ') === "You inflicted") {
				run_shots += 1;
				run_hits += 1;
				run_totalDMG += parseFloat(logLine.split(' ').slice(6,7).join(' '));
			}

			// Shot - Hit - critical
			else if (logLine.split(' ').slice(4,9).join(' ') === "Critical hit - Additional damage!") {
				run_shots += 1;
				run_hits += 1;
				run_crits += 1;
				run_totalDMG += parseFloat(logLine.split(' ').slice(11,12).join(' '));
			}

			// Shot - Miss - normal
			else if (logLine.split(' ').slice(4,6).join(' ') === "You missed\r") {
				run_shots += 1;
				run_misses += 1;
			}

			// Shot - Miss - jammed
			else if (logLine.split(' ').slice(5,8).join(' ') === "target Jammed your") {
				run_shots += 1;
				run_misses += 1;
			}

			// Damage taken - normal
			else if (logLine.split(' ').slice(4,6).join(' ') === "You took") {
				run_dmgTaken += parseFloat(logLine.split(' ').slice(6,7).join(' '));
			}

			// Damage taken - critical
			else if (logLine.split(' ').slice(4,9).join(' ') === "Critical hit - Armor penetration!") {
				run_dmgTaken += parseFloat(logLine.split(' ').slice(11,12).join(' '));
			}
		}
    }

	// If no hunting data was found
	if (run_shots === 0) {
		return res.status(400).json({"Message":"No hunting data found for given timespan."});
	}

	// Do some maths to calculate stuff, more coming later
	run_avgDMG = run_totalDMG / run_shots;
	run_totalDMG = Math.floor(run_totalDMG);
	run_avgDMG = Math.floor(run_avgDMG);
	run_dmgTaken = Math.floor(run_dmgTaken);
	run_hitPerc = parseFloat((run_hits / run_shots) * 100).toFixed(2);

	let run = new runsModel({
		"startDate": startDate,
		"endDate": endDate,
		"user": req.session.user,
		"shots": run_shots,
		"hits": run_hits,
		"crits": run_crits,
		"misses": run_misses,
		"totalDMG": run_totalDMG,
		"avgDMG": run_avgDMG,
		"dmgTaken": run_dmgTaken,
		"hitPerc": run_hitPerc
	});

	run.save().then(function(run) {
		return res.status(201).json(run);
	}).catch(function(err) {
		console.log(err);
		return res.status(500).json({"Message":"Internal server error"});
	})
})

router.delete("/runs/:id",function(req,res) {
	runsModel.deleteOne({"_id":req.params.id,"user":req.session.user}).then(function(stats) {
		return res.status(200).json({"Message":"Success"});
	}).catch(function(err) {
		console.log(err);
		return res.status(500).json({"Message":"Internal server error"});
	})
})

// Editing Not in use at the moment - PLACEHOLDER
router.put("/runs/:id",function(req,res) {
	if(!req.body) {
		return res.status(400).json({"Message":"Bad Request"});
	}
	if(!req.body.type) {
		return res.status(400).json({"Message":"Bad Request"});
	}

	let run = new runsModel({
		"startDate": startDate,
		"endDate": endDate,
		"user": req.session.user,
		"shots": run_shots,
		"hits": run_hits,
		"crits": run_crits,
		"misses": run_misses,
		"totalDMG": run_totalDMG,
		"avgDMG": run_avgDMG,
		"dmgTaken": run_dmgTaken,
		"hitPerc": run_hitPerc
	});

	runsModel.replaceOne({"_id":req.params.id,"user":req.session.user},run).then(function(stats) {
		return res.status(200).json({"Message":"Success"});
	}).catch(function(err) {
		console.log(err);
		return res.status(500).json({"Message":"Internal server error"});
	})
})

export default router;
