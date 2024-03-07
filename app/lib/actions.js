"use server";
import { revalidatePath } from "next/cache";
import { connectToDB } from "./utils";
import { redirect } from "next/navigation";
import bcrypt from 'bcrypt';
import { signIn } from "../auth";
import incrementCounter from "./counterService/counterService";
import incrementPoCounter from "./counterService/counterPo";
import incrementPlCounter from "./counterService/counterPl";
import incrementcOCCounter from "./counterService/counterCoc";
import incrementSupCounter from "./counterService/counterSup";
import incrementJobounter from "./counterService/counterJob";


const { User, Client, Supplier, PurchaseOrder, Quotation, JobOrder, Sale, Coc, Pl, Approve, ApprovePo } = require('@/app/lib/models')



export const addUser = async (formData) => {
  const { username, email, password, phone, address, isAdmin, isActive } = Object.fromEntries(formData);

  try {
     connectToDB();

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    const newUser = new User({
      username,
      email,
      password: hashPassword,
      phone,
      address,
      isAdmin,
      isActive
    });

    await newUser.save();
  } catch (err) {
    console.log(err)
    throw new Error('failed to add user!')
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
};


export const updateUser = async (formData) => {
  const { id, username, email, password, phone, address, isAdmin, isActive } =
    Object.fromEntries(formData);

  try {
    connectToDB();

    const updateFields = {
      username,
      email,
      phone,
      address,
      isAdmin,
      isActive,
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashPassword;
    }

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || updateFields[key] === undefined) && delete updateFields[key]
    );

    await User.findByIdAndUpdate(id, updateFields);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update user!");
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
};


export const deleteUser = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
     connectToDB();        
    await User.findByIdAndDelete(id)

  } catch (err) {
    console.log(err)
    throw new Error('failed to delete user!')
  }

  revalidatePath("/dashboard/users");
};




export const addClient = async (formData) => {
  const { name, phone, contactName, contactMobile, email, address } = Object.fromEntries(formData);

  try {
      connectToDB();

    const newClient = new Client({
      name,
      phone,
      contactName,
      contactMobile,
      email,
      address
    });

    await newClient.save();
  } catch (err) {
    console.log(err)
    throw new Error('failed to add client!')
  }

  revalidatePath("/dashboard/clients");
  redirect("/dashboard/clients");
};


export const updateClient = async (formData) => {
  const { id, name, phone, contactName, contactMobile, email, address } =
    Object.fromEntries(formData);
    const idAsString = id.toString()

  try {
    connectToDB();

    const updateFields = {
      name,
      phone,
      contactName,
      contactMobile,
      email,
      address
    };

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || undefined) && delete updateFields[key]
    );

    await Client.findByIdAndUpdate(idAsString, updateFields);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update client!");
  }

  revalidatePath("/dashboard/clients");
  redirect("/dashboard/clients");
};



export const deleteClient = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
     connectToDB();        
    await Client.findByIdAndDelete(id)

  } catch (err) {
    console.log(err)
    throw new Error('failed to delete client!')
  }

  revalidatePath("/dashboard/clients");
};

export const addSale = async (formData) => {
  const { name, phone, contactName, contactMobile, email, address } = Object.fromEntries(formData);

  try {
      connectToDB();

    const newSale = new Sale({
      name,
      phone,
      contactName,
      contactMobile,
      email,
      address
    });

    await newSale.save();
  } catch (err) {
    console.log(err)
    throw new Error('failed to add sales!')
  }

  revalidatePath("/dashboard/sales");
  redirect("/dashboard/sales");
};

export const updateSale = async (formData) => {
  const { id, name, phone, contactName, contactMobile, email, address } =
    Object.fromEntries(formData);
    const idAsString = id.toString()

  try {
    connectToDB();

    const updateFields = {
      name,
      phone,
      contactName,
      contactMobile,
      email,
      address
    };

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || undefined) && delete updateFields[key]
    );

    await Sale.findByIdAndUpdate(idAsString, updateFields);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update sale!");
  }

  revalidatePath("/dashboard/sales");
  redirect("/dashboard/sales");
};


