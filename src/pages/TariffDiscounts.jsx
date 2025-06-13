import { useEffect, useState } from 'react';
import { getAllTariffDiscounts, createTariffDiscount, updateTariffDiscount, deleteTariffDiscount } from '../services/tariffDiscountServices';

function TariffDiscounts() {
  const [tariffDiscounts, setTariffDiscounts] = useState([]);
  const [form, setForm] = useState({ type: '', description: '', value: '', duration: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadTariffDiscounts();
  }, []);

  const loadTariffDiscounts = () => {
    getAllTariffDiscounts()
      .then(res => setTariffDiscounts(res.data))
      .catch(() => setError('Error loading tariff discounts.'));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalForm = {
      type: form.type,
      description: form.description,
      value: parseFloat(form.value),
      duration: form.type === 'tariff' ? form.duration : null
    };

    const action = editingId ? updateTariffDiscount(editingId, finalForm) : createTariffDiscount(finalForm);

    action
      .then(() => {
        setForm({ type: '', description: '', value: '', duration: '' });
        setEditingId(null);
        setMessage(editingId ? 'Tariff/Discount updated successfully!' : 'Tariff/Discount added successfully!');
        setError('');
        loadTariffDiscounts();
      })
      .catch(() => {
        setMessage('');
        setError('An error occurred while saving the tariff/discount.');
      });
  };

  const handleEdit = (item) => {
    setForm({ 
      type: item.type, 
      description: item.description, 
      value: item.value, 
      duration: item.duration || '' 
    });
    setEditingId(item.id);
    setMessage('');
    setError('');
  };

  const handleDelete = (id) => {
    deleteTariffDiscount(id)
      .then(() => {
        setMessage('Tariff/Discount deleted successfully!');
        setError('');
        loadTariffDiscounts();
      })
      .catch(() => {
        setMessage('');
        setError('An error occurred while deleting the tariff/discount.');
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Tariff & Discounts Management</h2>
      {message && <p style={{ color: 'lightgreen' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <select name="type" value={form.type} onChange={handleChange} required>
          <option value="">Select Type</option>
          <option value="tariff">Tariff</option>
          <option value="discount">Discount</option>
        </select><br />

        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required /><br />
        <input name="value" type="number" step="0.01" placeholder="Value" value={form.value} onChange={handleChange} required /><br />

        {form.type === 'tariff' && (
          <>
            <input 
              name="duration" 
              placeholder="Duration (e.g., 10 min)" 
              value={form.duration} 
              onChange={handleChange} 
              required 
            /><br />
          </>
        )}

        <button type="submit">{editingId ? 'Update' : 'Add'} Tariff/Discount</button>
      </form>

      <h3>Tariff/Discount List</h3>
      <ul>
        {tariffDiscounts.map(item => (
          <li key={item.id}>
            {item.type.toUpperCase()} - {item.description} - {item.value}{item.type === 'discount' ? '%' : ''} 
            {item.type === 'tariff' && item.duration ? ` - ${item.duration}` : ''}
            &nbsp;
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TariffDiscounts;
