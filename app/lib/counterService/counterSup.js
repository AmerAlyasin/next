import { CounterPl, CounterSup } from "../models";

async function incrementSupCounter(year) {
    const counter = await CounterSup.findOneAndUpdate(
      { year },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    return counter.count;
  }
  
  export default incrementSupCounter;

  