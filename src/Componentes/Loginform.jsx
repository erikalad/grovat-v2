import React, { useEffect, useRef } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { fetchData } from "../Redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const formRef = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();
  const username = localStorage.getItem("username");
  const dispatch = useDispatch();
  const errorAxios = useSelector((state)=>state.errorClientes);
  const loadingAxios = useSelector((state)=>state.loadingClientes);
  // const cliente = useSelector((state)=> state.clientes)
  const navigate = useNavigate();
  // useEffect para manejar errores de axios y mostrar mensajes de error

  useEffect(() => {
    if (errorAxios) {
      messageApi.error(errorAxios);
    }
  }, [errorAxios]);

  // useEffect para manejar el estado de loadingAxios
  useEffect(() => {
    if (loadingAxios) {
      messageApi.loading("Iniciando sesión..."); // Mensaje de carga mientras se está iniciando sesión
    } 
  }, [loadingAxios]);

  const onFinish = async (values) => {
    const { username, password } = values;
    // Realizar la solicitud fetch utilizando fetchData

      // Enviar la acción con dispatch
      await dispatch(fetchData(username, password));
       if(username){
        // Redirigir al usuario a la página de dashboard
        navigate('/dashboard');
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
          disabled={loadingAxios}
        >
          INGRESAR
        </Button>
      </Form.Item>
    </Form>
  );
};
export default LoginForm;