export const deleteSale = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
     connectToDB();        
    await Client.findByIdAndDelete(id)

  } catch (err) {
    console.log(err)
    throw new Error('failed to delete sale!')
  }

  revalidatePath("/dashboard/sales");
};







export const addJobOrder = async (formData) => {
  const { poNumber, poDate, clientId, quotationId } = formData;

  try {
    await connectToDB();

    const client = await Client.findById(clientId).lean();
    console.log('Client:', client);
    
    if (!client) {
      console.error('Client not found with ID:', clientId);
      throw new Error('Client not found');
    }
    
    const quotation = await Quotation.findById(quotationId).lean();
    console.log('Quotation:', quotation);
    
    // Log for troubleshooting
    console.log(`Quotation client ID: ${quotation.client.toString()}, Provided client ID: ${client._id.toString()}`);

    if (!quotation || quotation.client.toString() !== client._id.toString()) {
      console.error('Quotation not found or does not belong to the client');
      throw new Error('Quotation not found or does not belong to the client');
    }
   

    const year = new Date().getFullYear();
    const count = await incrementJobounter(year);
    const customJobOrderId = `SVSJO-${year}-${count}`;


    const jobOrder = new JobOrder({
      jobOrderId:customJobOrderId ,
      poNumber,
      poDate, 
      client: client._id, 
      quotation: quotation._id,
    });

    await jobOrder.save();

    const populatedJobOrder = await JobOrder.findById(jobOrder._id).populate('quotation').lean();

    return populatedJobOrder;
  } catch (error) {
    console.error('Error creating job order:', error);
    throw error; // Throw the error to catch it where the function is called
  
  } finally {
    revalidatePath("/dashboard/jobOrder");
    redirect("/dashboard/jobOrder");
  }
};

export const deleteJobOrder = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
     connectToDB();        
    await JobOrder.findByIdAndDelete(id)

  } catch (err) {
    console.log(err)
    throw new Error('failed to delete job!')
  }

  revalidatePath("/dashboard/jobOrder");
};



export const addSupplier = async (formData) => {
  const { name, phone, contactName, contactMobile, email, address } = Object.fromEntries(formData);

  try {
      connectToDB();

    const year = new Date().getFullYear();
    const count = await incrementSupCounter(year);
    const startingNumber = 2000;
    const paddedCount = String(startingNumber + count).padStart(4, '0');
    const customSupplierId = `${year}-${paddedCount}`;



    const newSupplier = new Supplier({
      name,
      phone,
      contactName,
      contactMobile,
      email,
      address,
      supplierId:customSupplierId,

    });

    await newSupplier.save();
  } catch (err) {
    console.log(err)
    throw new Error('failed to add supplier!')
  }

  revalidatePath("/dashboard/suppliers");
  redirect("/dashboard/suppliers");
};

export const deleteSupplier = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
     connectToDB();        
    await Supplier.findByIdAndDelete(id)

  } catch (err) {
    console.log(err)
    throw new Error('failed to delete supplier!')
  }

  revalidatePath("/dashboard/suppliers");
};


export const updateSupplier = async (formData) => {
  const { id, name, phone, contactName, contactMobile, email, address } =
    Object.fromEntries(formData);

  try {
     connectToDB();

    const updateFields = {
      name,
      phone,
      contactName,
      contactMobile,
      email,
      address
    };

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || undefined) && delete updateFields[key]
    );


    await Supplier.findByIdAndUpdate(id, updateFields);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update supplier!");
  }

  revalidatePath("/dashboard/suppliers");
  redirect("/dashboard/suppliers");
};


