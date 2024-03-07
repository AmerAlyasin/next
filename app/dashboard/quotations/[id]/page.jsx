"use client";
import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import styles from '@/app/ui/dashboard/approve/approve.module.css';
import { updateQuotation } from '@/app/lib/actions';
 


const SingleQuotation = ({params}) => { 
  const [selectedCurrency, setSelectedCurrency] = useState('USD'); 
  const [quotation, setQuotation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    saleName:'',
    clientName: '', 
    projectName: '',
    projectLA: '',
    products: [],
    paymentTerm: '',
    paymentDelivery: '',
    note: '',
    excluding: '',
  });
  const [rows, setRows] = useState([]);


  useEffect(() => {
    const getQuotationById = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/quotation/${params.id}`,{
          method: "GET",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQuotation(data);
      } catch (err) {
        setError(`Fetching failed: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
  
    getQuotationById();
  }, [params.id]); // Include getQuotationById as a dependency
  
      

      const downloadQuotationDocument = async () => {
        try {
          const totalUnitPrice = rows.reduce((total, row) => total + Number(row.unitPrice || 0), 0);
          const vatRate = selectedCurrency === 'USD' ? 0 : 0.15; // 0% VAT for USD, 15% for SAR
          const vatAmount = totalUnitPrice * vatRate;
          const totalUnitPriceWithVAT = totalUnitPrice + vatAmount;

          // Prepare the data for the document
          const documentData = {
            QuotationNumber: formData.quotationId,
            ClientName: formData.clientName, 
            userName: quotation.user?.username, 
            ClientPhone: quotation.client?.phone || 'No address provided',
            ClientEmail: quotation.client?.email || 'No contact info',
            ClientAddress: quotation.client?.address || 'No address info',
            ClientContactMobile: quotation.client?.contactMobile || 'No contact info',
            ClientContactName: quotation.client?.contactName || 'No contact info',
            SaleName: quotation.sale?.name || 'No address provided',
            UserPhone: quotation.sale?.phone || 'No address provided',
            UserEmail: quotation.sale?.email || 'No contact info',
            UserAddress: quotation.sale?.address || 'No address info',
            ProjectName: formData.projectName,
            ProjectLA: formData.projectLA,
            Products: formData.products.map((product, index) => ({
              Number: (index + 1).toString().padStart(3, '0'),
              ProductCode: product.productCode,
              UnitPrice: product.unitPrice,
              Unit: product.unit,
              Qty: product.qty,
              Description: product.description,
            })),
            CurrencySymbol: selectedCurrency === 'USD' ? '$' : 'SAR', // Adjust this based on your requirements
            TotalPrice: totalUnitPrice.toFixed(2),
            VatRate: vatRate.toFixed(2),
            VatPrice: vatAmount.toFixed(2),
            NetPrice: totalUnitPriceWithVAT.toFixed(2),
            PaymentTerm: formData.paymentTerm,
            PaymentDelivery: formData.paymentDelivery,
            Note: formData.note,
            Excluding: formData.excluding,
            CreatedAt: quotation.createdAt ? new Date(quotation.createdAt).toDateString().slice(4, 16) : '',
          };
    
          // Send data to the server to create the document
          const response = await fetch('http://localhost:3000/api/loadQuoPdf', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(documentData),
          });
     
          if (response.ok) {
            // Create a Blob from the PDF Stream
            const fileBlob = await response.blob();
            // Create a link element, use it to download the blob, and then remove it
            const link = document.createElement('a');
            link.href = URL.createObjectURL(fileBlob);
            link.download = `Quotation_${documentData.QuotationNumber}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            throw new Error(`Server responded with status: ${response.status}`);}
             } catch (error) {
              console.error('Error downloading the document:', error);
          }
      };
              
    

  

      useEffect(() => {
        if (quotation) {
          setFormData({
            quotationId: quotation.quotationId,
            userName: quotation.user && quotation.user.username ? quotation.user.username : 'N/A',
            saleName:quotation.sale && quotation.sale.name ? quotation.sale.name : 'N/A',
            clientName: quotation.client && quotation.client.name ? quotation.client.name : 'N/A', 
            projectName: quotation.projectName,
            projectLA: quotation.projectLA,
            products: quotation.products,
            paymentTerm: quotation.paymentTerm,
            paymentDelivery: quotation.paymentDelivery,
            note: quotation.note,
            excluding: quotation.excluding,
          });
    
          const newRows = quotation.products.map((product, index) => ({
            _id: product._id,
            id: index + 1,
            number: index + 1,
            productCode: product.productCode,
            unitPrice: product.unitPrice,
            unit: product.unit,
            qty: product.qty,
            description: product.description,
          }));
          setRows(newRows);
        }
      }, [quotation]);

  if (isLoading) { 
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading quotation: {error}</div>;
  }

  if (!quotation) {
    return null;
  }

  
 

  const addRow = () => {
    const newRow = { id: rows.length + 1, number: rows.length + 1 };
    setRows((prevRows) => [...prevRows, newRow]);
  };

  const deleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    const updatedRowsWithNumbers = updatedRows.map((row, i) => ({ ...row, number: i + 1 }));
    setRows(updatedRowsWithNumbers);
  };

  const handleRowInputChange = (index, fieldName, value) => {
    setRows((prevRows) =>
      prevRows.map((row, i) =>
        i === index
          ? {
              ...row,
              [fieldName]: value,
              unitPrice:
                fieldName === 'qty' && !isNaN(value) && !isNaN(row.unit)
                  ? Number(value) * Number(row.unit)
                  : fieldName === 'unit' && !isNaN(value) && !isNaN(row.qty)
                  ? Number(value) * Number(row.qty)
                  : row.unitPrice,
            }
          : row
      )
    );
  };
  const handleInputChange = (fieldName, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rowInputs = rows.map((row) => ({
      productCode: row.productCode,
      unitPrice: row.unitPrice,
      unit: row.unit,
      qty: row.qty,
      description: row.description,
    }));

    await updateQuotation({
      id: params.id,
       ...formData,
      products: rowInputs,
    });
  };

  const calculateTotalUnitPrice = () => {
    const totalUnitPrice = rows.reduce((total, row) => total + (row.unitPrice || 0), 0);
    const vatRate = selectedCurrency === 'USD' ? 0 : 0.15; // 0% VAT for USD, 15% for SAR
    const totalUnitPriceWithVAT = totalUnitPrice * (1 + vatRate);
    return {
      totalUnitPrice,
      vatAmount: totalUnitPriceWithVAT - totalUnitPrice,
      totalUnitPriceWithVAT,
    };
  };


  return (
    
    <div>  
      <form onSubmit={handleSubmit}>
      
        <div className={styles.container}>
        <div className={styles.container}>
      Quotation ID: {formData.quotationId}
      </div>
        <button type="button" className={styles.DownloadButton} onClick={downloadQuotationDocument}>
           Download Quotation
           </button>
          <div className={styles.form1}>
            <input type="hidden" name="id" value={params.id} />
            <div className={styles.inputContainer}>
                <label htmlFor="username" className={styles.label}>
                  Admin Name:
                </label>
            <input
              type="text"
              className={styles.input}
              value={formData.userName}
              onChange={(e) => handleInputChange('userName', e.target.value)}
              readOnly 
            />
            </div>
            <div className={styles.inputContainer}>
                <label htmlFor="clientName" className={styles.label}>
                  Client Name:
                </label>
            <input
              type="text"
              className={styles.input}
              value={formData.clientName}
              onChange={(e) => handleInputChange('clientName', e.target.value)}
              readOnly 
            />
            </div>
            <div className={styles.inputContainer}>
                <label htmlFor="saleName" className={styles.label}>
                Sale Representative Name:
                </label>
             <input
              type="text"
              className={styles.input}
              value={formData.saleName}
              onChange={(e) => handleInputChange('saleName', e.target.value)}
              readOnly 
            />
            </div>
            <div className={styles.inputContainer}>
                <label htmlFor="projectName" className={styles.label}>
                Project Name:
                </label>
            <input
              className={styles.input}
              value={formData.projectName}
              onChange={(e) => handleInputChange('projectName', e.target.value)}
            />
            </div>
            <div className={styles.inputContainer}>
                <label htmlFor="projectLA" className={styles.label}>
                  Project Location Address:
                </label>
            <input
              className={styles.input}
              value={formData.projectLA}
              onChange={(e) => handleInputChange('projectLA', e.target.value)}
            />
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.form2}>
            <p className={styles.title}>Products</p>
            <div className={styles.selectContainer}>
            <div className={styles.selectWrapper}>
            <label htmlFor="currency" className={styles.selectLabel}>Select Currency:</label>
          <select
          id="currency"
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className={styles.select}
          >
          <option value="USD">USD</option>
          <option value="SAR">SAR</option>
        </select>
        </div>
        </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <td>Number</td>
                  <td>Product Code</td>
                  <td>Description</td>
                  <td>Qty</td>
                  <td>Unit Price</td>
                  <td>Total Price</td>

                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id} className={styles.row}>
                    <td>
                      <input
                        className={`${styles.input} ${styles.numberInput}`}
                        type="text"
                        value={row.number.toString().padStart(3, '0')}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        className={styles.input1}
                        placeholder={row.productCode}
                        value={row.productCode}
                        onChange={(e) => handleRowInputChange(index, 'productCode', e.target.value)}
                      />
                    </td>
                    <td>
                    <textarea
                        className={`${styles.input1} ${styles.textarea}`}
                        placeholder={row.description}
                        value={row.description}
                        onChange={(e) => handleRowInputChange(index, 'description', e.target.value)}
                      ></textarea>
                    </td>
                    <td>
                      <input
                        className={styles.input1}
                        placeholder={row.qty}
                        value={row.qty}
                        onChange={(e) => handleRowInputChange(index, 'qty', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className={styles.input1}
                        placeholder={row.unit}
                        value={row.unit}
                        onChange={(e) => handleRowInputChange(index, 'unit', e.target.value)}
                      />
                    </td>
                    <td>
                    {row.unitPrice}                  
                    </td>
                    <td>
                      {index === rows.length - 1 ? (
                        <button
                          type="button"
                          className={`${styles.iconButton} ${styles.addButton}`}
                          onClick={addRow}
                        >
                          <FaPlus />
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={`${styles.iconButton} ${styles.deleteButton}`}
                          onClick={() => deleteRow(index)}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.form5}>
          <p>Total Unit Price (Excluding VAT): {calculateTotalUnitPrice().totalUnitPrice}</p>
            <p>VAT (15%): {calculateTotalUnitPrice().vatAmount}</p>
            <p>Total Unit Price (Including VAT): {calculateTotalUnitPrice().totalUnitPriceWithVAT}</p>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.form1}>
          <div className={styles.inputContainer}>
            <label htmlFor="paymentTerm" className={styles.label}>
               Payment Term:
            </label>
            <textarea
              className={styles.input}
              placeholder="paymentTerm"
              value={formData.paymentTerm}
              onChange={(e) => handleInputChange('paymentTerm', e.target.value)}
            />
            </div>
            <div className={styles.inputContainer}>
            <label htmlFor="paymentDelivery" className={styles.label}>
            Payment Delivery:
            </label>
            <textarea
              className={styles.input}
              placeholder="paymentDelivery"
              value={formData.paymentDelivery}
              onChange={(e) => handleInputChange('paymentDelivery', e.target.value)}
            />
            </div>
            <div className={styles.inputContainer}>
            <label htmlFor="note" className={styles.label}>
               Note:
            </label>
            <textarea
              className={styles.input}
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
            />
            </div>
            <div className={styles.inputContainer}>
            <label htmlFor="excluding" className={styles.label}>
            Excluding:
            </label>
            <textarea
              className={styles.input}
              value={formData.excluding}
              onChange={(e) => handleInputChange('excluding', e.target.value)}
            />
            </div>
            <button type="submit">Update</button>
          </div>
        </div>
      </form>
    </div>
  );
  
};




export default SingleQuotation;
