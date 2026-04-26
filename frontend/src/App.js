import React, { useEffect, useState } from "react";
import Login from "./Screens/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import mystore from "./redux/store";
import StudentHome from "./Screens/Student/Home";
import FacultyHome from "./Screens/Faculty/Home";
import AdminHome from "./Screens/Admin/Home";
import ForgetPassword from "./Screens/ForgetPassword";
import UpdatePassword from "./Screens/UpdatePassword";

const App = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  };

  return (
    <>
      <Provider store={mystore}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={<Login theme={theme} onToggleTheme={toggleTheme} />}
            />
            <Route
              path="/forget-password"
              element={
                <ForgetPassword theme={theme} onToggleTheme={toggleTheme} />
              }
            />
            <Route
              path="/:type/update-password/:resetId"
              element={
                <UpdatePassword theme={theme} onToggleTheme={toggleTheme} />
              }
            />
            <Route
              path="/student"
              element={<StudentHome theme={theme} onToggleTheme={toggleTheme} />}
            />
            <Route
              path="/faculty"
              element={<FacultyHome theme={theme} onToggleTheme={toggleTheme} />}
            />
            <Route
              path="/admin"
              element={<AdminHome theme={theme} onToggleTheme={toggleTheme} />}
            />
          </Routes>
        </Router>
      </Provider>
    </>
  );
};

export default App;
