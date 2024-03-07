import {connectToDB} from './utils';
import { User, Client, Supplier, Quotation, PurchaseOrder, JobOrder, Sale, Coc, Pl, Approve, ApprovePo } from "@/app/lib/models";

const mongoose = require('mongoose');


 
 let net;
let dns;

if (typeof window === 'undefined') {
  net = require('net');
  dns = require('dns'); 
}




export const fetchUsers = async (q, page) => {

    const regex = new RegExp(q, "i");
    const ITEM_PER_PAGE = 10;
    try {
         await connectToDB()
        const count = await User.find({ username: { $regex: regex } }).count();
        const users = await User.find({ username: { $regex: regex } }).limit(ITEM_PER_PAGE).skip(ITEM_PER_PAGE * (page - 1));
        return { count, users };
    } catch (err) {
        console.log(err);
        throw new Error('Failed to fetch Users!')
    }
  
  };
  

  export const fetchUser = async (id) => {
    try {
      await  connectToDB()
        const user = await User.findById(id)
        return user
  
    } catch (err) {
        console.log(err);
        throw new Error('Failed to fetch User!')
    }
  
  };

  export const fetchAllUsers = async () => {
    console.log("fetchAllUsers function called");
    try {
      await connectToDB();
      const users = await User.find({});
      return users;
    } catch (err) {
      console.log("Error in fetchAllUsers:", err);
      throw new Error('Failed to fetch users!');
    }
};


  
  
  export const fetchClients = async (q, page) => {
    const regex = new RegExp(q, "i");
    const ITEM_PER_PAGE = 10;
    try {
      await connectToDB()
        const count = await Client.find({ name: { $regex: regex } }).count();
        const clients = await Client.find({ name: { $regex: regex } }).limit(ITEM_PER_PAGE).skip(ITEM_PER_PAGE * (page - 1));
        return { count, clients };
    } catch (err) {
        console.log(err);
        throw new Error('Failed to fetch Clients!')
    }
  };

  export const fetchSales = async (q, page) => {
    const regex = new RegExp(q, "i");
    const ITEM_PER_PAGE = 10;
    try {
      await connectToDB()
        const count = await Sale.find({ name: { $regex: regex } }).count();
        const sales = await Sale.find({ name: { $regex: regex } }).limit(ITEM_PER_PAGE).skip(ITEM_PER_PAGE * (page - 1));
        return { count, sales };
    } catch (err) {
        console.log(err);
        throw new Error('Failed to fetch Sales!')
    }
  };

 


  export const fetchAllClients = async () => {
    console.log("fetchAllClients function called");
    try {
      await connectToDB();
      const clients = await Client.find({});
      return clients;
    } catch (err) {
      console.log("Error in fetchAllClients:", err);
      throw new Error('Failed to fetch Clients!');
    }
};


export const fetchAllSales = async () => {
  console.log("fetchAllSales function called");
  try {
    await connectToDB();
    const sales = await Sale.find({});
    return sales;
  } catch (err) {
    console.log("Error in fetchAllSales:", err);
    throw new Error('Failed to fetch Sales!');
  }
};


export const fetchAllSupliers = async () => {
  console.log("fetchAllSuppliers function called");
  try {
    await connectToDB();
    const suppliers = await Supplier.find({});
    return suppliers;
  } catch (err) {
    console.log("Error in fetchAllSuppliers:", err);
    throw new Error('Failed to fetch Suppliers!');
  }
};


  
  
  export const fetchClient = async (id) => {
    try {
      await  connectToDB()
        const client = await Client.findById(id)
        return client
    } catch (err) {
        console.log(err);
        throw new Error('Failed to fetch Client!')
    }
  
  };

  export const fetchSale = async (id) => {
    try {
      await  connectToDB()
        const sale = await Sale.findById(id)
        return sale
    } catch (err) {
        console.log(err);
        throw new Error('Failed to fetch Sale!')
    }
  
  };

  export const fetchAllQuotations = async () => {
    console.log("fetchAllQuotations function called");
    try {
      await connectToDB();
      const quotations = await Quotation.find({});
      return quotations;
    } catch (err) {
      console.log("Error in fetchAllQuotations:", err);
      throw new Error('Failed to fetch Quotations!');
    }
  };

  export const fetchAllPurchase = async () => {
    console.log("fetchAllPurchase function called");
    try {
      await connectToDB();
      const purchaseOrders = await PurchaseOrder.find({});
      return purchaseOrders;
    } catch (err) {
      console.log("Error in fetchAllPurchase:", err);
      throw new Error('Failed to fetch fetchAllPurchase!');
    }
  };

  export const fetchAllJobs = async () => {
    console.log("fetchAllJobs function called");
    try {
      await connectToDB();
      const jobOrders = await JobOrder.find({});
      return jobOrders;
    } catch (err) {
      console.log("Error in jobOrders:", err);
      throw new Error('Failed to fetch jobOrders!');
    }
  };
  
  
  export const fetchQuotations = async (projectName, page = 1) => {
    const ITEM_PER_PAGE = 10;
    let query = {};

    if (projectName) {
        query.projectName = { $regex: new RegExp(projectName, "i") };
    }
  
    try {
        await connectToDB();
        const count = await Quotation.countDocuments(query);
        const quotations = await Quotation.find(query)
            .populate('sale')
            .populate('client') 
            .populate({
              path: 'user',
              select: 'username'
            })
            .limit(ITEM_PER_PAGE)
            .skip((page - 1) * ITEM_PER_PAGE);

        console.log('Quotations after population:', quotations);

        return { count, quotations };
    } catch (err) {
        console.error('Error fetching quotations:', err);
        throw new Error('Failed to fetch quotations');
    }
};

