import { useEffect, useState } from 'react';
import { getAllKarts, createKart, updateKart, deleteKart } from '../services/kartServices';

function Karts() {
  const [karts, setKarts] = useState([]);
  const [form, setForm] = useState({ model: '', code: '', status: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadKarts();
  }, []);

  const loadKarts = () => {
    getAllKarts()
      .then(res => setKarts(res.data))
      .catch(err => setError('Error loading karts.'));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = editingId ? updateKart(editingId, form) : createKart(form);

    action
      .then(() => {
        setForm({ model: '', code: '', status: '' });
        setEditingId(null);
        setMessage(editingId ? 'Kart updated successfully!' : 'Kart added successfully!');
        setError('');
        loadKarts();
      })
      .catch(() => {
        setMessage('');
        setError('An error occurred while saving the kart.');
      });
  };

  const handleEdit = (kart) => {
    setForm({ model: kart.model, code: kart.code, status: kart.status });
    setEditingId(kart.id);
    setMessage('');
    setError('');
  };

  const handleDelete = (id) => {
    deleteKart(id)
      .then(() => {
        setMessage('Kart deleted successfully!');
        setError('');
        loadKarts();
      })
      .catch(() => {
        setMessage('');
        setError('An error occurred while deleting the kart.');
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Kart Management</h2>
      {message && <p style={{ color: 'lightgreen' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input name="model" placeholder="Model" value={form.model} onChange={handleChange} required /><br />
        <input name="code" placeholder="Code" value={form.code} onChange={handleChange} required /><br />
        <input name="status" placeholder="Status" value={form.status} onChange={handleChange} /><br />
        <button type="submit">{editingId ? 'Update' : 'Add'} Kart</button>
      </form>

      <h3>Kart List</h3>
      <ul>
        {karts.map(kart => (
          <li key={kart.id}>
            {kart.model} - {kart.code} - {kart.status} &nbsp;
            <button onClick={() => handleEdit(kart)}>Edit</button>
            <button onClick={() => handleDelete(kart.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Karts;
