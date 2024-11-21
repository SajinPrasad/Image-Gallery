import { Routes, Route } from "react-router-dom";

import RegistrationForm from "./components/Auth/RegistrationForm";
import LoginForm from "./components/Auth/LoginForm";
import Home from "./components/Gallery/Home";

function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/" element={<LoginForm />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
