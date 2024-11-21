import { Routes, Route } from "react-router-dom";

import RegistrationForm from "./components/Auth/RegistrationForm";
import LoginForm from "./components/Auth/LoginForm";
import Home from "./components/Gallery/Home";
import PrivateRoute from "./components/Common/PrivateRoute";

function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/" element={<LoginForm />} />
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
