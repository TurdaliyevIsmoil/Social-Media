import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../../firebase";
import { db } from "../../../firebase";
export default function SignUp() {
  let history = useNavigate();
  const [values, setvalues] = useState({
    fullname: "",
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
      const createUser = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const newDoc = doc(db, "users", createUser.user.uid);
      setDoc(newDoc, {
        uid: createUser.user.uid,
        name: values.fullname,
        email: values.email,
        password: values.password,
        createdAt: Timestamp.fromDate(new Date()),
        isOnline: true,
      });
      history("/");
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
        <h1>Sign Up</h1>
        <input
          type="text"
          name="fullname"
          value={values.fullname}
          onChange={inputChangeHandler}
          placeholder="Full Name"
        />
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
        <p>Do you not have account yet? <Link to="/auth/signin">Sign In</Link></p>
      </form>
    </div>
  );
}
