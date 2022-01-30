import React, { useEffect, useState } from "react";
import {
  where,
  collection,
  query,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../firebase";
import "./style.scss";
import User from "../../components/user";
import MessageForm from "../../components/messageForm";
import Message from "../../components/message";
import { async } from "@firebase/util";
import UserInf from "../../components/userInf";
import { signOut } from "firebase/auth";
import FullUserDescrition from "../../components/fullUserDescription";
import EditProfilePhoto from "../../components/profile";
import Profile from "../../components/profile";

export default function HomePage() {

  window.onbeforeunload = function () {
    return offlineHandler();
  };

  const [users, setusers] = useState([]);
  const [chat, setchat] = useState();
  const [value, setvalue] = useState('');
  const [img, setimg] = useState();
  const [messages, setmessages] = useState([]);
  const [modal, setmodal] = useState(false);

  const owner = auth.currentUser.uid;
  let friend = chat ? chat.uid : null;

  useEffect(async () => {
    // Make online
    await updateDoc(doc(db, "users", owner), {
      isOnline: true,
    });
    // getting contacts
    const usersCollection = collection(db, "users");
    const filterUsers = query(
      usersCollection,
      where("uid", "not-in", [owner])
    );
    const getUsers = onSnapshot(filterUsers, (snapshot) => {
      let users = [];
      snapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setusers(users);
    });
    return () => {
      // unsubscribe
      getUsers()
    };
  }, []);

  // Make offline when closing tab or browser
  const offlineHandler = async () => {
    await updateDoc(doc(db, "users", owner), {
      isOnline: Timestamp.fromDate(new Date()),
    });
  }

  // getting selected chat from contacts
  const selectChat = async (user) => {
    // set current chat
    setchat(user);
    const secondUser = user.uid;
    // get chat id from database (firestore)
    const id =
      owner > secondUser ? owner + secondUser : secondUser + owner;
    const msgRef = collection(db, "messages", id, "chat");
    const sortQuery = query(msgRef, orderBy("createdAt", "asc"));
    // get chat messages
    const getMessage = onSnapshot(sortQuery, (snap) => {
      let messages = [];
      snap.forEach((doc) => messages.push(doc.data()));
      setmessages(messages);
    });

    // setting anread to false, becouse chat is seen on selected
    const snap = await getDoc(doc(db, 'lastMessage', id));
    if (snap.data() && snap.data().from !== owner) {
      await updateDoc(doc(db, 'lastMessage', id), { unread: false })
    }

    return () => { getMessage(); snap() };
  };

  // handle submit message or media
  const handleSubmit = async () => {
    // chat id
    const id =
      owner > friend ? owner + friend : friend + owner;
    // if available media URL will be exist else null
    let url;
    const text = value.slice();
    // setting input to empty(on submit it will work on server not in UI)
    setvalue("");
    if (img) {
      const imageRef = ref(
        storage,
        `images/${new Date().getTime()}-${img.name}`
      );
      const snap = await uploadBytes(imageRef, img);
      const dlurl = await getDownloadURL(ref(storage, snap.metadata.fullPath));
      url = dlurl;
    }
    setimg("");
    // if text none and media none it will give alert
    if (!text && !url) {
      return alert("Check informations!");
    }
    // setup chat message to databse
    await addDoc(collection(db, "messages", id, "chat"), {
      message: text,
      from: owner,
      to: friend,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
    });
    // setting last message to new message
    await setDoc(doc(db, "lastMessage", id), {
      message: text,
      from: owner,
      to: friend,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
      unread: true,
    });
  };

  const logout = async () => {
    await updateDoc(doc(db, "users", owner), {
      isOnline: Timestamp.fromDate(new Date()),
    });
    await signOut(auth);
  };

  return (
    <>
      <div className="container-fl home">
        <div className="chat-container">
          <div className="users-list">
            <div className="title">
              Contacts
              <div class="dropdown">
                <a className="d-flex align-items-center" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                  <img width='25px' src="https://img.icons8.com/ios-filled/50/ffffff/menu--v1.png" />
                </a>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                  <li><a class="dropdown-item" onClick={()=>setmodal(!modal)}>Profile</a></li>
                  <li><a class="dropdown-item" onClick={logout}>Logout</a></li>
                </ul>
              </div>
            </div>
            {users.map((user) => (
              <User user={user} key={user.uid} owner={owner} select={selectChat} chat={chat?.uid} />
            ))}
          </div>


          <div className="empty-chat">

            {chat ? <>
              <div className="chat">
                <UserInf user={chat} />
                <div className="message">
                  {messages
                    ? messages.map((message) => (
                      <Message message={message} key={message.createdAt} owner={owner} />
                    ))
                    : null}
                </div>
                <div className="form">
                  <MessageForm
                    value={value}
                    setvalue={setvalue}
                    handleSubmit={handleSubmit}
                    setimg={setimg}
                  />
                </div>
              </div>

            </> : <div className="empty-message">
              <p>
              Select chat...
              </p>
              </div>
            }
          </div>
          <div className="user">
            {chat && <FullUserDescrition user={chat}/> }
          </div>
        </div>
      </div>

      {modal && (
        <Profile
          close={(e) => setmodal(!modal)}
        />
      )}
    </>

  );
}
