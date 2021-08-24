import "./messenger.css";
import Topbar from "../../components/topbar";
import Conversation from "../../components/conversations";
import Message from "../../components/message";
import ChatOnline from "../../components/chatOnline";
import { useContext, useEffect, useRef, useState, Fragment } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";

function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();

  useEffect(() => {
    // 连接 ws 服务器
    socket.current = io("ws://localhost:7001");
    // ws 服务器会根据 receiverId 找到你，告知你 senderId 和 消息内容
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    // 把 arrivalMessage 消息添加到聊天室窗口
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    // 让服务器把 user 信息保存起来，对应唯一一个 socketId
    socket.current.emit("addUser", user._id);
    // 服务器知道一个 user 加进来后，通知你 onlineUsers 数据需要更新
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        user.followings.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [user]);

  // 获取会话列表
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversations/" + user._id);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id]);

  // 获取目前会话窗口的消息
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("/messages/" + currentChat?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  // 处理点击发送信息
  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post("/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  // 滚动到最新消息
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addConvesation = (item) => {
    setConversations([item].concat(conversations));
  };

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            {/* <input placeholder="Search for friends" className="chatMenuInput" /> */}
            <Asynchronous
              user={user}
              addConvesation={addConvesation}
              setCurrentChat={setCurrentChat}
              conversations={conversations}
            />
            {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)} key={c._id}>
                <Conversation conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef} key={m._id}>
                      <Message message={m} own={m.sender === user._id} />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            {onlineUsers.length !== 0 ? (
              <ChatOnline
                onlineUsers={onlineUsers}
                currentId={user._id}
                setCurrentChat={setCurrentChat}
              />
            ) : (
              "No Friends Online"
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Asynchronous({ user, addConvesation, setCurrentChat, conversations }) {
  const [open, setOpen] = useState(false);
  const [friendList, setFriendList] = useState([]);
  const [seletedFriend, setSeledFriend] = useState(null);
  const loading = open && friendList.length === 0;

  useEffect(() => {
    if (seletedFriend && seletedFriend._id) {
      (async () => {
        let existedConv = conversations.find((item) => {
          return item.members.some((item) => item === seletedFriend._id);
        });

        console.log(existedConv);

        if (existedConv) {
          setCurrentChat(existedConv);
          return;
        }

        try {
          const res = await axios.post(`/conversations/`, {
            senderId: user._id,
            receiverId: seletedFriend._id,
          });
          addConvesation(res.data);
          setCurrentChat(res.data);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [seletedFriend, addConvesation, setCurrentChat, user._id, conversations]);

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      try {
        if (user && user._id) {
          const res = await axios.get(`/users/friends/${user._id}`);
          if (active) {
            setFriendList(res.data);
          }
        }
      } catch (error) {
        console.log(error);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading, user]);

  useEffect(() => {
    if (!open) {
      setFriendList([]);
    }
  }, [open]);

  return (
    <Autocomplete
      id="asynchronous-demo"
      style={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => {
        if (option.username === value.username) {
          setSeledFriend(value);
          return true;
        }
      }}
      getOptionLabel={(option) => option.username}
      options={friendList}
      loading={loading}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            label="Your Friends"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </Fragment>
              ),
            }}
          />
        );
      }}
    />
  );
}

export default Messenger;
