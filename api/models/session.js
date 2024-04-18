import mongoose from 'mongoose';

let Schema = mongoose.Schema({
	user:{type:String,index:true},
	ttl:Number,
	token:String
})

export default mongoose.model("Session",Schema);