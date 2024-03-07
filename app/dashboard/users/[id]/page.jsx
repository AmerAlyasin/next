import React from 'react'
import styles from '@/app/ui/dashboard/approve/approve.module.css';
 import {fetchUser  } from '@/app/lib/data'; 
import { updateUser } from '@/app/lib/actions';

const SingleUserPage = async ({params}) => {
  const { id } = params;
  const user = await fetchUser(id);
  return (
    <div className={styles.container}>
        
        <div className={styles.formContainer}>
            <form action={updateUser} className={styles.form}>
              <input className={styles.input} type='hidden' name='id' value={user.id}/>
              <div className={styles.inputContainer}>
                <label  className={styles.label}>
                Username:
                </label>
            <input className={styles.input} type='text' name='' placeholder={user.username} />
            </div>
            <div className={styles.inputContainer}>
                <label  className={styles.label}>
                Email:
                </label>
            <input className={styles.input} type='email' name='email' placeholder={user.email} />
            </div>
            <div className={styles.inputContainer}>
                <label  className={styles.label}>
                Password:
                </label>
            <input className={styles.input} type='passsword' name='password'/>
            </div>
            <div className={styles.inputContainer}>
                <label  className={styles.label}>
                Phone:
                </label>
            <input className={styles.input} type='text' name='phone' placeholder={user.phone} />
            </div>
            <div className={styles.inputContainer}>
                <label  className={styles.label}>
                Address:
                </label>
            <textarea className={styles.input} type='text' name='address' placeholder={user.address} />
            </div>
            <div className={styles.inputContainer}>
                <label  className={styles.label}>
                Is Admin?
                </label>
            <select className={styles.input} name='isAdmin' id='isAdmin'>
            <option value={true} selected={user.isAdmin}>Yes</option>
            <option value={false} selected={!user.isAdmin}>No</option>
            </select>
            </div>
            <div className={styles.inputContainer}>
                <label  className={styles.label}>
                isActive?
                </label>
            <select  className={styles.input} name='isActive' id='isActive'>
            <option value={true} selected={user.isActive}>Yes</option>
            <option value={false} selected={!user.isActive}>No</option>
            </select>
            </div>
            <button className={styles.button}>Update</button>
            </form>
        </div>
    </div>
  );
};

export default SingleUserPage