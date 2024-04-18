import mongoose from 'mongoose';

let Schema = mongoose.Schema({
    weaponName:String,
    weaponType:String,
    decay:Number,
    ammoBurn:Number 
});

export default mongoose.model("Weapons",Schema);