// actions.js
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
    SET_MENSAJES_NEW
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