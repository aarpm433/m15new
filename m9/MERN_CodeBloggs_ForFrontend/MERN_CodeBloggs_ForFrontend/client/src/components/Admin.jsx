import { useCookies } from "react-cookie";
import { Card, Row, Col, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AdminView() {
  const [cookies] = useCookies(["user"]);
  const navigate = useNavigate();

  useEffect(() => {
    const userObj =
      typeof cookies.user === "string" ? JSON.parse(cookies.user) : cookies.user;

    if (!userObj || userObj.auth_level !== "admin") {
      navigate("/home");
    }
  }, [cookies, navigate]);

  return (
    <Container className="mt-5">
      <Row xs={1} md={2} className="g-4">
        {/* User Manager */}
        <Col>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>User Manager</Card.Title>
              <Card.Text>Manage users here.</Card.Text>
              <Button variant="primary" onClick={() => navigate("/admin/users")}>
                Go to User Manager
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Content Manager */}
        <Col>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>Content Manager</Card.Title>
              <Card.Text>Manage blog posts, comments, and media here.</Card.Text>
              <Button variant="primary" onClick={() => navigate("/admin/content")}> Go to content </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
