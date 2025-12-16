import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button, Modal, Toast, Dropdown, Form } from "react-bootstrap";
import { useCookies } from "react-cookie";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["session_token", "user"]);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [postContent, setPostContent] = useState("");

  // Parse user info from cookie
  let userName = "User";
  let user_id = null;
  if (cookies.user) {
    try {
      const userObj = typeof cookies.user === "string" ? JSON.parse(cookies.user) : cookies.user;
      user_id = userObj.id ?? userObj._id ?? null;
      userName = userObj.first_name ? userObj.first_name : "User";
    } catch {
      userName = "User";
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5050/session/logout", { method: "POST" });
    } catch (e) {}
    removeCookie("session_token", { path: "/" });
    removeCookie("user", { path: "/" });
    navigate("/login");
  };

  const handlePost = async () => {
    if (!postContent.trim()) return;
    try {
      await fetch("http://localhost:5050/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: postContent, user_id }),
      });
      setPostContent("");
      setShowModal(false);
      // Optionally: refresh posts
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar expand="lg" className="shadow-sm mb-3" style={{ backgroundColor: "#D3D1EE" }}>
        <Container>
          <Navbar.Brand as={NavLink} to="/home" className="d-flex align-items-center">
            <img src="/CBG.png" alt="Logo" width={50} height={50} className="d-inline-block" />
            <img src="/CodeBloggs.png" alt="Brand" width={200} height={50} className="d-inline-block ms-2" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="align-items-center">
              <Button
                size = "lg"
                className="me-2"
                style={{ backgroundColor: "#B1ADFF", borderColor: "#8f8af5ff", color: "#fff" }}
                onClick={() => setShowModal(true)}
              >
                Post
              </Button>
              <Dropdown show={open} onToggle={() => setOpen(!open)}>
                <Dropdown.Toggle variant="secondary" id="dropdown-user" size = "lg">
                  {userName} 
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item
                    onClick={() => {
                      setShowToast(true);
                      setTimeout(() => navigate("/settings"), 1000);
                    }}
                  >
                    Account Settings
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Modal for Post */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">Blogg Something!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={e => { e.preventDefault(); handlePost(); }}>
            <Form.Group controlId="postContent">
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Blogg Something!"
                value={postContent}
                onChange={e => setPostContent(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handlePost}>Post</Button>
        </Modal.Footer>
      </Modal>

      {/* Toast */}
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          minWidth: '250px',
          zIndex: 9999,
        }}
      >
        <Toast.Header>
          <strong className="me-auto">{userName}'s Account</strong>
        </Toast.Header>
        <Toast.Body>Going to settings!</Toast.Body>
      </Toast>
    </>
  );
}
