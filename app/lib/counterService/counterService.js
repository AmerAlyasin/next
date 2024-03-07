import { Counter } from "../models";

async function incrementCounter(year) {
    const counter = await Counter.findOneAndUpdate(
      { year },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    return counter.count;
  }
  
  export default incrementCounter;

  