import React, { useEffect, useState } from "react";
import { Button, message, Spin, Descriptions,Card } from "antd";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "../Api";



// const Dashboard: React.FC = () => {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUser = async () => {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         message.error("Session expired. Please log in again.");
//         navigate("/login");
//         return;
//       }

//       try {
//         const userData = await getUserDetails();
//         setUser(userData); // Ensure response is correctly stored
//       } catch (error: any) {
//         console.error("User details error:", error);
//         message.error("Failed to fetch user details. Please log in again.");
//         localStorage.removeItem("token");
//         navigate("/login");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     message.success("Logged out successfully!");
//     navigate("/login");
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
//       <div className="w-96 p-6 bg-white shadow-lg rounded-lg text-center">
//         {loading ? (
//           <Spin size="large" />
//         ) : user ? (
//           <>
//             <h2 className="text-2xl font-semibold">Welcome, {user.username} 👋</h2>
//             <Button 
//               type="primary" 
//               danger 
//               className="mt-6 w-full"
//               onClick={handleLogout}
//             >
//               Logout
//             </Button>
//           </>
//         ) : (
//           <p className="text-red-500">Error loading user details.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Session expired. Please log in again.");
        navigate("/login");
        return;
      }
      try {
        const response = await getUserDetails();
        console.log("User data received:", response);
        setUser(response); // Ensure response is correctly stored
      } catch (error: any) {
        console.error("User details error:", error);
        message.error("Failed to fetch user details. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    message.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-[500px] p-6 bg-white shadow-lg rounded-lg text-center">
        {loading ? (
          <Spin size="large" />
        ) : user ? (
          <Card title={`Welcome, ${user.username} 👋`} bordered={false}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
              <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
              <Descriptions.Item label="Contact">{user.contact}</Descriptions.Item>
              <Descriptions.Item label="Address">{user.address}</Descriptions.Item>
            </Descriptions>
            <Button 
              type="primary" 
              danger 
              className="mt-6 w-full"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Card>
        ) : (
          <p className="text-red-500">Error loading user details.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;