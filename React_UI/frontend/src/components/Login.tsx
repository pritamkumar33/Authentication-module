import React, { useState } from "react";
import { Button, Input, Form, message, Card, Typography, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../Api";

// const Login: React.FC = () => {
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (values: { username: string; password: string }) => {
//     setLoading(true);
//     try {
//       const response = await loginUser(values);
      
//       // Check if response contains a valid token
//       if (response.data && response.data.access_token) {
//         localStorage.setItem("token", response.data.access_token);
//         message.success("Login successful!");
        
//         // Delay navigation slightly for a smooth user experience
//         setTimeout(() => navigate("/dashboard"), 500);
//       } else {
//         throw new Error("Invalid response from server");
//       }
//     } catch (error: any) {
//       console.error("Login error:", error);

//       // Display appropriate error message
//       const errorMsg =
//         error.response?.data?.detail || "Invalid credentials. Please try again.";
//       message.error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };


const { Title, Text } = Typography;

const Login: React.FC = () => {
  // ✅ Ensure useState is properly defined
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();



const handleLogin = async (values: { username: string; password: string }) => {
  setLoading(true);
  setError(null);
  try {
    console.log("Attempting login with:", values); // Debugging

    const response = await loginUser(values);
    console.log("Server response:", response); // Debugging

    if (response && response.access_token) {
      localStorage.setItem("token", response.access_token);
      message.success("Login successful!");
      setTimeout(() => navigate("/dashboard"), 500);
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error: any) {
    console.error("Login error:", error);

    const errorMsg =
      error.response?.data?.detail || "Invalid credentials. Please try again.";
    message.error(errorMsg);
    
    if (error.response?.data?.detail === "Incorrect username or password") {
      setError("Incorrect username or password. Please try again.");
    } else {
      setError("An error occurred. Please try again later.");
    }


  } finally {
    setLoading(false);
  }
};



  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
    <Card className="w-96 p-6 shadow-lg rounded-lg bg-white">
        {/* <Title level={2} className="text-center">Login</Title> */}

        {error && (
          <Alert message={error} type="error" showIcon className="mb-4" />
        )}

      {/* <div className="w-96 p-6 bg-white shadow-lg rounded-lg"> */}
        <h2 className="text-center text-2xl font-semibold mb-6">Login</h2>
        <Form onFinish={handleLogin} layout="vertical">
          <Form.Item 
            label="Username" 
            name="username" 
            rules={[{ required: true, message: "Please enter your username" }]}>
            <Input placeholder="Enter your username" />
          </Form.Item>
          <Form.Item 
            label="Password" 
            name="password" 
            rules={[{ required: true, message: "Please enter your password" }]}>
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Button type="primary" block htmlType="submit" loading={loading}>
            Login
          </Button>

          <div className="mt-4 text-center">
          <Text>Not a member?</Text>  
          <Button 
            type="link" 
            onClick={() => navigate("/register")} 
            className="ml-1"
          >
            Register here
          </Button>
          </div>

        </Form>
        </Card>
      {/* </div> */}
    </div>
  );
};

export default Login;


