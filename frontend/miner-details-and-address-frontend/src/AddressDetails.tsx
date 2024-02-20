import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests
import { useParams, useLocation } from 'react-router-dom';
import styles from './AddressDetails.module.css';

type LocationState = {
  from: string;
  till: string;
};

function AddressDetails() {
  const { address } = useParams<{ address: string }>();
  const location = useLocation();
  const state = location.state as LocationState;

  const [fromDate, setFromDate] = useState(state.from);
  const [tillDate, setTillDate] = useState(state.till);
  const [details, setDetails] = useState<any>(null); // State for storing fetched data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (address && fromDate && tillDate) {
        setLoading(true);
        try {
          const response = await axios.post(`http://localhost:3000/api/address-stats`, {
            network: "bitcoin",
            address,
            from: fromDate,
            till: tillDate,
          });
          setDetails(response.data); // Set the data received from backend to state
          setError(''); // Clear any existing errors
        } catch (err) {
          console.error('There was an error fetching the address details:', err);
          setError('Error fetching data. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [address, fromDate, tillDate]); // Fetch data when these dependencies change

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Calculate balance from fetched data
  const inputsValue = details?.bitcoin.inputs[0]?.value || 0;
  const outputsValue = details?.bitcoin.outputs[0]?.value || 0;
  const balance = outputsValue - inputsValue;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Address Details for <span className={styles.highlight}>{address}</span></h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Metric</th>
            <th className={styles.th}>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Inputs in Transactions</td><td>{details?.bitcoin.inputs[0]?.count || 0}</td></tr>
          <tr><td>Outputs in Transactions</td><td>{details?.bitcoin.outputs[0]?.count || 0}</td></tr>
          <tr><td>First Transaction Date</td><td>{details?.bitcoin.inputs[0]?.min_date || 'N/A'}</td></tr>
          <tr><td>Last Transaction Date</td><td>{details?.bitcoin.outputs[0]?.max_date || 'N/A'}</td></tr>
          <tr><td>Received in Outputs</td><td className={styles.dollar}>${details?.bitcoin.outputs[0]?.value_usd.toLocaleString()}</td></tr>
          <tr><td>Spent in Inputs</td><td className={styles.dollar}>${details?.bitcoin.inputs[0]?.value_usd.toLocaleString()}</td></tr>
          <tr><td>Balance (Unspent Outputs)</td><td className={styles.dollar}>${balance.toLocaleString()}</td></tr>
        </tbody>
      </table>
    </div>
  );
}

export default AddressDetails;
