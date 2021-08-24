import "./closeFriend.css";
import { Link } from "react-router-dom";

function CloseFriend({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <Link to={`/profile/${user.username}`}>
      <li className="sidebarFriend">
        <img
          className="sidebarFriendImg"
          src={
            user?.profilePicture
              ? PF + user.profilePicture
              : PF + "person/noAvatar.png"
          }
          alt=""
        />
        <span className="sidebarFriendName">{user.username}</span>
      </li>
    </Link>
  );
}

export default CloseFriend;
