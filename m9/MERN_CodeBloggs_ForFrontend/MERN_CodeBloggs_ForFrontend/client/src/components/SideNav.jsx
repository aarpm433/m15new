import { useCookies } from "react-cookie";
import { NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";

export default function Sidebar({ horizontal = false }) {
  const [cookies] = useCookies(["user"]);
  let isAdmin = false;

  if (cookies.user) {
    try {
      const userObj =
        typeof cookies.user === "string"
          ? JSON.parse(cookies.user)
          : cookies.user;
      isAdmin = userObj.auth_level === "admin";
    } catch {}
  }

  const baseClass = "btn text-start";
  const activeStyle = { backgroundColor: "#403E6B", color: "white" };
  const inactiveStyle = { backgroundColor: "", color: "#0d6efd" };

  return (
    <Nav
      className={`d-flex ${
        horizontal ? "flex-row justify-content-around w-100" : "flex-column p-3 vh-100"
      }`}
      style={{
        gap: horizontal ? "0" : "0.5rem",
        backgroundColor: "#D3D1EE",
      }}
    >
      <Nav.Item>
        <NavLink
          to="/home"
          className={baseClass}
          style={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
        >
          Home
        </NavLink>
      </Nav.Item>
      <Nav.Item>
        <NavLink
          to="/bloggs"
          className={baseClass}
          style={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
        >
          Bloggs
        </NavLink>
      </Nav.Item>
      <Nav.Item>
        <NavLink
          to="/network"
          className={baseClass}
          style={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
        >
          Network
        </NavLink>
      </Nav.Item>
      {isAdmin && (
        <Nav.Item>
          <NavLink
            to="/admin"
            className={baseClass}
            style={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
          >
            Admin
          </NavLink>
        </Nav.Item>
      )}
    </Nav>
  );
}
