import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Customers from "./pages/Customers";
import Karts from "./pages/Karts";
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
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/rack" element={<Rack />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Router>
  );
}

export default App;
