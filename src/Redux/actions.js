// actions.js
import {
    SET_MENSAJES_DATA,
    SET_CUALIFICADOS_DATA,
    SET_USERNAME,
    SET_PUESTOS,
    SET_CONEXIONES_DATA,
    SET_PASSWORD,
    SET_INVITACIONES_DATA,
    ACTUALIZAR_POSICIONES
  } from './actionTypes';
  
  export const setMensajesData = (mensajes) => ({
    type: SET_MENSAJES_DATA,
    payload: mensajes,
  });
  
  export const setCualificadosData = (cualificados) => ({
    type: SET_CUALIFICADOS_DATA,
    patload: cualificados
  });
  
  export const setUsername = () => ({
    type: SET_USERNAME,
  });
  
  export const setPuestos = () => ({
    type: SET_PUESTOS,
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