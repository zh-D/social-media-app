import "./sidebar.css";
import {
  Bookmark,
  HelpOutline,
  RssFeed,
  WorkOutline,
  Event,
  Group,
  PlayCircleFilledOutlined,
  School,
  Chat,
} from "@material-ui/icons";
// import { Users } from "../../dummyData";
import CloseFriend from "../closeFriend";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios"

function Sidebar() {
  const { user } = useContext(AuthContext);
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    const fetchFriendList = async () => {
      const res = await axios.get(`/users/friends/${user._id}`);
      setFriendList(res.data);
    };
    fetchFriendList();
  }, [user._id]);

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <RssFeed className="sidebarIcon" />
            <span className="sidebarListItemText">Feed</span>
          </li>
          <li className="sidebarListItem">
            <Chat className="sidebarIcon" />
            <span className="sidebarListItemText">Chats</span>
          </li>
          <li className="sidebarListItem">
            <PlayCircleFilledOutlined className="sidebarIcon" />
            <span className="sidebarListItemText">Videos</span>
          </li>
          <li className="sidebarListItem">
            <Group className="sidebarIcon" />
            <span className="sidebarListItemText">Groups</span>
          </li>
          <li className="sidebarListItem">
            <Bookmark className="sidebarIcon" />
            <span className="sidebarListItemText">Bookmarks</span>
          </li>
          <li className="sidebarListItem">
            <HelpOutline className="sidebarIcon" />
            <span className="sidebarListItemText">Questions</span>
          </li>
          <li className="sidebarListItem">
            <WorkOutline className="sidebarIcon" />
            <span className="sidebarListItemText">Jobs</span>
          </li>
          <li className="sidebarListItem">
            <Event className="sidebarIcon" />
            <span className="sidebarListItemText">Events</span>
          </li>
          <li className="sidebarListItem">
            <School className="sidebarIcon" />
            <span className="sidebarListItemText">Courses</span>
          </li>
        </ul>
        <button className="sidebarButton">Show More</button>
        <hr className="sidebarHr" />
        <ul className="sidebarFriendList">
          {friendList.length !== 0?friendList.map((u) => (
            <CloseFriend key={u._id} user={u} />
          )): "You have no friends in this list, just following them~"}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
