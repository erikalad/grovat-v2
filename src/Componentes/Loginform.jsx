import React, { useRef } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input,message } from "antd";

const LoginForm = () => {
  const formRef = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();
  const users = [
    { username: "lourdesaraoz", password: "grovat2024!" },
    { username: "lucasdeleon", password: "grovat2024!" },
    { username: "admin", password: "1234" },
  ];

  const error = (errorMessage) => {
    messageApi.open({
      type: 'error',
      content: errorMessage,
    });
  };

  const onFinish = (values) => {
    const { username, password } = values;

    const validUser = users.find(
      (user) => user.username === username && user.password === password
    );

    if (validUser) {
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);

      window.location.href = "/dashboard";

    } else {
      error("Credenciales incorrectas")
      formRef.current.resetFields();
    }
  };

  return (
    <Form
    ref={formRef}
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: "Por favor ingresá un usuario",
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Usuario"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Por favor ingresá una contraseña",
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Contraseña"
        />
      </Form.Item>
      {contextHolder}

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button boton-login"
        >
          INGRESAR
        </Button>
      </Form.Item>
    </Form>
  );
};
export default LoginForm;
