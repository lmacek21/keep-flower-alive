import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { api } from "../api/client";
import { getUser } from "../utils/auth";

export default function Navbar() {
  const [houses, setHouses] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  useEffect(() => {
    if (!user) {
      setHouses([]);
      return;
    }
    api
      .get("/house/list")
      .then(setHouses)
      .catch(() => setHouses([]));
  }, [location.pathname]);

  if (!user) return null;

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <nav
      className="navbar navbar-expand-md shadow-sm px-3"
      style={{ backgroundColor: "var(--c-dark-green)" }}
    >
      <Link
        className="navbar-brand fw-semibold"
        to="/"
        style={{ color: "var(--c-white)" }}
      >
        KeepFlowerAlive
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        style={{ borderColor: "var(--c-light)" }}
      >
        <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }} />
      </button>

      <div className="collapse navbar-collapse" id="navbarContent">
        <ul className="navbar-nav ms-auto me-3">
          <li className="nav-item">
            <Link
              className="nav-link"
              to="/flowers"
              style={{ color: "var(--c-light)" }}
            >
              Flowers
            </Link>
          </li>
          <li className="nav-item dropdown">
            <button
              className="nav-link dropdown-toggle btn btn-link"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ color: "var(--c-light)" }}
            >
              Houses
            </button>
            <ul className="dropdown-menu">
              {houses.map((h) => (
                <li key={h._id}>
                  <Link className="dropdown-item" to={`/house/${h._id}`}>
                    {h.owner.id === user.id
                      ? "My House"
                      : `House of ${h.owner.email.split("@")[0]}`}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>

        <button
          className="btn btn-sm"
          onClick={handleLogout}
          style={{
            color: "var(--c-dark-green)",
            backgroundColor: "var(--c-light)",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
