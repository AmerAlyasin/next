import { CounterPl } from "../models";

async function incrementPlCounter(year) {
    const counter = await CounterPl.findOneAndUpdate(
      { year },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    return counter.count;
  }
  
  export default incrementPlCounter;

  