export const addApprove = async (formData) => {
  const { userId, quotationId, clientId, saleId} = formData;

  try {
    await connectToDB();

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const quotation = await Quotation.findById(quotationId);
    if (!quotation) {
      throw new Error('Quotation not found');
    }
    const client = await Client.findById(clientId);
    if (!client) {
      throw new Error('client not found');
    }
    const sale = await Sale.findById(saleId);
    if (!sale) {
      throw new Error('Sale not found');
    }
   


    const newApprove = new Approve({
      quotation: quotation._id,
      user: user._id,
      client: client._id,
      sale: sale._id,
    });

    const savedApprove = await newApprove.save();
    console.log('Approve added successfully:', savedApprove);

    return savedApprove;
  } catch (err) {
    console.error("Error adding approve:", err.message);
    throw new Error('Failed to add Approve!');
  } finally {
    revalidatePath("/dashboard/approves"); 
    redirect("/dashboard/approves");
  }
};

export const addPoApprove = async (formData) => {
  const { userId,purchaseId, quotationId, supplierId, saleId} = formData;

  try {
    await connectToDB();

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const quotation = await Quotation.findById(quotationId);
    if (!quotation) {
      throw new Error('Quotation not found');
    }
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      throw new Error('supplier not found');
    }
    const sale = await Sale.findById(saleId);
    if (!sale) {
      throw new Error('Sale not found');
    }
    const purchaseOrder = await PurchaseOrder.findById(purchaseId);
    if (!purchaseOrder) {
      throw new Error('Purchase not found');
    }
   
   


    const newPoApprove = new ApprovePo({
      quotation: quotation._id,
      purchaseOrder: purchaseOrder._id,
      user: user._id,
      supplier: supplier._id,
      sale: sale._id,
    });

    const savedPoApprove = await newPoApprove.save();
    console.log('Approve added successfully:', savedPoApprove);

    return savedPoApprove;
  } catch (err) {
    console.error("Error adding approve:", err.message);
    throw new Error('Failed to add Approve!');
  } finally {
    revalidatePath("/dashboard/approvePo"); 
    redirect("/dashboard/approvePo");
  }
};

export const addQuotation = async (formData) => {
  const { saleId, clientId,  projectName, projectLA, products, paymentTerm, paymentDelivery, note, excluding } = formData;

  try {
    await connectToDB();

    const sale = await Sale.findById(saleId);
    if (!sale) {
      throw new Error('Sale not found');
    }

    const client = await Client.findById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }
   

    const year = new Date().getFullYear();
    const count = await incrementCounter(year);
    const customQuotationId = `SVSQ-${year}-${count}`;

    const newQuotation = new Quotation({
      client: client._id,
      sale: sale._id,
      projectName,
      projectLA,
      products,
      paymentTerm,
      paymentDelivery,
      note,
      excluding,
      quotationId: customQuotationId, 
      revisionNumber: 0
    });

    const savedQuotation = await newQuotation.save();
    console.log('Quotation added successfully:', savedQuotation);

    return savedQuotation;
  } catch (err) {
    console.error("Error adding quotation:", err.message);
    throw new Error('Failed to add Quotation!');
  } finally {
    revalidatePath("/dashboard/quotations"); 
    redirect("/dashboard/quotations");
  }
};




export const updateQuotation = async (formData) => {
  const { id, projectName, projectLA, products, paymentTerm, paymentDelivery, note, excluding, user } = formData;

  try {
    await connectToDB();
    const quotation = await Quotation.findById(id);
    quotation.revisionNumber += 1;
    if (quotation.quotationId) {
      const baseId = quotation.quotationId.split(" Rev.")[0];
      quotation.quotationId = `${baseId} Rev.${quotation.revisionNumber}`;
    }

    const updateFields = {
      projectName,
      projectLA,
      products,
      paymentTerm,
      paymentDelivery,
      note,
      excluding,
      ...(user && { user }) 
    };

    Object.keys(updateFields).forEach(
      (key) => (updateFields[key] === "" || updateFields[key] === undefined) && delete updateFields[key]
    );

    Object.assign(quotation, updateFields);

    await quotation.save();


  } catch (err) {
    console.error(err);
    throw new Error("Failed to update quotation!");
  } finally {
    revalidatePath("/dashboard/quotations");
    redirect("/dashboard/quotations");
  }
};

