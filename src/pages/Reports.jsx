import { useEffect, useState } from 'react';
import axios from 'axios';

function Reports() {
  const [trackTimeData, setTrackTimeData] = useState({});
  const [groupSizeData, setGroupSizeData] = useState({});
  const [error, setError] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [startMonth, setStartMonth] = useState(new Date().getMonth() + 1);
  const [endMonth, setEndMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    const params = { year, startMonth, endMonth };

    axios.get(`${import.meta.env.VITE_API_URL}/api/reports/by-track-time`, { params })
      .then(res => setTrackTimeData(res.data))
      .catch(err => setError('Error loading time report'));

    axios.get(`${import.meta.env.VITE_API_URL}/api/reports/by-group-size`, { params })
      .then(res => setGroupSizeData(res.data))
      .catch(err => setError('Error loading people report'));
  }, [year, startMonth, endMonth]);

  const renderTable = (data, title) => {
    const allMonths = Array.from(
      new Set(
        Object.values(data)
          .flatMap(values => Object.keys(values))
      )
    );
    const months = allMonths.length > 0 ? allMonths : [];
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
      <div style={{ marginBottom: '20px' }}>
        <label>Año: </label>
        <input type="number" value={year} min="2020" max="2100" onChange={e => setYear(Number(e.target.value))} style={{ width: 80, marginRight: 10 }} />
        <label>Mes inicio: </label>
        <select value={startMonth} onChange={e => setStartMonth(Number(e.target.value))}>
          {[...Array(12)].map((_, i) => (
            <option key={i+1} value={i+1}>{i+1}</option>
          ))}
        </select>
        <label style={{ marginLeft: 10 }}>Mes fin: </label>
        <select value={endMonth} onChange={e => setEndMonth(Number(e.target.value))}>
          {[...Array(12)].map((_, i) => (
            <option key={i+1} value={i+1}>{i+1}</option>
          ))}
        </select>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {renderTable(trackTimeData, "Reporte de ingresos por número de vueltas o tiempo máximo")}
      {renderTable(groupSizeData, "Reporte de ingresos por número de personas")}
    </div>
  );
}

export default Reports;
