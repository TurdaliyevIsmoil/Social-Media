import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import img from "../../images/none-user.webp";
import "./style.scss";

export default function User({ user, select, owner, chat }) {
  const [data, setdata] = useState();

  const id =
    owner > user.uid ? owner + user.uid : user.uid + owner;

  useEffect(() => {
    const getLastMessage = onSnapshot(doc(db, 'lastMessage', id), doc => {
      if (doc.exists) setdata(doc.data())
    })
    return () => getLastMessage();
  }, []);


  return user && (
    <div className={`user-item ${chat === user.uid ? 'selected-user' : ''}`} onClick={e => select(user)}>
      <div className="img-overlay">
        <div className="image img-fluid" style={{ background: `url(${user.img ? user.img : img})` }}>
        </div>
        <div
          className={`is-online ${user.isOnline === true ? "online" : "offline"}`}
        ></div>
      </div>
      <div className="content">
        <div className="name">{user.name}</div>
        {data &&
          <p>
            {data.from === owner ?  "me: " : "message: "}
            {data.media && <img width='20px' src="https://img.icons8.com/material-rounded/24/ffffff/image.png" />}
            {data.message ? data.message : " Photo"}
          </p>
        }
      </div>
      {data && data.from === user.uid && data.unread && <div className="unread-message"></div>}
    </div>
  );
}