export const updateQuotationApprove = async (formData) => {
  const { id, projectName, projectLA, products, paymentTerm, paymentDelivery, note, excluding, user } = formData;

  try {
    // Connect to the database
    await connectToDB();

    const quotation = await Quotation.findById(id);
    

    const updateFields = {
      projectName,
      projectLA,
      products,
      paymentTerm,
      paymentDelivery,
      note,
      excluding,
      ...(user && { user }) 
    };

    Object.keys(updateFields).forEach(
      (key) => (updateFields[key] === "" || updateFields[key] === undefined) && delete updateFields[key]
    );

    Object.assign(quotation, updateFields);

    await quotation.save();


  } catch (err) {
    console.error(err);
    throw new Error("Failed to update quotation!");
  } finally {
    revalidatePath("/dashboard/approves");
    redirect("/dashboard/approves");
  }
};




export const deleteQuotation = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
     connectToDB();        
    await Quotation.findByIdAndDelete(id)

  } catch (err) {
    console.log(err)
    throw new Error('failed to delete Quotation!')
  }

  revalidatePath("/dashboard/quotations");
};


export const deletePoApprove = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
     connectToDB();        
    await ApprovePo.findByIdAndDelete(id)

  } catch (err) {
    console.log(err)
    throw new Error('failed to delete ApprovePo!')
  }

  revalidatePath("/dashboard/approvePo");
};

export const addCoc = async (formData) => {
  const { saleId, clientId,quotationId, jobOrderId, products, deliveryLocation} = formData;

  try {
    await connectToDB();

    const jobOrder = await JobOrder.findById(jobOrderId);
    if (!jobOrder) {
      throw new Error('job not found');
    }


    const sale = await Sale.findById(saleId);
    if (!sale) {
      throw new Error('Sale not found');
    }

    const client = await Client.findById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }

    const quotation = await Quotation.findById(quotationId);
    if (!quotation) {
      throw new Error('Quotation not found');
    }

    const year = new Date().getFullYear();
    const count = await incrementcOCCounter(year);
    const customCocId = `SVSCOC-${year}-${count}`;

    const newCoc = new Coc({
      client: client._id,
      quotation: quotation._id,
      sale: sale._id,
      jobOrder: jobOrder._id,
      products,
      deliveryLocation,
      cocId:customCocId,
      revisionNumber: 0,
        });

    const savedCoc = await newCoc.save();
    console.log('Coc added successfully:', savedCoc);

    return savedCoc;
  } catch (err) {
    console.error("Error adding coc:", err.message);
    throw new Error('Failed to add Coc!');
  } finally {
    revalidatePath("/dashboard/pl_coc/coc");
    redirect("/dashboard/pl_coc/coc");
  }
};


export const updateCoc = async (formData) => {
  const { id,clientName, projectName, projectLA, products,deliveryLocation} = formData;

  try {
    await connectToDB();

    const coc = await Coc.findById(id);
    if (!coc) {
      throw new Error('Coc not found');
    }

    coc.revisionNumber += 1;

    if (coc.cocId) {
      const baseId = coc.cocId.split(" Rev.")[0];
      coc.cocId = `${baseId} Rev.${coc.revisionNumber}`;
    }
    const updateFields = {
      clientName,
      projectName,
      projectLA,
      products,
      deliveryLocation,

    }

    Object.keys(updateFields).forEach(
      (key) => (updateFields[key] === "" || updateFields[key] === undefined) && delete updateFields[key]
    );

    Object.assign(coc, updateFields);

    await coc.save();
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update coc!");
  } finally {
    revalidatePath("/dashboard/pl_coc/coc");
    redirect("/dashboard/pl_coc/coc");
  }
};


