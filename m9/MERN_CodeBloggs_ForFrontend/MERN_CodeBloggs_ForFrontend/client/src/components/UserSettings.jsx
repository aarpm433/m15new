import { useEffect, useState } from "react";
import { Form, Button, Alert, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function UserSettings() {
  const { user } = useAuth();
  const userId = user?._id; // or user?.id depending on backend
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    birthday: "",
    status: "",
    location: "",
    occupation: "",
  });

  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`http://localhost:5050/user/${userId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch user");
        setFormData({
          first_name: data.data.first_name || "",
          last_name: data.data.last_name || "",
          birthday: data.data.birthday
            ? new Date(data.data.birthday).toISOString().split("T")[0]
            : "",
          status: data.data.status || "",
          location: data.data.location || "",
          occupation: data.data.occupation || "",
        });
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    }
    if (userId) fetchUser();
  }, [userId]);

  const handleSave = async () => {
    if (password && password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`http://localhost:5050/user/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ...(password && { password }),
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to update user");

      setSuccess("Profile updated successfully!");
      setShowEditModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4">
      <h2>User Settings</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Birthday</Form.Label>
          <Form.Control
            type="date"
            value={formData.birthday}
            onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Control
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Occupation</Form.Label>
          <Form.Control
            value={formData.occupation}
            onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Repeat Password</Form.Label>
          <Form.Control
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" onClick={() => setShowEditModal(true)}>
          Save Changes
        </Button>
      </Form>

      {/* Confirmation Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to save your profile changes?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
