import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAllCustomers, createCustomer } from '../services/customerServices';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: '',
    email: '',
    rut: '',
    phoneNumber: '',
    dateOfBirth: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = () => {
    getAllCustomers()
      .then(res => setCustomers(res.data))
      .catch(err => {
        console.error('Error loading customers:', err);
        setError('Error loading customers');
        setTimeout(() => setError(''), 3000);
      });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedDate = new Date(form.dateOfBirth).toISOString().split('T')[0];

    const customerData = {
      ...form,
      dateOfBirth: formattedDate
    };

    try {
      if (form.id) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/customers/${form.id}`, customerData);
        setMessage('Customer updated successfully!');
      } else {
        await createCustomer(customerData);
        setMessage('Customer added successfully!');
      }

      setForm({
        id: null,
        name: '',
        email: '',
        rut: '',
        phoneNumber: '',
        dateOfBirth: ''
      });

      loadCustomers();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error saving customer:', err);
      setError('An error occurred while saving the customer.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleEdit = (customer) => {
    setForm({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      rut: customer.rut,
      phoneNumber: customer.phoneNumber,
      dateOfBirth: customer.dateOfBirth
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/customers/${id}`);
      setMessage('Customer deleted successfully!');
      loadCustomers();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting customer:', err);
      setError('An error occurred while deleting the customer.');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>{form.id ? 'Edit Customer' : 'Create Customer'}</h2>

      {message && (
        <div style={{ color: 'green', marginBottom: '10px' }}>{message}</div>
      )}
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required /><br />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required /><br />
        <input name="rut" placeholder="RUT" value={form.rut} onChange={handleChange} required /><br />
        <input name="phoneNumber" placeholder="Phone Number" value={form.phoneNumber} onChange={handleChange} /><br />
        <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} /><br />
        <button type="submit">{form.id ? 'Update' : 'Add'}</button>
      </form>

      <h2>Customer List</h2>
      <ul>
        {customers.map(c => (
          <li key={c.id}>
            {c.name} - {c.email} - {c.rut} &nbsp;
            <button onClick={() => handleEdit(c)}>Edit</button>
            <button onClick={() => handleDelete(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Customers;
