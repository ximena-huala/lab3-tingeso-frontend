import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "1rem", background: "#222", color: "white" }}>
      <h1>RMKarts Administration System</h1>
      <ul style={{ display: "flex", listStyle: "none", gap: "1rem", padding: 0 }}>
        <li><Link to="/customers" style={{ color: "white" }}>Customers</Link></li>
        <li><Link to="/karts" style={{ color: "white" }}>Karts</Link></li>
        <li><Link to="/reservation" style={{ color: "white" }}>Reservation</Link></li>
        <li><Link to="/rack" style={{ color: "white" }}>Weekly Rack</Link></li>
        <li><Link to="/reports" style={{ color: "white" }}>Reports</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