export const deleteCoc = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
     connectToDB();        
    await Coc.findByIdAndDelete(id)

  } catch (err) {
    console.log(err)
    throw new Error('failed to delete coc!')
  }

  revalidatePath("/dashboard/pl_coc/coc");
};


export const addPickList = async (formData) => {
  const { saleId, clientId,quotationId, jobOrderId, products,deliveryLocation } = formData;

  try {
    await connectToDB();


    const jobOrder = await JobOrder.findById(jobOrderId);
    if (!jobOrder) {
      throw new Error('job not found');
    }


    const sale = await Sale.findById(saleId);
    if (!sale) {
      throw new Error('Sale not found');
    }

    const client = await Client.findById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }

    const quotation = await Quotation.findById(quotationId);
    if (!quotation) {
      throw new Error('Quotation not found');
    }


    const year = new Date().getFullYear();
    const count = await incrementPlCounter(year);
    const customPickListIdId = `SVSPL-${year}-${count}`;

    const newPickList = new Pl({
      client: client._id,
      quotation: quotation._id,
      sale: sale._id,
      jobOrder: jobOrder._id,
      products,
      deliveryLocation,
      pickListId: customPickListIdId,
      revisionNumber: 0,
    });

    const savedpl = await newPickList.save();
    console.log('pl added successfully:', newPickList);

    return savedpl;
  } catch (err) {
    console.error("Error adding pl:", err.message);
    throw new Error('Failed to add pl!');
  } finally {
    revalidatePath("/dashboard/pl_coc/pl");
    redirect("/dashboard/pl_coc/pl");
  }
};



export const updatePl = async (formData) => {
  const { id,clientName, projectName, projectLA, products,deliveryLocation } = formData;

  try {
    await connectToDB();

    const pl = await Pl.findById(id);
    if (!pl) {
      throw new Error('Pl not found');
    }

    pl.revisionNumber += 1;

    if (pl.pickListId) {
      const baseId = pl.pickListId.split(" Rev.")[0];
      pl.pickListId = `${baseId} Rev.${pl.revisionNumber}`;
    }

    const updateFields = {
      clientName,
      projectName,
      projectLA,
      products,
      deliveryLocation,
    };

    Object.keys(updateFields).forEach(
      (key) => (updateFields[key] === "" || updateFields[key] === undefined) && delete updateFields[key]
    );

    Object.assign(pl, updateFields);

    await pl.save();
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update pl!");
  } finally {
    revalidatePath("/dashboard/pl_coc/pl");
    redirect("/dashboard/pl_coc/pl");
  }
};




export const deletePl = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
     connectToDB();        
    await Pl.findByIdAndDelete(id)

  } catch (err) {
    console.log(err)
    throw new Error('failed to delete pl!')
  }

  revalidatePath("/dashboard/pl_coc/pl");
};




export const addPurchaseOrder = async (formData) => {

  const {
    saleId,
    supplierId,
    quotationId,
    products,
    paymentTerm,
    paymentDelivery,
    deliveryLocation,
    note,

  } = formData

  try {
   await connectToDB();

   const year = new Date().getFullYear();
   const count = await incrementPoCounter(year);
   const customPurchaseId = `SVSPO-${year}-${count}`;

   const sale = await Sale.findById(saleId);
   if (!sale) {
     throw new Error('Sale not found');
   }
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      throw new Error('Supplier not found');
    }
    const quotation = await Quotation.findById(quotationId);
    if (!quotation) {
      throw new Error('Quotation not found');
    }





    const newPurchaseOrder = new PurchaseOrder({
      sale: sale._id,
      supplier: supplier._id,
      quotation:quotation._id,
      products,
      paymentTerm,
      paymentDelivery,
      deliveryLocation,
      note,
      purchaseId:customPurchaseId,
      revisionNumber: 0


    });

    await newPurchaseOrder.save();
  } catch (err) {
    console.error(err);
    throw new Error('Failed to add Po!');
  }

  revalidatePath('/dashboard/purchaseOrder');

  redirect('/dashboard/purchaseOrder');
};





