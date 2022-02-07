import { useEffect, useRef, useState } from "react";
import Moment from "react-moment";
import ImageModal from "../imageModal";
import "./style.scss";

export default function Message({ message, owner }) {
  const [modalimg, setmodalimg] = useState(false);
  const setimg = () => { setmodalimg(!modalimg) }
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
        <>
          <ImageModal open={modalimg} close={setimg} ><img src={message.media} alt=""/></ImageModal>
          <div className="media">
            <img src={message.media} alt="" onClick={setimg} />
          </div>
        </>

      )}
      <p>{message.message}</p>
      <small>
        <Moment fromNow>{message.createdAt.toDate()}</Moment>
      </small>

    </div>
  );
}
