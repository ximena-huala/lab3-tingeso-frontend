import { useState, useEffect } from 'react';
import { createReservation, getAllReservations, getAvailableTimes, deleteReservation } from '../services/reservationServices';
import axios from 'axios';

function Reservations() {
  const [form, setForm] = useState({
    reservationDate: '',
    reservationTime: '',
    numberOfPeople: 1,
    trackTime: '',
  });

  const [ruts, setRuts] = useState(['']);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [reservations, setReservations] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [filterDate, setFilterDate] = useState("");

  const basePrices = {
    "10 minutes": 15000,
    "15 minutes": 20000,
    "20 minutes": 25000,
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    if (form.reservationDate) {
      getAvailableTimes(form.reservationDate)
        .then(res => setAvailableTimes(res.data))
        .catch(err => {
          console.error('Error fetching available times:', err);
          setAvailableTimes([]);
        });
    } else {
      setAvailableTimes([]);
    }
  }, [form.reservationDate]);

  useEffect(() => {
    calculateBasePrice();
  }, [form.trackTime, form.numberOfPeople]);

  const calculateBasePrice = () => {
    if (form.trackTime && basePrices[form.trackTime]) {
      const base = basePrices[form.trackTime];
      setEstimatedPrice(base * form.numberOfPeople);
    } else {
      setEstimatedPrice(0);
    }
  };

  const applyBestDiscount = async () => {
    const basePrice = basePrices[form.trackTime];
    const total = basePrice * form.numberOfPeople;

    try {
      const { data: customers } = await axios.post(`${import.meta.env.VITE_API_URL}/api/customers/by-ruts`, ruts);
      let bestDiscount = 0;

      // Descuento por cantidad de personas
      if (form.numberOfPeople >= 3 && form.numberOfPeople <= 5) bestDiscount = 10;
      else if (form.numberOfPeople >= 6 && form.numberOfPeople <= 10) bestDiscount = 20;
      else if (form.numberOfPeople >= 11) bestDiscount = 30;

      // Descuento cumpleañero o frecuencia
      customers.forEach(c => {
        const dob = new Date(c.birthDate);
        const resDate = new Date(form.reservationDate);
        const isBirthday = dob.getMonth() === resDate.getMonth() && dob.getDate() === resDate.getDate();

        let freqDiscount = 0;
        if (c.visitCount >= 7) freqDiscount = 30;
        else if (c.visitCount >= 5) freqDiscount = 20;
        else if (c.visitCount >= 2) freqDiscount = 10;

        if (isBirthday) freqDiscount = Math.max(freqDiscount, 50); 
        bestDiscount = Math.max(bestDiscount, freqDiscount);
      });

      const discountedPrice = total * (1 - bestDiscount / 100);
      setEstimatedPrice(discountedPrice);
      setDiscountApplied(true);
      setMessage(`Best discount applied: ${bestDiscount}%`);
    } catch (err) {
      console.error(err);
      setError("Error applying discount");
    }
  };

  const fetchReservations = () => {
    getAllReservations()
      .then(response => setReservations(response.data))
      .catch(err => console.error('Error fetching reservations:', err));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setDiscountApplied(false);
  };

  const handleRutChange = (index, value) => {
    const newRuts = [...ruts];
    newRuts[index] = value;
    setRuts(newRuts);
  };

  const handleNumberOfPeopleChange = (e) => {
    const num = parseInt(e.target.value, 10);
    setForm({ ...form, numberOfPeople: num });
    setDiscountApplied(false);
    const newRuts = [...ruts];
    while (newRuts.length < num) newRuts.push('');
    while (newRuts.length > num) newRuts.pop();
    setRuts(newRuts);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const reservationRequest = {
      reservation: {
        reservationDate: form.reservationDate,
        reservationTime: form.reservationTime,
        numberOfPeople: form.numberOfPeople,
        trackTime: form.trackTime,
        totalPrice: Number(estimatedPrice),
      },
      customerRuts: ruts,
    };

    createReservation(reservationRequest)
      .then(() => {
        setMessage('Reservation created successfully!');
        setError('');
        setForm({ reservationDate: '', reservationTime: '', numberOfPeople: 1, trackTime: '' });
        setRuts(['']);
        setEstimatedPrice(0);
        setDiscountApplied(false);
        fetchReservations();
      })
      .catch(err => {
        console.error(err);
        if (err.response && err.response.data) {
          setError(typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data));
        } else {
          setError('Failed to create reservation.');
        }
        setMessage('');
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this reservation?")) {
      deleteReservation(id)
        .then(() => {
          setReservations(reservations.filter(r => r.id !== id));
        })
        .catch(err => {
          console.error(err);
          alert('Failed to delete reservation.');
        });
    }
  };

  const handleEdit = (reservation) => {
    setForm({
      reservationDate: reservation.reservationDate,
      reservationTime: reservation.reservationTime,
      numberOfPeople: reservation.numberOfPeople,
      trackTime: reservation.trackTime,
    });
    setRuts(reservation.participants?.map(p => p.customer?.rut) || []);
    setDiscountApplied(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Reservations</h2>
      {message && <p style={{ color: 'lightgreen' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Date:</label><br />
        <input type="date" name="reservationDate" value={form.reservationDate} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} /><br />

        <label>Time:</label><br />
        <select name="reservationTime" value={form.reservationTime} onChange={handleChange} required>
          <option value="">Select available time</option>
          {availableTimes.map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select><br />

        <label>Number of People:</label><br />
        <input type="number" name="numberOfPeople" min="1" max="15" value={form.numberOfPeople} onChange={handleNumberOfPeopleChange} required /><br />

        <label>Track Time:</label><br />
        <select name="trackTime" value={form.trackTime} onChange={handleChange} required>
          <option value="">Select duration</option>
          <option value="10 minutes">10 minutes</option>
          <option value="15 minutes">15 minutes</option>
          <option value="20 minutes">20 minutes</option>
        </select><br />

        <h4>friends (RUTs):</h4>
        {ruts.map((rut, index) => (
          <input
            key={index}
            type="text"
            placeholder={`friends ${index + 1} RUT`}
            value={rut}
            onChange={(e) => handleRutChange(index, e.target.value)}
            required
          />
        ))}

        <p><strong>Estimated Price:</strong> ${estimatedPrice.toLocaleString()}</p>

        {!discountApplied && <button type="button" onClick={applyBestDiscount}>Apply Best Discount</button>}
        <button type="submit">Create Reservation</button>
      </form>

      <hr />
      <h3>Reservations List</h3>
      <div style={{ marginBottom: '10px' }}>
        <label>Filtrar por fecha: </label>
        <input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          style={{ marginLeft: '10px' }}
        />
        {filterDate && (
          <button type="button" onClick={() => setFilterDate("")}>Limpiar filtro</button>
        )}
      </div>
      <ul>
        {reservations
          .filter(res => !filterDate || res.reservationDate === filterDate)
          .map(res => (
            <li key={res.id}>
              <strong>{res.reservationDate} at {res.reservationTime}</strong> - {res.numberOfPeople} people - {res.trackTime} - ${res.totalPrice.toLocaleString()}
              <button onClick={() => handleEdit(res)} style={{ marginLeft: '10px' }}>Edit</button>
              <button onClick={() => handleDelete(res.id)} style={{ marginLeft: '5px', color: 'white' }}>Delete</button>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Reservations;
