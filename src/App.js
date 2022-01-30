import "./App.css";
import AuthPage from "./pages/auth";
import AuthProvider from "./context/context";
import PrivateRoute from "./components/privateRoute";
import HomePage from "./pages/home";
import { Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./components/auth/signIn";
import SignUp from "./components/auth/signUp";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<PrivateRoute />}>
          <Route path="" element={<HomePage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
        <Route exact path="auth" element={<AuthPage />}>
          <Route path="" exact element={<SignUp />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="*" element={<SignUp />} />
        </Route>
        <Route path="*" element={<Navigate to='/' />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
