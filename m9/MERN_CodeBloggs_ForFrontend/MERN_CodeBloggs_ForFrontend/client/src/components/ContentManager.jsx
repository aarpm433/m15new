import React, { useState, useEffect } from "react";
import { Card, Button, Form, Placeholder } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";

export default function ContentManager() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters + pagination
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectAll, setSelectAll] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const postsRes = await fetch("http://localhost:5050/posts");
      const postsData = await postsRes.json();

      const usersRes = await fetch("http://localhost:5050/users");
      const usersData = await usersRes.json();

      const commentsRes = await fetch("http://localhost:5050/comments");
      const commentsData = await commentsRes.json();

      const userList = Array.isArray(usersData) ? usersData : usersData.data || [];
      setUsers(userList);

      const postList = Array.isArray(postsData) ? postsData : postsData.data || [];
      const postsWithUsers = postList.map((post) => {
        const postUser = userList.find((u) => u._id === post.user_id);
        return { ...post, user: postUser || null };
      });
      setPosts(postsWithUsers);

      setComments(Array.isArray(commentsData) ? commentsData : commentsData.data || []);
    } catch (err) {
      console.error("Failed to fetch content:", err);
      setPosts([]);
      setUsers([]);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (user) => {
    if (!user) return "NA";
    const first = user.first_name?.[0]?.toUpperCase() || "N";
    const last = user.last_name?.[0]?.toUpperCase() || "A";
    return first + last;
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setLoading(true);
    await fetch(`http://localhost:5050/posts/${postId}`, { method: "DELETE" });
    setPosts(posts.filter((p) => p._id !== postId));
    setLoading(false);
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    setLoading(true);
    await fetch(`http://localhost:5050/comments/${commentId}`, { method: "DELETE" });
    setComments(comments.filter((c) => c._id !== commentId));
    setLoading(false);
  };

  // filter posts by date
  const filteredPosts = posts.filter((post) => {
    if (selectAll) return true;
    const postDate = new Date(post.createdAt);
    return (
      (!startDate || postDate >= new Date(startDate)) &&
      (!endDate || postDate <= new Date(endDate))
    );
  });

  // pagination
  const indexOfLast = currentPage * resultsPerPage;
  const indexOfFirst = indexOfLast - resultsPerPage;
  const currentPosts = filteredPosts
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredPosts.length / resultsPerPage);

  return (
    <div className="container my-4">
      <h2 className="mb-4">Posts</h2>

      {/* Filters */}
      <div className="d-flex align-items-center gap-3 mb-3">
        <Form.Check
          type="checkbox"
          label="Select all"
          checked={selectAll}
          onChange={(e) => setSelectAll(e.target.checked)}
        />
        {!selectAll && (
          <>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </>
        )}
      </div>

      {/* Posts */}
      {loading
        ? [...Array(resultsPerPage)].map((_, idx) => (
            <Card className="mb-3" key={idx}>
              <Card.Body>
                <Placeholder as={Card.Text} animation="wave">
                  <Placeholder xs={10} /> <Placeholder xs={8} />
                </Placeholder>

                <div className="d-flex align-items-center mb-2">
                  <Placeholder
                    as="div"
                    animation="wave"
                    className="rounded-circle bg-secondary me-2"
                    style={{ width: "40px", height: "40px" }}
                  />
                  <Placeholder xs={4} />
                </div>

                <Placeholder.Button xs={2} variant="danger" />
              </Card.Body>
            </Card>
          ))
        : currentPosts.map((post) => (
            <Card className="mb-3" key={post._id}>
              <Card.Body>
                <Card.Text>{post.content}</Card.Text>

                <div className="d-flex align-items-center mb-2">
                  <div
                    className="rounded-circle text-white d-flex justify-content-center align-items-center me-2"
                    style={{
                      width: "40px",
                      height: "40px",
                      fontWeight: "bold",
                      backgroundColor: "#B1ADFF",
                    }}
                  >
                    {getInitials(post.user)}
                  </div>
                  <div className="fw-semibold">
                    {post.user?.first_name} {post.user?.last_name}
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center small text-muted mb-2">
                  <span>{new Date(post.createdAt).toLocaleString()}</span>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDeletePost(post._id)}
                  >
                    <FaTrash />
                  </Button>
                </div>

                {/* Comments */}
                <div className="mt-3">
                  <div className="fw-semibold mb-2">Comments:</div>
                  {comments
                    .filter((comment) => comment.post_id === post._id)
                    .map((comment) => (
                      <div
                        key={comment._id}
                        className="ms-3 border-start ps-2 mb-2 d-flex justify-content-between align-items-center"
                      >
                        <span>
                          {comment.content}{" "}
                          <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                            ({new Date(comment.createdAt).toLocaleString()})
                          </span>
                        </span>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          <FaTrash size={14} />
                        </Button>
                      </div>
                    ))}
                </div>
              </Card.Body>
            </Card>
          ))}

          {/* Results per page selector */}
          <div className="d-flex align-items-center gap-2 mb-3">
            <span>Results per page:</span>
            <Form.Select
              size="sm"
              style={{ width: "auto" }}
              value={resultsPerPage}
              onChange={(e) => {
                setResultsPerPage(Number(e.target.value));
                setCurrentPage(1); // reset to first page when changing
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </Form.Select>
          </div>


      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3 gap-2">
          <Button
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </Button>
          <span className="align-self-center">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
