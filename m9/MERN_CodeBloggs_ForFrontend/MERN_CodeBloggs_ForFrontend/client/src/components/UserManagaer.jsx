import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Pagination,
  Modal,
  Badge,
  Placeholder,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchFirst, setSearchFirst] = useState("");
  const [searchLast, setSearchLast] = useState("");
  const [sortField, setSortField] = useState("first_name");
  const [page, setPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(6);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const navigate = useNavigate();

  // Fetch all users
  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5050/users");
        const data = await res.json();
        const usersArray = Array.isArray(data.data) ? data.data : [];
        setUsers(usersArray);
        setFilteredUsers(usersArray);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Search + sort
  useEffect(() => {
    let filtered = users.filter(
      (u) =>
        u.first_name.toLowerCase().includes(searchFirst.toLowerCase()) &&
        u.last_name.toLowerCase().includes(searchLast.toLowerCase())
    );
    filtered.sort((a, b) => a[sortField].localeCompare(b[sortField]));
    setFilteredUsers(filtered);
    setPage(1);
  }, [searchFirst, searchLast, users, sortField]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const displayedUsers = filteredUsers.slice(
    (page - 1) * usersPerPage,
    page * usersPerPage
  );

  // Delete user
  const handleDelete = async () => {
    if (!selectedUser) return;
    setLoading(true);
    await fetch(`http://localhost:5050/user/${selectedUser._id}`, {
      method: "DELETE",
    });
    setUsers(users.filter((u) => u._id !== selectedUser._id));
    setShowDeleteModal(false);
    setSelectedUser(null);
    setLoading(false);
  };

  // Edit user
  const handleEdit = () => {
    if (!selectedUser) return;
    navigate(`/users/${selectedUser._id}`);
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const getInitials = (user) => {
    if (!user) return "NA";
    const first = user.first_name?.[0]?.toUpperCase() || "";
    const last = user.last_name?.[0]?.toUpperCase() || "";
    return (first + last) || "NA";
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">User Manager</h2>

      {/* Search + Filters */}
      <div className="d-flex flex-wrap mb-3 gap-2">
        <Form.Control
          type="text"
          placeholder="Search by first name..."
          value={searchFirst}
          onChange={(e) => setSearchFirst(e.target.value)}
          style={{ maxWidth: "200px" }}
        />
        <Form.Control
          type="text"
          placeholder="Search by last name..."
          value={searchLast}
          onChange={(e) => setSearchLast(e.target.value)}
          style={{ maxWidth: "200px" }}
        />
        <Button
          variant="secondary"
          onClick={() => {
            setSearchFirst("");
            setSearchLast("");
          }}
        >
          Clear
        </Button>
        <Form.Select
          value={usersPerPage}
          onChange={(e) => setUsersPerPage(Number(e.target.value))}
          style={{ maxWidth: "150px" }}
        >
          {[3, 6, 9, 12].map((n) => (
            <option key={n} value={n}>
              {n} per page
            </option>
          ))}
        </Form.Select>
        <Form.Select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          style={{ maxWidth: "200px" }}
        >
          <option value="first_name">Sort by First Name</option>
          <option value="last_name">Sort by Last Name</option>
        </Form.Select>
      </div>

      {/* User Cards or Skeletons */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {loading
          ? [...Array(usersPerPage)].map((_, idx) => (
              <Col key={idx}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <Placeholder
                        as="div"
                        animation="wave"
                        className="rounded-circle me-3 bg-secondary"
                        style={{ width: "48px", height: "48px" }}
                      />
                      <div>
                        <Placeholder as="div" animation="wave">
                          <Placeholder xs={6} />
                        </Placeholder>
                        <Placeholder as="div" animation="wave">
                          <Placeholder xs={8} />
                        </Placeholder>
                      </div>
                    </div>
                    <Placeholder.Button variant="secondary" xs={4} className="me-2" />
                    <Placeholder.Button variant="danger" xs={4} />
                  </Card.Body>
                </Card>
              </Col>
            ))
          : displayedUsers.map((user) => (
              <Col key={user._id}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <div
                        className="rounded-circle text-white d-flex justify-content-center align-items-center me-3"
                        style={{
                          width: "48px",
                          height: "48px",
                          fontWeight: "bold",
                          backgroundColor: "#B1ADFF",
                        }}
                      >
                        {getInitials(user)}
                      </div>
                      <div>
                        <div className="fw-semibold">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-muted small">{user.email}</div>
                        <Badge
                          bg={user.status === "active" ? "success" : "secondary"}
                          className="mt-1"
                        >
                          {user.status || "unknown"}
                        </Badge>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="d-flex justify-content-between mt-3">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
      </Row>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i}
                active={i + 1 === page}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>
            {selectedUser?.first_name} {selectedUser?.last_name}
          </strong>
          ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you want to edit{" "}
          <strong>
            {selectedUser?.first_name} {selectedUser?.last_name}
          </strong>
          ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Edit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
