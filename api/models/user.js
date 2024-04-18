import mongoose from 'mongoose';

let Schema = mongoose.Schema({
	user:String,
	username:{type:String,unique:true,index:true},
	password:String,
	society:String
})

export default mongoose.model("User",Schema);