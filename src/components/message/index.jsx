import { useEffect, useRef } from "react";
import Moment from "react-moment";
import "./style.scss";

export default function Message({ message, owner }) {
  const scroller = useRef();
  useEffect(() => {
    scroller.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);
  return (
    <div
      className={`message-container ${message.from === owner ? "mine" : ""}`}
      ref={scroller}
    >
      {message.media && (
        <div className="media">
          <img src={message.media} alt="" />
        </div>
      )}
      <p>{message.message}</p>
      <small>
        <Moment fromNow>{message.createdAt.toDate()}</Moment>
      </small>
    </div>
  );
}
