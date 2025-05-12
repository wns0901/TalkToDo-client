import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginContextProvider } from "./context/LoginContext.jsx";
import MainPage from "./domains/MainPage/MainPage.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LoginContextProvider>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </LoginContextProvider>
  </BrowserRouter>
);