export const fetchQuotation = async (id) => {
  try {
    await connectToDB();
    const quotation = await Quotation.findById(id).populate('client').populate('sale').populate({
      path: 'user',
      select: 'username'
    })
    console.log('Quotation data:', quotation); 
    return quotation;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to fetch Quotation!');
  }
};


  
export const fetchJobOrders = async (q, page) => {
  const regex = new RegExp(q, "i");
  const ITEM_PER_PAGE = 10;

  try {
    await connectToDB();
    const count = await JobOrder.find({ poNumber: { $regex: regex } }).count();
    const jobOrders = await JobOrder.find({ poNumber: { $regex: regex } })
      .populate('quotation')
      .populate('client')
      .limit(ITEM_PER_PAGE)
      .skip((page - 1) * ITEM_PER_PAGE);
    return { count, jobOrders }; // Fix the variable name here from `jobs` to `jobOrders`
  } catch (err) {
    console.log(err);
    throw new Error('Failed to fetch jobs!');
  }
};


export const fetchCocs = async (projectName, page = 1) => {
  const ITEM_PER_PAGE = 10;
  let query = {};

  if (projectName) {
      query.projectName = { $regex: new RegExp(projectName, "i") };
  }

  try {
      await connectToDB();
      const count = await Coc.countDocuments(query);
      const cocs = await Coc.find(query)
          .populate('jobOrder')
          .populate('sale')
          .populate('client')
          .populate('quotation')
          .populate({
            path: 'user',
            select: 'username'
          })    
          .limit(ITEM_PER_PAGE)
          .skip((page - 1) * ITEM_PER_PAGE);

      console.log('Cocs after population:', cocs);

      return { count, cocs }; // Return 'cocs' instead of 'Cocs'
  } catch (err) {
      console.error('Error fetching Cocs:', err);
      throw new Error('Failed to fetch cocs');
  }
};


export const fetchCoc = async (id) => {
  try {
    await connectToDB();
    const coc = await Coc.findById(id).populate('jobOrder')
    .populate('sale')
    .populate('client') 
    .populate('quotation')
    .populate({
      path: 'user',
      select: 'username'
    })    
    console.log('coc data:', coc);
    return coc;
  } catch (err) {
    console.error('Error fetching coc:', err);
    throw new Error(`Failed to fetch coc: ${err.message}`);
  }
};


export const fetchPls = async (projectName, page = 1) => {
  const ITEM_PER_PAGE = 10;
  let query = {};

  if (projectName) {
      query.projectName = { $regex: new RegExp(projectName, "i") };
  }

  try {
      await connectToDB();
      const count = await Pl.countDocuments(query);
      const pls = await Pl.find(query)
          .populate('jobOrder')
          .populate('sale')
          .populate('client')
          .populate('quotation')  
          .limit(ITEM_PER_PAGE)
          .skip((page - 1) * ITEM_PER_PAGE);

      console.log('pls after population:', pls);

      return { count, pls }; 
  } catch (err) {
      console.error('Error fetching Pls:', err);
      throw new Error('Failed to fetch pls');
  }
};


export const fetchPl = async (id) => {
  try {
    await connectToDB();
    const pl = await Pl.findById(id).populate('sale').populate('client').populate('jobOrder').populate('quotation')  
    console.log('pl data:', pl);
    return pl;
  } catch (err) {
    console.error('Error fetching pl:', err);
    throw new Error(`Failed to fetch pl: ${err.message}`);
  }
};



