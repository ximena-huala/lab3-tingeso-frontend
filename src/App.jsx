import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Customers from "./pages/Customers";
import Karts from "./pages/Karts";
import TariffDiscounts from "./pages/TariffDiscounts";
import Reservation from "./pages/Reservation";
import Rack from "./pages/Rack";
import Reports from "./pages/Reports";



function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
      <Route path="/" element={<Customers />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/karts" element={<Karts />} />
        <Route path="/tariff-Discounts" element={<TariffDiscounts />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/rack" element={<Rack />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/rates-discounts" element={<TariffDiscounts />} />
        <Route path="/reservation" element={<Reservation />} />
      </Routes>
    </Router>
  );
}

export default App;
