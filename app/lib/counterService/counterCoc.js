import { CounterCoc } from "../models";

async function incrementcOCCounter(year) {
    const counter = await CounterCoc.findOneAndUpdate(
      { year },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    return counter.count;
  }
  
  export default incrementcOCCounter;

  