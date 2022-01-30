import { useState, useRef } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { updateDoc, doc } from 'firebase/firestore';
import { auth } from "../../../firebase";
import { db } from "../../../firebase";

export default function SignIn(props) {
  let history = useNavigate()
  const [values, setvalues] = useState({
    email: "",
    password: "",
  });
  const inputChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setvalues({
      ...values,
      [name]: value,
    });
  };
  const submitHandler = (event) => {
    event.preventDefault();
    async function sendRequest() {
      const createUser = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const newDoc = doc(db, "users", createUser.user.uid);
      updateDoc(newDoc, {
        isOnline: true
      });
      history('/')
    }
    sendRequest().catch((error) => console.log(error));
  };
  return (
    <div className="form">
      <form
        onSubmit={submitHandler}
        className="d-flex flex-column align-items-center"
      >
        <div className="blur"></div>
        <h1>Sign In</h1>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={inputChangeHandler}
          placeholder="Email"
        />

        <input
          type="password"
          value={values.password}
          name="password"
          onChange={inputChangeHandler}
          placeholder="Password"
        />
        <button type="submit">
          Send
        </button>
        <p>Do you not have account yet? <Link to="/auth/signup">Sign Up</Link></p>
      </form>
    </div>
  );
}
