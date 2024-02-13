// actions.js
import axios from 'axios';
import {
    SET_MENSAJES_DATA,
    SET_CUALIFICADOS_DATA,
    SET_USERNAME,
    SET_PUESTOS,
    SET_CONEXIONES_DATA,
    SET_PASSWORD,
    SET_INVITACIONES_DATA,
    ACTUALIZAR_POSICIONES,
    TRANSFER_OK,
    SET_MES,
    NOMBRE_CUENTA,
    SET_MENSAJES_NEW,
    NOMBRE_CUENTA_BORRAR,
    SET_CUSTOMIZACIONES,
    FETCH_DATA_SUCCESS,
    FETCH_DATA_FAILURE,
    FETCH_DATA_START,
    FETCH_DATA_END,
    LOGOUT_USER
  } from './actionTypes';
  
  export const setMensajesData = (mensajes) => ({
    type: SET_MENSAJES_DATA,
    payload: mensajes,
  });

  export const setMensajesDataNew = (mensajes) => ({
    type : SET_MENSAJES_NEW,
    payload : mensajes
  })

  export const transferOk = () => ({
    type: TRANSFER_OK,
  });

  export const setNameCuenta = (nombre) => ({
    type: NOMBRE_CUENTA,
    payload: nombre
  });

  export const deleteNameCuenta = (nombre) => ({
    type: NOMBRE_CUENTA_BORRAR,
    payload: nombre
  });

  export const setMes = (mes) => ({
    type: SET_MES,
    payload: mes,
  });
  
  export const setCualificadosData = (cualificados) => ({
    type: SET_CUALIFICADOS_DATA,
    payload: cualificados
  });
  
  export const setUsername = () => ({
    type: SET_USERNAME,
  });
  
  export const setPuestos = (puestos) => ({
    type: SET_PUESTOS,
    payload: puestos
  });
  
  export const setConexionesData = (conexiones) => ({
    type: SET_CONEXIONES_DATA,
    payload: conexiones,
  });
  
  export const setPassword = () => ({
    type: SET_PASSWORD,
  });
  
  export const setInvitacionesData = (invitaciones) => ({
    type: SET_INVITACIONES_DATA,
    payload: invitaciones,
  });

  export const actualizarPosicionesAction = (invitaciones) => ({
    type: ACTUALIZAR_POSICIONES,
    payload: invitaciones,
  });

export const setCustomizaciones = (fieldName, fieldValue) => ({
  type: SET_CUSTOMIZACIONES,
  payload: { fieldName, fieldValue },
});

export const fetchData = (usuario, contraseña) => {
  return async (dispatch) => {
    try {
      dispatch({ type: FETCH_DATA_START }); // Inicia el estado de carga

      let response;

      // Verificar si hay un usuario logueado en el localStorage
      const usuarioLogueadoString = localStorage.getItem('usuarioLogueado');
      const userLogueado = localStorage.getItem("username", usuario);
      const contraLogueada = localStorage.getItem("password", contraseña);

      console.log(usuarioLogueadoString && usuario === userLogueado && contraseña === contraLogueada)
      if (usuarioLogueadoString && usuario === userLogueado && contraseña === contraLogueada) {
        console.log("entre?")
        // Si hay un usuario logueado, extraer el clienteId
        const usuarioLogueado = JSON.parse(usuarioLogueadoString);
        const clienteId = usuarioLogueado.clienteId;

        // Realizar una solicitud GET para obtener los datos del cliente
        response = await axios.get(`https://meicanalitycs.onrender.com/clienteid/${clienteId}`);
      } else {
      
      response = await axios.post('https://meicanalitycs.onrender.com/login', { usuario, contraseña });
      console.log(response.data)
      
      // Filtrar el array de usuarios para encontrar el usuario con el que se ha iniciado sesión
      const usuarioLogueado = response.data.usuarios.find(user => user.usuario === usuario);
      console.log(usuarioLogueado)
      
      // Guardar únicamente el usuario encontrado en el local storage
      localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioLogueado));
      localStorage.setItem("username", usuario);
      localStorage.setItem("password", contraseña);
      }
  
      dispatch({ type: FETCH_DATA_SUCCESS, payload: response.data }); // Envía los datos al store
    } catch (error) {
      dispatch({ type: FETCH_DATA_FAILURE, payload: error.response.data.error }); // Maneja los errores
    } finally {
      dispatch({ type: FETCH_DATA_END }); // Finaliza el estado de carga, independientemente de si la solicitud fue exitosa o no
    }
  };
};


export const logoutUser = (idUsuario, email, user) => {
  return async (dispatch) => {
    try {
      // Enviar solicitud POST para desloguear al usuario
      const response = await axios.patch("https://meicanalitycs.onrender.com/usuario/" + idUsuario , { logueado: false , email: email, usuario:user})

      // Verificar si la solicitud fue exitosa
      if (response.status === 200) {
        console.log(response.data)
        dispatch({ type: LOGOUT_USER });
      } else {
        console.error("Error al desloguear al usuario:", response.statusText);
      }
    } catch (error) {
      console.error("Error para desloguear al usuario:", error);
    }
  };
};


