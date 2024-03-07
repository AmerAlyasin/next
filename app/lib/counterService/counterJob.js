import {CounterJob } from "../models";

async function incrementJobounter(year) {
    const counter = await CounterJob.findOneAndUpdate(
      { year },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    return counter.count;
  }
  
  export default incrementJobounter;

  