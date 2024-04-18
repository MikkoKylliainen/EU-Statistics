import express from 'express';
import mongoose from 'mongoose';
import runsRoute from './routes/runsroute.js';
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import userModel from './models/user.js'
import sessionModel from './models/session.js'
import cors from 'cors'
import bodyParser from 'body-parser'

let app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors());

// MongoDB config
const mongo_url = process.env.MONGODB_URL;
const mongo_user = process.env.MONGODB_USER;
const mongo_password = process.env.MONGODB_PASSWORD;
const url = "mongodb+srv://"+mongo_user+":"+mongo_password+"@"+mongo_url+"/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(url).then(
	() => console.log("Connected to MongoDB"),
	(err) => console.log("Failed to connect to MongoDB. Reason",err)
);

// Helpers and Middleware
const time_to_live_diff = 3600000;

let createToken = () => {
	let token = crypto.randomBytes(64);
	return token.toString("hex");
}

let isUserLogged = (req,res,next) => {
	if (!req.headers.token) {
		return res.status(403).json({"Message":"Forbidden"});
	}

	sessionModel.findOne({"token":req.headers.token}).then(function(session) {
		if (!session) {
			return res.status(403).json({"Message":"Forbidden"});
		}

		let now = Date.now();
		if (now > session.ttl) {
			sessionModel.deleteOne({"_id":session._id}).then(function() {
				return res.status(403).json({"Message":"Forbidden"});
			}).catch(function(err) {
				console.log(err);
				return res.status(403).json({"Message":"Forbidden"});
			})
		} else {
			session.ttl = now + time_to_live_diff;
			req.session = {};
			req.session.user = session.user;
			req.session.userID = session.userId;		
			session.save().then(function() {
				return next();
			}).catch(function(err) {
				console.log(err);
				return next();
			})
		}
	}).catch(function(err) {
		console.log(err);
		return res.status(403).json({"Message":"Forbidden"});
	});
}

// ----- LOGIN API
// Register request
app.post("/register",function(req,res) {
	if (!req.body) {
		return res.status(400).json({"Message":"Bad Request"});
	}
	if (!req.body.username || !req.body.password) {
		return res.status(400).json({"Message":"Bad Request"});
	}
	if (req.body.username.length < 4 || req.body.password.length < 8) {
		return res.status(400).json({"Message":"Bad Request"});
	}
	bcrypt.hash(req.body.password,14,function(err,hash) {
		if (err) {
			console.log(err);
			return res.status(500).json({"Message":"Internal server error"});
		}

		let user = new userModel({
			username:req.body.username,
			password:hash
		});

		user.save().then(function() {
			let token = createToken();
			let now = Date.now();

			let session = new sessionModel({
				"user":req.body.username,
				"ttl":now+time_to_live_diff,
				"token":token
			});

			session.save().then(function() {
				return res.status(200).json({"token":token});
			}).catch(function(err) {
				console.log(err);
				return res.status(500).json({"Message":"Register successful but failed to log in."});
			})

		}).catch(function(err) {
			if (err.code === 11000) {
				return res.status(409).json({"Message":"Username already in use"});
			}
			console.log(err);
			return res.status(500).json({"Message":"Internal server error"});
		});
	});
});

// Login request
app.post("/login",function(req,res) {
	if (!req.body) {
		return res.status(400).json({"Message":"Bad Request"});
	}
	if (!req.body.username || !req.body.password) {
		return res.status(400).json({"Message":"Bad Request"});
	}
	if (req.body.username.length < 4 || req.body.password.length < 8) {
		return res.status(400).json({"Message":"Bad Request"});
	}

	// Get user
	userModel.findOne({"username":req.body.username}).then(function(user) {
		if (!user) {
			return res.status(401).json({"Message":"Unauthorized"});
		}
		
		bcrypt.compare(req.body.password,user.password,function(err,success) {
			if (err) {
				console.log(err);
				return res.status(500).json({"Message":"Internal server error"});
			}
			if (!success) {
				return res.status(401).json({"Message":"Unauthorized"});
			}

			let token = createToken();
			let now = Date.now();

			let session = new sessionModel({
				"user":req.body.username,
				"ttl":now+time_to_live_diff,
				"token":token
			});

			session.save().then(function() {
				return res.status(200).json({"token":token});
			}).catch(function(err) {
				console.log(err);
				return res.status(500).json({"Message":"Internal server error"});
			});
		})
	}).catch(function(err) {
		console.log(err);
		return res.status(500).json({"Message":"Internal server error"});
	});
});

// Logout request
app.post("/logout",function(req,res) {
	if (!req.headers.token) {
		return res.status(404).json({"Message":"Not found"});
	}
	sessionModel.deleteOne({"token":req.headers.token}).then(function() {
		return res.status(200).json({"Message":"Logged out"});
	}).catch(function(err) {
		console.log(err);
		return res.status(500).json({"Message":"Internal server error"});
	});
});

let APIport = 3000;
app.use("/api",isUserLogged,runsRoute);
app.listen(APIport);
console.log("Running in port " + APIport);