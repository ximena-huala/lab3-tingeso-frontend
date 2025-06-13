import { useEffect, useState } from 'react';
import axios from 'axios';

function Reports() {
  const [trackTimeData, setTrackTimeData] = useState({});
  const [groupSizeData, setGroupSizeData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const params = { year: 2025, startMonth: 1, endMonth: 5 }; // Puedes hacer esto dinámico más adelante

    axios.get(`${import.meta.env.VITE_API_URL}/api/reports/by-track-time`, { params })
      .then(res => setTrackTimeData(res.data))
      .catch(err => setError('Error loading time report'));

    axios.get(`${import.meta.env.VITE_API_URL}/api/reports/by-group-size`, { params })
      .then(res => setGroupSizeData(res.data))
      .catch(err => setError('Error loading people report'));
  }, []);

  const renderTable = (data, title) => {
    const months = Object.values(data)[0] ? Object.keys(Object.values(data)[0]) : [];
    const rows = Object.entries(data);
    const totals = months.map(month => 
      rows.reduce((sum, [_, values]) => sum + (values[month] || 0), 0)
    );
    const grandTotal = totals.reduce((a, b) => a + b, 0);

    return (
      <div style={{ marginBottom: '50px' }}>
        <h3>{title}</h3>
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Categoría</th>
              {months.map(month => <th key={month}>{month}</th>)}
              <th><strong>TOTAL</strong></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([category, values]) => {
              const rowTotal = months.reduce((sum, m) => sum + (values[m] || 0), 0);
              return (
                <tr key={category}>
                  <td>{category}</td>
                  {months.map(month => (
                    <td key={month}>{(values[month] || 0).toLocaleString()}</td>
                  ))}
                  <td><strong>{rowTotal.toLocaleString()}</strong></td>
                </tr>
              );
            })}
            <tr>
              <td><strong>TOTAL</strong></td>
              {totals.map((t, i) => <td key={i}><strong>{t.toLocaleString()}</strong></td>)}
              <td><strong>{grandTotal.toLocaleString()}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Reports</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {renderTable(trackTimeData, "Reporte de ingresos por número de vueltas o tiempo máximo")}
      {renderTable(groupSizeData, "Reporte de ingresos por número de personas")}
    </div>
  );
}

export default Reports;
