import mongoose from 'mongoose';

let Schema = mongoose.Schema({
    ampName:String,
    ampType:String,
    decay:Number,
    ammoBurn:Number 
});

export default mongoose.model("WeaponAmps",Schema);