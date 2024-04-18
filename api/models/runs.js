import mongoose from 'mongoose';

let Schema = mongoose.Schema({
    user:String,
    timestamp: {type:Date, default:Date.now},
    startDate:Date,
    endDate:Date,
    shots:Number,
    hits:Number,
    crits:Number,
    misses:Number,
    totalDMG:Number,
    avgDMG:Number,
    dmgTaken:Number,
    hitPerc:Number  
});

export default mongoose.model("Runs",Schema);