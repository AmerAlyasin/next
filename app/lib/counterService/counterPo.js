import { CounterPo } from "../models";

async function incrementPoCounter(year) {
    const counter = await CounterPo.findOneAndUpdate(
      { year },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    return counter.count;
  }
  
  export default incrementPoCounter;

  