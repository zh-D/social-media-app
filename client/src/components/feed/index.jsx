import { useState, useEffect, useContext } from "react";
import Post from "../post";
import Share from "../share";
import axios from "axios";
import "./feed.css";
import { AuthContext } from "../../context/AuthContext";
// import { Posts } from "../../dummyData";

function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
        ? await axios.get(`/posts/profile/${username}`)
        : await axios.get(`/posts/timeline/${user._id}`);
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [username, user._id]);

  const deleteHandler = async (id) => {
    try {
      console.log(user._id);
      await axios.delete(`/posts/${id}`, { data: { userId: user._id } });
      setPosts(posts.filter((p) => p._id !== id));
    } catch (error) {
      alert("You can't delete other's posts")
      console.log(error);
    }
  };

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user.username) && (
          <Share
            addPost={(item) => {
              setPosts([item].concat(posts));
            }}
          />
        )}
        <Posts posts={posts} deleteHandler={deleteHandler} />
      </div>
    </div>
  );
}

function Posts({ posts, deleteHandler }) {
  return (
    <>
      {posts.map((p) => (
        <Post key={p._id} post={p} deleteHandler={deleteHandler} />
      ))}
    </>
  );
}

export default Feed;
