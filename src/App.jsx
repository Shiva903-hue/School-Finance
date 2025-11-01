import React,{useState , useEffect} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SupervisorDash from "./components/dashboards/SupervisorDash";
import AddminDash from "./components/dashboards/AddminDash";
import BankerDash from "./components/dashboards/BankerDash";
import UserDash from "./components/dashboards/UserDash";
import Login from "./components/pages/Login";
import school from "./assets/school.png";

  // Splash Screen Component
  function SplashScreen({ isVisible }) {
    return (
      <div
        className={`fixed inset-0 flex flex-col items-center justify-center bg-gray-900 text-white text-3xl transition-opacity duration-700 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="text-5xl font-bold animate-pulse">
          <img src={school} alt="LOGO" className="object-cover  object-center rounded-full h-96 w-96 " />
        </div>
        <p className="mt-4 text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

function App() {




    const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(false);
    }, 2000);

    const hideTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2700);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
       <>
      {showSplash && <SplashScreen isVisible={fadeOut} />}
     {!showSplash && (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/admin" element={<AddminDash/> } />
        <Route path="/user" element={<UserDash />} />
        <Route path="/banker" element={<BankerDash />} />
        <Route path="/supervisor" element={<SupervisorDash/>} />
      </Routes>
    </BrowserRouter>
     )};
    </>
  );
}

export default App;
