import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { Card, Button, Form } from "react-bootstrap";

export default function Bloggs() {
  const [cookies] = useCookies(["user"]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [newComments, setNewComments] = useState({}); // Track text for each post

  // User info
  let initials = "NA";
  let userName = "User";
  let userId = null;

  if (cookies.user) {
    try {
      const userObj = typeof cookies.user === "string" ? JSON.parse(cookies.user) : cookies.user;
      userId = userObj._id || userObj.id;
      const firstInitial = userObj.first_name?.[0]?.toUpperCase() || "";
      const lastInitial = userObj.last_name?.[0]?.toUpperCase() || "";
      initials = firstInitial + lastInitial || "NA";
      userName = `${userObj.first_name || ""} ${userObj.last_name || ""}`.trim();
    } catch {}
  }

  useEffect(() => {
    async function fetchData() {
      const postsRes = await fetch("http://localhost:5050/posts");
      const postsData = await postsRes.json();
      const userRes = await fetch("http://localhost:5050/users");
      const userData = await userRes.json();

      const postsWithUser = postsData.data.map(post => {
        const postUser = userData.data.find(user => user._id === post.user_id);
        return { ...post, user: postUser || null };
      });
      setPosts(postsWithUser);

      const commentsRes = await fetch("http://localhost:5050/comments");
      const commentsData = await commentsRes.json();
      setComments(commentsData.data || []);
    }
    fetchData();
  }, []);

  const handleLike = async (postId, currentLikes) => {
    const isLiked = likedPosts.includes(postId);
    const updatedLikes = isLiked ? currentLikes - 1 : currentLikes + 1;

    const res = await fetch(`http://localhost:5050/post/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: updatedLikes }),
    });

    if (res.ok) {
      setLikedPosts(prev =>
        isLiked ? prev.filter(id => id !== postId) : [...prev, postId]
      );
      setPosts(prev =>
        prev.map(post => (post._id === postId ? { ...post, likes: updatedLikes } : post))
      );
    }
  };

  const handleCommentChange = (postId, value) => {
    setNewComments(prev => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = async (postId) => {
    const content = newComments[postId]?.trim();
    if (!content) return;

    const res = await fetch("http://localhost:5050/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: postId, content, user_id: userId }),
    });

    if (res.ok) {
      const newComment = await res.json();
      setComments(prev => [...prev, newComment]);
      setNewComments(prev => ({ ...prev, [postId]: "" }));
    }
  };

  const getInitials = user => {
    if (!user) return "NA";
    const first = user.first_name?.[0]?.toUpperCase() || "N";
    const last = user.last_name?.[0]?.toUpperCase() || "A";
    return first + last;
  };

  return (
    // user info
    // nothing there
    // posts list
    <div className="container my-4">
      <h2 className="mb-4">Posts</h2>
      {posts
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(post => (
          <Card className="mb-3" key={post._id}>
            <Card.Body>
              <Card.Text>{post.content}</Card.Text>

              <div className="d-flex align-items-center mb-2">
                <div
                  className="rounded-circle text-white d-flex justify-content-center align-items-center me-2"
                  style={{ width: "40px", height: "40px", fontWeight: "bold", backgroundColor: "#B1ADFF" }}
                >
                  {getInitials(post.user)}
                </div>
                <div className="fw-semibold">
                  {post.user?.first_name} {post.user?.last_name}
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center small text-muted mb-2">
                <span>{new Date(post.createdAt).toLocaleString()}</span>
                <span className="d-flex align-items-center">
                  <Button
                    size="sm"
                    className="d-flex align-items-center"
                    style={{
                      backgroundColor: likedPosts.includes(post._id) ? "#6E6AB8" : "#fff",
                      borderColor: "#B1ADFF",
                      color: likedPosts.includes(post._id) ? "#fff" : "#6E6AB8",
                    }}
                    onClick={() => handleLike(post._id, post.likes || 0)}
                  >
                    <FaThumbsUp className="me-1" />
                    {post.likes || 0}
                  </Button>
                </span>
              </div>

              {/* Comments */}
              <div className="mt-3">
                <div className="fw-semibold mb-2">Comments:</div>
                {comments
                  .filter(comment => comment.post_id === post._id)
                  .map(comment => (
                    <div key={comment._id} className="ms-3 border-start ps-2 mb-2">
                      {comment.content}{" "}
                      <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                        ({new Date(comment.createdAt).toLocaleString()})
                      </span>
                    </div>
                  ))}

                {/* Add comment */}
                <Form
                  onSubmit={e => {
                    e.preventDefault();
                    handleCommentSubmit(post._id);
                  }}
                  className="d-flex mt-2"
                >
                  <Form.Control
                    type="text"
                    placeholder="Write a comment..."
                    value={newComments[post._id] || ""}
                    onChange={e => handleCommentChange(post._id, e.target.value)}
                  />
                  <Button type="submit" className="ms-2">
                    Comment
                  </Button>
                </Form>
              </div>
            </Card.Body>
          </Card>
        ))}
    </div>
  );
}
