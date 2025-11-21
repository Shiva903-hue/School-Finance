import React,{useState , useEffect} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from "./components/ProtectedRoute";
import SupervisorDash from "./components/dashboards/SupervisorDash";
import AddminDash from "./components/dashboards/AddminDash";
import BankerDash from "./components/dashboards/BankerDash";
import UserDash from "./components/dashboards/UserDash";
import Login from "./components/pages/Login";
import school from "./assets/logo.jpg";

  // Splash Screen Component
  function SplashScreen({ isVisible }) {
    return (
     <div
  className={`fixed inset-0 flex flex-col items-center justify-center
  transition-opacity duration-700 ${isVisible ? "opacity-100" : "opacity-0"}
  bg-gradient-to-b from-[#F9E7C0] via-[#F8D89C] to-[#F3C982]`}
>
  {/* LOGO */}
  <img
    src={school}
    alt="School Logo"
    className="h-56 w-56 object-contain rounded-xl shadow-xl
    animate-[fadeScale_1.2s_ease-out_forwards]"
  />

  {/* LOADING TEXT */}
  {/* <p className="mt-6 text-xl font-semibold text-[#1A3A62] tracking-wide
  animate-pulse">
    Loading...
  </p> */}
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

   
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['Admin']}><AddminDash/></ProtectedRoute>} />
          <Route path="/superviser" element={<ProtectedRoute allowedRoles={['Superviser']}><SupervisorDash/></ProtectedRoute>} />
          <Route path="/banker" element={<ProtectedRoute allowedRoles={['Banker']}><BankerDash/></ProtectedRoute>} />
          <Route path="/user" element={<ProtectedRoute allowedRoles={['User']}><UserDash/></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
     )};
    </>
  );
}

export default App;
