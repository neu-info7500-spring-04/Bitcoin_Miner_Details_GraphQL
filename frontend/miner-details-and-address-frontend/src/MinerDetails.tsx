import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import styles from './MinerDetails.module.css';

const MinerDetails: React.FC = () => {
  const [fromDate, setFromDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)));
  const [tillDate, setTillDate] = useState(new Date());
  const navigate = useNavigate();
  const [minerData, setMinerData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    handleSearch();
  }, []);

  const fetchMinerData = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/miner-data', {
        network: "bitcoin",
        limit: 10,
        offset: 0,
        from: fromDate.toISOString().split('T')[0],
        till: tillDate.toISOString().split('T')[0] + 'T23:59:59'
      });
      setMinerData(response.data);
      setError('');
    } catch (err) {
      console.error('There was an error:', err);
      setError('Error fetching data. Please try again.');
    }
    setLoading(false);
  };

  const handleSearch = () => {
    fetchMinerData();
  };

  const handleAddressClick = (address: string) => {
    navigate(`/address/${address}`, {
      state: {
        from: fromDate.toISOString().split('T')[0],
        till: tillDate.toISOString().split('T')[0] + 'T23:59:59',
      }
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.tableContainer}>
      <h2>Miner Details</h2>
      <div>
        <DatePicker className={styles.datePicker} selected={fromDate} onChange={(date: Date) => setFromDate(date)} />
        <DatePicker className={styles.datePicker} selected={tillDate} onChange={(date: Date) => setTillDate(date)} />
        <button className={styles.searchButton} onClick={handleSearch}>Search</button>
      </div>
      {minerData && (
        <table className={styles.table}>
          <thead>
            <tr>
              {["Miner", "Block Count", "First Block Date", "Last Block Date", "Block Reward, BTC"].map(header => (
                <th className={styles.th} key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {minerData.bitcoin.outputs.map((output: any, index: number) => (
              <tr key={index} onClick={() => handleAddressClick(output.address.address)} style={{ cursor: 'pointer' }}>
                <td className={styles.td}>
                  <a className={styles.addressLink} onClick={(e) => {
                    e.stopPropagation(); // Prevent the click from bubbling up to the <tr>
                    handleAddressClick(output.address.address);
                  }}>
                    {output.address.address}
                  </a>
                </td>
                <td className={styles.td}>{output.count}</td>
                <td className={styles.td}>{output.min_date}</td>
                <td className={styles.td}>{output.max_date}</td>
                <td className={styles.td}>
                  {output.reward.toFixed(2)}{' '}
                  <sup style={{ color: 'green' }}>
                    ${output.reward_usd.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).slice(1)}
                  </sup>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MinerDetails;
