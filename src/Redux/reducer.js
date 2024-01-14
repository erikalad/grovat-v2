// rootReducer.js
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
  
  const initialState = {
    mensajesData: [],
    cualificadosData: [],
    username: [],
    puestos: { cualificados: [], noCualificados: [] },
    conexionesData: [],
    password: [],
    invitacionesData: [],
  };
  
  const rootReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_MENSAJES_DATA:
        return { ...state, mensajesData: action.payload};
  
      case SET_CUALIFICADOS_DATA:
        return { ...state, cualificadosData: action.payload };
  
      case SET_USERNAME:
        const username = localStorage.getItem('username') || [];
        return { ...state, username: username };
  
      case SET_PUESTOS:
        const puestos = JSON.parse(localStorage.getItem('puestos')) || [];
        return { ...state, puestos: puestos };
  
      case SET_CONEXIONES_DATA:
        return { ...state, conexionesData: action.payload };
  
      case SET_PASSWORD:
        const password = JSON.parse(localStorage.getItem('password')) || [];
        return { ...state, password: password};

        case SET_INVITACIONES_DATA:
          console.log(action.payload)
          return {
            ...state,
            invitacionesData: action.payload,
          };
        case ACTUALIZAR_POSICIONES:
          return {
            ...state,
            invitacionesData: action.payload,
          };

      default:
        return state;
    }
  };
  
  export default rootReducer;
  