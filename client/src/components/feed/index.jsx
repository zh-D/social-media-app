import { useState, useEffect } from "react";
import Post from "../post";
import Share from "../share";
import axios from "axios";
import "./feed.css";
// import { Posts } from "../../dummyData";

function Feed({ username }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
        ? await axios.get(`/posts/profile/${username}`)
        : await axios.get("/posts/timeline/612091d549d4da02500aa3bc");
      setPosts(res.data);
    };
    fetchPosts();
  }, []);

  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share />
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}

export default Feed;
