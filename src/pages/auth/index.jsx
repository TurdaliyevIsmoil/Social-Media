import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../../firebase";
import './style.scss';

export default function AuthPage(props) {
  return (
    <div className="auth-page">
      {!auth.currentUser ? <Outlet/> : <Navigate to="/"/>}
    </div>
  );
}