export const updatePurchaseOrder = async (formData) => {
  const {
    id,
    supplierName,
    quotationNumber,
    products,
    paymentTerm,
    paymentDelivery,
    deliveryLocation,
    note,
    user,
  } = formData;  
  try {
   await connectToDB();

   const purchaseOrder = await PurchaseOrder.findById(id);
    if (!purchaseOrder) {
      throw new Error('PurchaseOrder not found');
    }

   purchaseOrder.revisionNumber += 1;

   if (purchaseOrder.purchaseId) {
     const baseId = purchaseOrder.purchaseId.split(" Rev.")[0];
     purchaseOrder.purchaseId = `${baseId} Rev.${purchaseOrder.revisionNumber}`;
   }
      const updateFields = {
        supplierName,
        quotationNumber,
        products,
        paymentTerm,
        paymentDelivery,
        deliveryLocation,
        note,
        ...(user && { user }) 

      };

      Object.keys(updateFields).forEach(
        (key) =>
        (updateFields[key] === "" || undefined) && delete updateFields[key]
      );
      await PurchaseOrder.findByIdAndUpdate(id, updateFields);

      await purchaseOrder.save();

    } catch (err) {
      console.error(err);
      throw new Error("Failed to update purchase!");
    } finally {
      revalidatePath("/dashboard/purchaseOrder");
      redirect("/dashboard/purchaseOrder");
    }
  };





export const deletePurchseOrder = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
       connectToDB();        
    await PurchaseOrder.findByIdAndDelete(id)

  } catch (err) {
    console.log(err)
    throw new Error('failed to delete Po!')
  }

  revalidatePath("/dashboard/purchaseOrder");
};




export const updatePurchaseOrderApproval = async (formData) => {
  const {
    id,
    supplierName,
    quotationNumber,
    products,
    paymentTerm,
    paymentDelivery,
    deliveryLocation,
    note,
    user,
  } = formData;  
  try {
   await connectToDB();

   const purchaseOrder = await PurchaseOrder.findById(id);
    if (!purchaseOrder) {
      throw new Error('PurchaseOrder not found');
    }

  
   
      const updateFields = {
        supplierName,
        quotationNumber,
        products,
        paymentTerm,
        paymentDelivery,
        deliveryLocation,
        note,
        ...(user && { user }) 

      };

      Object.keys(updateFields).forEach(
        (key) =>
        (updateFields[key] === "" || undefined) && delete updateFields[key]
      );
      await PurchaseOrder.findByIdAndUpdate(id, updateFields);

      await purchaseOrder.save();

    } catch (err) {
      console.error(err);
      throw new Error("Failed to update purchase!");
    } finally {
      revalidatePath("/dashboard/approvePo");
      redirect("/dashboard/approvePo");
    }
  };


  export const updateCocApproval = async (formData) => {
    const { id,clientName, projectName, projectLA, products,deliveryLocation,user} = formData;
  
    try {
      await connectToDB();
  
      const coc = await Coc.findById(id);
      if (!coc) {
        throw new Error('Coc not found');
      }
  
      const updateFields = {
        clientName,
        projectName,
        projectLA,
        products,
        deliveryLocation,
        ...(user && { user }) 
  
      }
  
      Object.keys(updateFields).forEach(
        (key) => (updateFields[key] === "" || updateFields[key] === undefined) && delete updateFields[key]
      );
  
      Object.assign(coc, updateFields);
  
      await coc.save();
    } catch (err) {
      console.error(err);
      throw new Error("Failed to update coc!");
    } finally {
      revalidatePath("/dashboard/approveCoc");
      redirect("/dashboard/approveCoc");
    }
  };
  


export const authenticate = async (prevState, formData) => {
  const { username, password } = Object.fromEntries(formData);

  try {
    await signIn("credentials", { username, password });
    

  } catch (error) {
    if (error.message.includes("CredentialsSignin")) {
      return "Wrong Credentials";
    }
    throw error;
  }
};
