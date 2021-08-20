import Rightbar from "../../components/rightbar";
import Sidebar from "../../components/sidebar";
import Topbar from "../../components/topbar";
import Feed from "../../components/feed";
import './home.css'

function Home() {
  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Sidebar />
        <Feed />
        <Rightbar />
      </div>
      
    </>
  );
}

export default Home;
