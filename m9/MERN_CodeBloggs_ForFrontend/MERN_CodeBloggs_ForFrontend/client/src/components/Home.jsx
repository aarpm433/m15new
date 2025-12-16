import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { Card, Button, Form } from "react-bootstrap";

export default function Home() {
  const [cookies] = useCookies(["user"]);
  const [posts, setPosts] = useState([]);
  const [userStats, setUserStats] = useState({ totalPosts: 0, lastPostDate: null, status: "" });
  const [comments, setComments] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]); 
  const [commentInputs, setCommentInputs] = useState({}); // Track input per post

  let initials = "U";
  let userName = "UserName";
  let userStatus = "Status";
  let userId = null;

  if (cookies.user) {
    try {
      const userObj = typeof cookies.user === "string" ? JSON.parse(cookies.user) : cookies.user;
      userId = userObj._id || userObj.id;
      const firstInitial = userObj.first_name?.[0]?.toUpperCase() || "";
      const lastInitial = userObj.last_name?.[0]?.toUpperCase() || "";
      initials = firstInitial + lastInitial || "U";
      userName = `${userObj.first_name || ""} ${userObj.last_name || ""}`.trim();
      userStatus = userObj.status || "active";
    } catch {}
  }

  useEffect(() => {
    async function fetchData() {
      const postsRes = await fetch("http://localhost:5050/posts");
      const postsData = await postsRes.json();
      const allPosts = postsData.data || [];
      setPosts(allPosts);

      const userPosts = allPosts
        .filter(post => {
          const postUserId = post.user?._id || post.user_id || post.user;
          return String(postUserId) === String(userId);
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // newest first


      setUserStats({
        totalPosts: userPosts.length,
        lastPostDate: userPosts[0]?.createdAt || null,
        status: userStatus,
      });

      const commentsRes = await fetch("http://localhost:5050/comments");
      const commentsData = await commentsRes.json();
      setComments(commentsData.data || []);
    }

    fetchData();
  }, [userId, userStatus, cookies.user]);

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

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId ? { ...post, likes: updatedLikes } : post
        )
      );
    }
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = async (postId) => {
    const content = commentInputs[postId];
    if (!content) return;

    const res = await fetch("http://localhost:5050/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: postId, content, user_id: userId }),
    });

    if (res.ok) {
      const newComment = await res.json();
      setComments(prev => [...prev, newComment.data]);
      setCommentInputs(prev => ({ ...prev, [postId]: "" }));
    }
  };

  return (
    <div className="container my-4">
      {/* User Info */}
      <div className="d-flex align-items-center mb-4">
        <div
          className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold me-3"
          style={{ width: "60px", height: "60px", fontSize: "1.5rem", backgroundColor: "#B1ADFF" }}
        >
          {initials}
        </div>
        <div>
          <div className="text-muted">{userStatus}</div>
          <div className="fw-bold fs-5">{userName}</div>
          <div className="text-muted">
            Posts: {userStats.totalPosts} | Last post:{" "}
            {userStats.lastPostDate ? new Date(userStats.lastPostDate).toLocaleDateString() : "N/A"}
          </div>
        </div>
      </div>

      {/* Posts */}
      <h2 className="mb-3">Posts</h2>
      {posts
        .filter(post => String(post.user?._id || post.user_id || post.user) === String(userId))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(post => {
          const isLiked = likedPosts.includes(post._id);
          return (
            <Card className="mb-3" key={post._id}>
              <Card.Body>
                <Card.Text>{post.content}</Card.Text>

                <div className="d-flex justify-content-between align-items-center small text-muted mb-2">
                  <span>{new Date(post.createdAt).toLocaleString()}</span>
                  <Button
                    size="sm"
                    className="d-flex align-items-center"
                    style={{
                      backgroundColor: isLiked ? "#6E6AB8" : "#fff",
                      borderColor: "#B1ADFF",
                      color: isLiked ? "#fff" : "#6E6AB8",
                    }}
                    onClick={() => handleLike(post._id, post.likes || 0)}
                  >
                    <FaThumbsUp className="me-1" />
                    {post.likes || 0}
                  </Button>
                </div>

                {/* Comments */}
                <div className="mt-3">
                  <div className="fw-semibold mb-1">Comments:</div>
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

                  <Form.Control
                    type="text"
                    placeholder="Add a comment..."
                    value={commentInputs[post._id] || ""}
                    onChange={(e) => handleCommentChange(post._id, e.target.value)}
                    className="mt-2"
                  />
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={() => handleCommentSubmit(post._id)}
                  >
                    Comment
                  </Button>
                </div>
              </Card.Body>
            </Card>
          );
        })}
    </div>
  );
}
