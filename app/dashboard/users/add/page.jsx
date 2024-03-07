import React from 'react'
import styles from '@/app/ui/dashboard/approve/approve.module.css';
import { addUser } from '@/app/lib/actions';

const AddUserPage = () => {
  return (
    <div className={styles.container}>
        <form action={addUser} className={styles.form}>
        <div className={styles.inputContainer}>
                <label  className={styles.label}>
                Username:
                </label>
        <input className={styles.input} type="text"  name="username" required />
        </div>
        <div className={styles.inputContainer}>
                <label  className={styles.label}>
                Email:
                </label>
        <input className={styles.input} type="email"  name="email" required />
        </div>
        <div className={styles.inputContainer}>
                <label  className={styles.label}>
                Password:
                </label>
        <input
        className={styles.input}
          type="password"
          name="password"
          required
        />
        </div>
        <div className={styles.inputContainer}>
                <label  className={styles.label}>
                Phone:
                </label>
            <input className={styles.input} type="phone"  name="phone" />
            </div>
            <div className={styles.inputContainer}>
                <label  className={styles.label}>
                Is Admin?
                </label>
        <select className={styles.input} name="isAdmin" id="isAdmin">
          <option value={false}>
            Is Admin?
          </option>
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
        </div>
        <div className={styles.inputContainer}>
                <label  className={styles.label}>
                Is Active?
                </label>
        <select className={styles.input} name="isActive" id="isActive">
          <option value={true}>
            Is Active?
          </option>
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
        </div>
        <div className={styles.inputContainer}>
                <label  className={styles.label}>
                Address:
                </label>
        <textarea
        className={styles.input}
          name="address"
          id="address"
          rows="16"
          placeholder=""
        ></textarea>
        </div>
        <button className={styles.button} type="submit">Submit</button>
        </form>
    </div>
  )
}

export default AddUserPage