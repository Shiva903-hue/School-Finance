// import React, { useState,useContext } from "react";
// import bgImg from "../../assets/bg.svg";
// import { AuthContext } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Eye, EyeOff } from "lucide-react";

// export default function Login ()  {

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   // const [error, setError] = useState("");
//    const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   // const handleLogin = async (e) => {
//   //   e.preventDefault();

//   //   try {
//   //     const response = await fetch("http://localhost:8001/api/auth/login", {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify({ email, password }),
//   //     });

//   //     const data = await response.json();
//   //     console.log(data);
//   //     if (!data.success) {
//   //       setError(data.message);
//   //       toast.error("Login failed: " + data.message, {
//   //         position: "top-center",
//   //         autoClose: 2500,
//   //       });
//   //       return;
//   //     }

//   //  // Store role locally
//   //   localStorage.setItem("userRole", data.role);

//   //   toast.success("Login successful!", {
//   //     position: "top-center",
//   //     autoClose: 800,
//   //     onClose: () => {
//   //       switch (data.role) {
//   //         case "Admin":
//   //           navigate("/admin");
//   //           break;
//   //         case "Supervisor":
//   //           navigate("/supervisor");
//   //           break;
//   //         case "banker":
//   //           navigate("/banker");
//   //           break;
//   //         case "User":
//   //           navigate("/user");
//   //           break;
//   //         default:
//   //           navigate("/");
//   //       }
//   //     },
//   //   });

//   // } catch (err) {
//   //   console.error(err);
//   //   toast.error("Server connection failed");
//   //   }
//   // };

// const handleLogin = async (e) => {
//   e.preventDefault();
//   try {
//     const res = await login(email, password);
//     // Redirect based on role
//     if (res.role === 'Admin') navigate('/admin');
//     else if (res.role === 'Superviser') navigate('/supervisor');
//     else if (res.role === 'Banker') navigate('/banker');
//     else navigate('/user');
//   } catch (err) {
//     alert(err.response?.data?.error || 'Login failed');
//   }
// };

//   return (
//     <div
//       className="min-h-screen w-full flex flex-wrap items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 bg-cover bg-center"
//       style={{ backgroundImage: `url(${bgImg})` }}
//     >
//       <ToastContainer />
//       <div className="flex flex-col items-center w-full max-w-md shadow-2xl rounded-2xl bg-white p-10">
//         <h2 className="text-4xl font-extrabold text-blue-700 mb-8 text-center tracking-wide">
//           Login
//         </h2>
//         <form onSubmit={handleLogin} className="w-full space-y-7">
//           {/* Email */}
//           <div>
//             <label className="block text-base font-medium text-blue-800 mb-2">
//               Email <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-blue-50"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-base font-medium text-blue-800 mb-2">
//               Password <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter your password"
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="w-full px-4 py-2 pr-11 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-blue-50"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 focus:outline-none transition-colors"
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//               >
//                 {showPassword ? (
//                   <EyeOff className="w-5 h-5" />
//                 ) : (
//                   <Eye className="w-5 h-5" />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Sign In Button */}
//           <button
//             type="submit"
//             className="w-full bg-blue-600 py-3 rounded-lg text-white font-semibold text-lg hover:bg-blue-700 transition-all"
//           >
//             Sign In
//           </button>
//           {/* {error && (
//             <p className="text-center text-red-600 font-medium">{error}</p>
//           )} */}
//         </form>
//       </div>
//     </div>
//   );
// };




import React, { useState, useContext } from "react";
import bgImg from "../../assets/bg.svg";
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(email, password);
      
      toast.success("Login successful!", {
        position: "top-center",
        autoClose: 800,
      });

      // Redirect based on role (use setTimeout to show toast)
      setTimeout(() => {
        if (res.role === 'Admin') navigate('/admin');
        else if (res.role === 'Superviser') navigate('/superviser'); // Fixed: was /supervisor
        else if (res.role === 'Banker') navigate('/banker');
        else navigate('/user');
      }, 900);

    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Login failed';
      
      toast.error(errorMsg, {
        position: "top-center",
        autoClose: 2500,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-wrap items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <ToastContainer />
      <div className="flex flex-col items-center w-full max-w-md shadow-2xl rounded-2xl bg-white p-10">
        <h2 className="text-4xl font-extrabold text-blue-700 mb-8 text-center tracking-wide">
          Login
        </h2>
        <form onSubmit={handleLogin} className="w-full space-y-7">
          {/* Email */}
          <div>
            <label className="block text-base font-medium text-blue-800 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-blue-50 disabled:opacity-50"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-base font-medium text-blue-800 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-2 pr-11 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-blue-50 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 focus:outline-none transition-colors disabled:opacity-50"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 py-3 rounded-lg text-white font-semibold text-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}