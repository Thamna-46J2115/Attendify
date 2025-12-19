import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
 
export default function Logout() {
  const navigate = useNavigate();
 
  useEffect(() => {
    const logout = async () => {
      try {
        await axios.post(
          "http://localhost:5000/api/auth/logout",
          {},
          { withCredentials: true }
        );
 
        // حذف التوكن من localStorage لو موجود
        localStorage.removeItem("token");
 
        // تحويل المستخدم لصفحة اللوق ان
        navigate("/login");
      } catch (error) {
        console.error("Logout error", error);
      }
    };
 
    logout();
  }, [navigate]);
 
  return <p>Logging out...</p>;
}