import { useEffect, useState } from "react";
import { Card, Row, Col, Badge } from "react-bootstrap";

export default function Network() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const usersRes = await fetch("http://localhost:5050/users");
      const usersData = await usersRes.json();

      const postsRes = await fetch("http://localhost:5050/posts");
      const postsData = await postsRes.json();

      setUsers(usersData.data || []);
      setPosts(postsData.data || []);
    }
    fetchData();
  }, []);

  const getInitials = (user) => {
    if (!user) return "NA";
    const first = user.first_name?.[0]?.toUpperCase() || "";
    const last = user.last_name?.[0]?.toUpperCase() || "";
    return (first + last) || "NA";
  };

  const getLastPost = (userId) => {
    const userPosts = posts.filter(p => p.user_id === userId);
    if (userPosts.length === 0) return null;
    return userPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  };

  return (
    <div className="container mt-4">
      <Row xs={1} md={2} lg={3} className="g-4">
        {users.map(user => {
          const lastPost = getLastPost(user._id);
          return (
            <Col key={user._id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  {/* User Header */}
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="rounded-circle  text-white d-flex justify-content-center align-items-center me-3"
                      style={{ width: "48px", height: "48px", fontWeight: "bold", backgroundColor: "#B1ADFF" }}
                    >
                      {getInitials(user)}
                    </div>
                    <div>
                      <div className="fw-semibold">{user.first_name} {user.last_name}</div>
                      <div className="text-muted small">{user.email}</div>
                      <Badge bg={user.status === "active" ? "success" : "secondary"} className="mt-1">
                        {user.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Last Post */}
                  <hr />
                  {lastPost ? (
                    <div>
                      <div className="fw-semibold mb-1">Last Post:</div>
                      <p className="mb-1">{lastPost.content}</p>
                      <div className="text-muted small">
                        {new Date(lastPost.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted small">No posts yet</div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
