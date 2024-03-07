import mongoose from "mongoose";

const {Schema} =mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);




const clientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
      min: 3,
      max: 20,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    contactName: {
      type: String,
      required: true,
    },
    contactMobile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,

    },
  },
  { timestamps: true }
);

const salesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
      min: 3,
      max: 20,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    contactName: {
      type: String,
      required: true,
    },
    contactMobile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,

    },
  },
  { timestamps: true }
);

const supplierSchema = new Schema(
  {
    supplierId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      unique: false,
      min: 3,
      max: 20,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    contactName: {
      type: String,
      required: true,
    },
    contactMobile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);


const quotationSchema = new Schema(
  {

    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false 
    },

    quotationId: {
      type: String,
      required: true
    },
    revisionNumber: {
      type: Number,
      default: 0
    },
    sale: {
      type: Schema.Types.ObjectId,
      ref: 'Sale',
      required: true
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    },

    projectName: {
      type: String,
      required: true,
      unique: false,
    },
    projectLA: {
      type: String,
      required: true,
    },
     products:  [
      {
        productCode: {
          type: String,
          required: true,
        },
        unitPrice: {
          type: Number,
          required: true,
        },
        unit: {
          type: Number,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
    paymentTerm: {
      type: String,
      required: true,
    },
    paymentDelivery: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
    excluding: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);





const purchaseOrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false 
    },

    purchaseId: {
      type: String,
      required: true
    },
    revisionNumber: {
      type: Number,
      default: 0
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true
    
    },
   quotation: {
    type: Schema.Types.ObjectId,
    ref: 'Quotation',
    required:true,
   },
   sale: {
    type: Schema.Types.ObjectId,
    ref: 'Sale',
    required:true,
   },
   deliveryLocation: {
    type: String,
    required: true,
  },

    products:  [
      {
        productCode: {
          type: String,
          required: true,
        },
        unitPrice: {
          type: Number,
          required: true,
        },
        unit: {
          type: Number,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
    paymentTerm: {
      type: String,
      required: true,
    },
    paymentDelivery: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);




const cocSchema = new Schema(
  {

    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false 
    },
    cocId: {
      type: String,
      required: true
    },
    revisionNumber: {
      type: Number,
      default: 0
    },
    jobOrder:{
      type: Schema.Types.ObjectId,
      ref: 'JobOrder',
      required: true
    },
    sale: {
      type: Schema.Types.ObjectId,
      ref: 'Sale',
      required:true,
     },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    },
    quotation: {
      type: Schema.Types.ObjectId,
      ref: 'Quotation', 
      required: true,
    },
    deliveryLocation: {
      type: String,
      required: true
    },
    products:  [
      {
        productCode: {
          type: String,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);


const plSchema = new Schema(
  {
    pickListId: {
      type: String,
      required: true
    },
    revisionNumber: {
      type: Number,
      default: 0
    },
    jobOrder:{
      type: Schema.Types.ObjectId,
      ref: 'JobOrder',
      required: true
    },
    sale: {
      type: Schema.Types.ObjectId,
      ref: 'Sale',
      required:true,
     },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    },
    quotation: {
      type: Schema.Types.ObjectId,
      ref: 'Quotation', 
      required: true,
    },
    deliveryLocation: {
      type: String,
      required: true
    },
    products:  [
      {
        productCode: {
          type: String,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);



const jobOrderSchema = new Schema({

  jobOrderId: {
    type: String,
    required: true
  },

  poNumber:{
    type:String,
    required:true
  },

  poDate:{
    type:String,
    required:true,
  },

  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client', 
    required: true,
  },
  quotation: {
    type: Schema.Types.ObjectId,
    ref: 'Quotation', 
    required: true,
  },
}, { timestamps: true })





const counterSchema = new Schema({
  year: {
    type: Number,
    required: true,
    unique: true
  },
  count: {
    type: Number,
    required: true,
    default: 0
  }
});

const counterPoSchema = new Schema({
  year: {
    type: Number,
    required: true,
    unique: true
  },
  count: {
    type: Number,
    required: true,
    default: 0
  }
});

const counterSupSchema = new Schema({
  year: {
    type: Number,
    required: true,
    unique: true
  },
  count: {
    type: Number,
    required: true,
    default: 0
  }
});

const counterJobSchema = new Schema({
  year: {
    type: Number,
    required: true,
    unique: true
  },
  count: {
    type: Number,
    required: true,
    default: 0
  }
});

const counterPlSchema = new Schema({
  year: {
    type: Number,
    required: true,
    unique: true
  },
  count: {
    type: Number,
    required: true,
    default: 0
  }
});
const counterCocSchema = new Schema({
  year: {
    type: Number,
    required: true,
    unique: true
  },
  count: {
    type: Number,
    required: true,
    default: 0
  }
});







export const Counter = mongoose.models.Counter || mongoose.model("Counter", counterSchema);
export const CounterPo = mongoose.models.CounterPo || mongoose.model("CounterPo", counterPoSchema);
export const CounterSup = mongoose.models.CounterSup || mongoose.model("CounterSup", counterSupSchema);
export const CounterJob = mongoose.models.CounterJob || mongoose.model("CounterJob", counterJobSchema);
export const CounterPl = mongoose.models.CounterPl || mongoose.model("CounterPl", counterPlSchema);
export const CounterCoc = mongoose.models.CounterCoc || mongoose.model("CounterCoc", counterCocSchema);
export const Coc = mongoose.models.Coc || mongoose.model("Coc", cocSchema);
export const Pl = mongoose.models.Pl || mongoose.model("Pl", plSchema);
export const Sale = mongoose.models.Sale || mongoose.model("Sale", salesSchema);
export const PurchaseOrder = mongoose.models.PurchaseOrder || mongoose.model("PurchaseOrder", purchaseOrderSchema);
export const JobOrder = mongoose.models.JobOrder || mongoose.model("JobOrder", jobOrderSchema);
export const Quotation = mongoose.models.Quotation || mongoose.model("Quotation", quotationSchema);
export const Supplier = mongoose.models.Supplier || mongoose.model("Supplier", supplierSchema);
export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const Client = mongoose.models.Client || mongoose.model("Client", clientSchema);



