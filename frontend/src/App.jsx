import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import RegistrationForm from "./components/Auth/RegistrationForm";
import LoginForm from "./components/Auth/LoginForm";
import Home from "./components/Gallery/Home";
import PrivateRoute from "./components/Common/PrivateRoute";
import PasswordResetForm from "./components/Auth/PasswordResetForm";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/" element={<LoginForm />} />
        <Route path="/password-reset" element={<PasswordResetForm />} />
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