export const fetchSuppliersWithPurchaseOrders = async () => {
  try {
    await connectToDB();

    const suppliers = await fetchAllSupliers();

    const suppliersWithInfo = await Promise.all(suppliers.map(async (supplier) => {
      const purchaseOrders = await fetchPurchaseOrdersForSupplier(supplier._id);
      console.log('PurchaseOrders for suppliers', supplier.name, purchaseOrders);

    
      return {
        ...supplier.toObject(),
        _id: supplier._id.toString(),
        purchaseOrders,
      };
    }));

    return suppliersWithInfo;
  } catch (error) {
    console.error('Error fetching suppliers with purchaseOrders:', error);
    throw new Error('Failed to fetch suppliers with purchaseOrders');
  }
};
const fetchPurchaseOrdersForSupplier = async (supplierId) => {
  const purchaseOrders = await PurchaseOrder.find({ supplier: supplierId }).lean();
  return purchaseOrders.map(q => ({ ...q, _id: q._id.toString() }));
};



export const fetchClientsWithQuotationsAndPO = async () => {
  try {
    await connectToDB();

    const clients = await fetchAllClients();

    const clientsWithInfo = await Promise.all(clients.map(async (client) => {
      const quotations = await fetchQuotationsForClient(client._id);
      console.log('Quotations for client', client.name, quotations);

      const jobOrders = await fetchJobOrdersForClient(client._id);
    
      return {
        ...client.toObject(),
        _id: client._id.toString(),
        quotations,
        jobOrders, 
      };
    }));

    return clientsWithInfo;
  } catch (error) {
    console.error('Error fetching clients with quotations and job orders:', error);
    throw new Error('Failed to fetch clients with quotations and job orders');
  }
};

export const fetchQuotationsForClient = async (clientId) => {
  const quotations = await Quotation.find({ client: clientId }).lean();
  return quotations.map(q => ({ ...q, _id: q._id.toString() }));
};

const fetchJobOrdersForClient = async (clientId) => {
  const jobOrders = await JobOrder.find({ client: clientId })
    .populate('client') 
    .populate('quotation') 
    .lean();
  return jobOrders;
};




  export const fetchSuppliers = async (q, page) => {
    const regex = new RegExp(q, "i");
    const ITEM_PER_PAGE = 10;
  
    try {
      await connectToDB()
        const count = await Supplier.find({ name: { $regex: regex } }).count();
        const suppliers = await Supplier.find({ name: { $regex: regex } }).limit(ITEM_PER_PAGE).skip(ITEM_PER_PAGE * (page - 1));
        return { count, suppliers };
    } catch (err) {
        console.log(err);
        throw new Error('Failed to fetch Suppliers!')
    }
  };
  
  export const fetchSupplier = async (id) => {
    try {
      await connectToDB()
        const supplier = await Supplier.findById(id)
        return supplier
    } catch (err) {
        console.log(err);
        throw new Error('Failed to fetch Supplier!')
    }
  };


  
  export const fetchPurchaseOrders = async (supplierName, page = 1) => {
    const ITEMS_PER_PAGE = 10;
    let query = {};
    if (supplierName) {
      query['supplier.name'] = { $regex: new RegExp(supplierName, "i") };

    }
    console.log('Query:', query);
    try {
      await connectToDB();
      const count = await PurchaseOrder.countDocuments(query);
      const purchaseOrders = await PurchaseOrder.find(query)
        .populate('supplier')
        .populate('quotation')
        .populate('sale')
        .populate({
          path: 'user',
          select: 'username'
        })
        .limit(ITEMS_PER_PAGE)
        .skip((page - 1) * ITEMS_PER_PAGE);
        console.log('PurchaseOrders after population:', purchaseOrders);

  
  
      return { count, purchaseOrders };
    } catch (err) {
      console.error('Error fetching purchase orders:', err);
      throw new Error('Failed to fetch purchase orders');
    }
  };
  

  export const fetchPurchaseOrder = async (id) => {
    try {
      await connectToDB();
      const purchaseOrder = await PurchaseOrder.findById(id).populate('supplier').populate('quotation').populate('sale').populate({
        path: 'user',
        select: 'username'
      })
      console.log('PurchaseOrder data', purchaseOrder)
      return purchaseOrder;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to fetch Quotation!');
    }
  };

  export const fetchUserCount = async () => {
    console.log("fetchUserCount function called");
    try {
      await connectToDB();
      const count = await User.countDocuments(); 
      return count;
    } catch (err) {
      console.log("Error in fetchUserCount:", err);
      throw new Error('Failed to fetch user count!');
    }
  };
  
  export const fetchClientCount = async () => {
    console.log("fetchClientCount function called");
    try {
      await connectToDB();
      const count = await Client.countDocuments(); 
      return count;
    } catch (err) {
      console.log("Error in fetchClientCount:", err);
      throw new Error('Failed to fetch client count!');
    }
  };
  export const fetchSupplierCount = async () => {
    console.log("fetchSupplierCount function called");
    try {
      await connectToDB();
      const count = await Supplier.countDocuments(); 
      return count;
    } catch (err) {
      console.log("Error in fetchSupplierCount:", err);
      throw new Error('Failed to fetch supplier count!');
    }
  };
  






