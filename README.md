This is a MERN project with material-ui and socket.io

## Getting Started

If you want run this app, you need to login to [https://cloud.mongodb.com/](https://cloud.mongodb.com/) and setup your database, which takes some time, and then write your key to the `.env` file under the api folder as follow:

```javascript
MONGO_URL = YOUR_ACCESS_KEY
```

If you finish this, you can get start, otherwise you can't run the api server successfully.

**First, run the api server:**

```javasc
cd api
npm i
npm start
```

The api server will run at 9001 port.

**Second, run the socket server:**

```javascript
cd socket
npm i
npm start
```

The ws server will run at 7001 port.

**Finally, run the development server:**

```javascript
cd client
npm i
npm start
```

The development server will run at 8001 port.

Open [http://localhost:8001](http://localhost:8001/) with your browser to see the result.

## Usage

The project is just for practice, I just selectively realize a part of functions of the app.

### Register && Login

Your need two browser to login two users, because the user's info(include logining state) are stored in local storage. If you use one browser, you will redirect to home page of the local storage user. If you need to logout, you need clear the local storage. 

### Visit profile page

If you have followed a man, just clicking his profile picture in your friend list and visit him. If you haven't followed him, you need to access the url by hand: http://localhost:8001/profile/${username}. (Make sure the username exist)

### Follow/UnFollow

After register && login, you need to follow a user. 

You need to access the url by hand: http://localhost:8001/profile/${username}, the username is another user who registered, and you can follow him by click the follow button.

If you follow a user, he will be your friend, but you are not his friend yet, which means you can see his posts in your home page but he can't see your post in his home page. 

### Like/Dislike

You can like or dislike a post no matter who it belongs to.

### Chat

You can start conversations to your friends who you have followed. Just clicking the message icon on the topbar and visit the message page, input the username in the search bar and start the conversation.

