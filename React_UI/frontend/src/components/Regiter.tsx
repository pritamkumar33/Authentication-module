import React, { useState } from "react";
import { Button, Input, Form, message, Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../Api";

const { Title } = Typography;

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (values: {
    username: string;
    email: string;
    password: string;
    contact: string;
    address: string;
  }) => {
    setLoading(true);
    try {
      await registerUser(values);
      message.success("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error: any) {
      console.error("Registration error:", error);
      message.error(error.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-96 p-6 shadow-lg rounded-lg bg-white">
        <Title level={2} className="text-center">Register</Title>

        <Form layout="vertical" onFinish={handleRegister}>
          <Form.Item 
            label="Username" 
            name="username" 
            rules={[{ required: true, message: "Please enter a username!" }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          <Form.Item 
            label="Email" 
            name="email" 
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Enter a valid email!" }
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item 
            label="Password" 
            name="password" 
            rules={[
              { required: true, message: "Please enter a password!" },
              { min: 6, message: "Password must be at least 6 characters!" }
            ]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item 
            label="Contact Number" 
            name="contact" 
            rules={[
              { required: true, message: "Please enter your contact number!" },
              { pattern: /^[0-9]{10}$/, message: "Enter a valid 10-digit number!" }
            ]}
          >
            <Input placeholder="Enter your contact number" maxLength={10} />
          </Form.Item>

          <Form.Item 
            label="Address" 
            name="address" 
            rules={[{ required: true, message: "Please enter your address!" }]}
          >
            <Input.TextArea placeholder="Enter your address" rows={3} />
          </Form.Item>

          <Button type="primary" block htmlType="submit" loading={loading}>
            Register
          </Button>
        </Form>

        <div className="text-center mt-4">
          <span>Already have an account? </span>
          <span 
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login here
          </span>
        </div>
      </Card>
    </div>
  );
};

export default Register;