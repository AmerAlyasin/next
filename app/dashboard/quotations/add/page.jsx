"use client";
import React, {useState, useEffect} from 'react'; 
import { FaPlus, FaTrash } from 'react-icons/fa';
import styles from '@/app/ui/dashboard/approve/approve.module.css';
import {addQuotation } from '@/app/lib/actions';

const AddQuotationPage = () => {
  const [clients, setClients] = useState([]); 
  const [sales, setSales] = useState([]); 
  const [rows, setRows] = React.useState([{ number: 1 }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/allClients', { method: 'GET' });
        const data = await response.json();
        console.log('Clients fetched:', data);
        setClients(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching clients:', error);
        setLoading(false);
      }
    };
  
    fetchClients();
  }, []);
  

  useEffect(() => {
    const fetchSales= async () => {
      try {
        const response = await fetch('http://localhost:3000/api/allSales', { method: 'GET' });
        const data = await response.json();
        console.log('Sales fetched:', data);
        setSales(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };
  
    fetchSales();
  }, []);
 

  const addRow = () => {
    const newRow = { number: rows.length + 1 };
    const newRows = [...rows, newRow];
    setRows(newRows);
  };

  const deleteRow = (index) => { 
    const updatedRows = rows.filter((_, i) => i !== index);
    const updatedRowsWithNumbers = updatedRows.map((row, i) => ({ ...row, number: i + 1 }));
    setRows(updatedRowsWithNumbers);
  };

  

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Form submitted. FormData:', event.target);

    const formData = {
      saleId: event.target.saleId.value, 
      clientId: event.target.clientId.value, 
      projectName: event.target.projectName.value,
      projectLA: event.target.projectLA.value,
      products: rows.map((row, index) => ({
        number: index + 1,
        productCode: event.target[`productCode${index}`].value,
        unitPrice:
        !isNaN(event.target[`qty${index}`].value) &&
        !isNaN(event.target[`unit${index}`].value)
          ? Number(event.target[`qty${index}`].value) * Number(event.target[`unit${index}`].value)
          : 0, 
        unit: event.target[`unit${index}`].value,
        qty: event.target[`qty${index}`].value,
        description: event.target[`description${index}`].value,
})),
      paymentTerm: event.target.paymentTerm.value,
      paymentDelivery: event.target.paymentDelivery.value,
      note: event.target.note.value,
      excluding: event.target.excluding.value,
    };

    await addQuotation(formData);
  };
  
  

  return (
    <div>
     {loading && <p>Loading clients...</p>}
    {error && <p>Error: {error}</p>}
    {!loading && !error && (
      <form onSubmit={handleSubmit}>
        <div className={styles.container}>
          <div className={styles.form1}>
          <div className={styles.inputContainer}>
                <label htmlFor="saleName" className={styles.label}>
                Sale Representative Name:
                </label>
          <select name='saleId' className={styles.input}>
          <option value="" disabled selected>Select Sale Representative </option>
          {sales.map((sale) => (
              <option key={sale._id} value={sale._id}>
                  {sale.name}
              </option>
            ))}
          </select>
          </div>
          <div className={styles.inputContainer}>
                <label htmlFor="clientName" className={styles.label}>
                  Client Name:
                </label>
          <select name='clientId' className={styles.input}>
          <option value="" disabled selected>Select Client</option>
          {clients.map((client) => (
              <option key={client._id} value={client._id}>
                  {client.name}
              </option>
            ))} 
          </select> 
          </div>
          <div className={styles.inputContainer}>
                <label htmlFor="projectName" className={styles.label}>
                Project Name:
                </label>
            <input type='text' name='projectName' className={styles.input} placeholder='Project Name' />
            </div>
            <div className={styles.inputContainer}>
                <label htmlFor="projectLA" className={styles.label}>
                  Project Location Address:
                </label>
            <input type='text' name='projectLA' className={styles.input} placeholder='Project Location Address' />
            </div>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.form2}>
            <p className={styles.title}>Products</p>
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
                  <tr key={index} className={styles.row}>
                    <td>
                      <input
                        className={`${styles.input} ${styles.numberInput}`}
                        type="text"
                        value={row.number.toString().padStart(3, '0')}
                        readOnly
                      />
                    </td>
                    <td><input type='text' name={`productCode${index}`} className={styles.input1} /></td>
                    <td><textarea name={`description${index}`} className={`${styles.input1} ${styles.textarea}`}></textarea></td>
                    <td><input type='number' name={`qty${index}`} className={styles.input1} /></td>
                    <td><input type='number' name={`unit${index}`} className={styles.input1} /></td>
                    <td>{row.unitPrice}</td>

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
          <div className={styles.form1}>
          <div className={styles.inputContainer}>
                <label htmlFor="paymentTerm" className={styles.label}>
                Payment Term:
                </label>
            <textarea type='text' name='paymentTerm' className={styles.input} placeholder='Payment Term' />
            </div>
            <div className={styles.inputContainer}>
                <label htmlFor="paymentDelivery" className={styles.label}>
                Payment Delivery:
                </label>
            <textarea type='text' name='paymentDelivery' className={styles.input} placeholder='Payment Delivery' />
            </div>
            <div className={styles.inputContainer}>
                <label htmlFor="note" className={styles.label}>
                Note:
                </label>
            <textarea type='text' name='note' className={styles.input} placeholder='Note' />
            </div>
            <div className={styles.inputContainer}>
                <label htmlFor="excluding" className={styles.label}>
                Excluding:
                </label>
            <textarea type='text' name='excluding' className={styles.input} placeholder='Excluding' />
            </div>
            <button type="submit">Submit</button>
          </div>
        </div>
        
      </form>
      )}
    </div>
  );
  
};

export default AddQuotationPage;
