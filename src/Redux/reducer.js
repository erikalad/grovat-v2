// rootReducer.js
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
} from "./actionTypes";
const storedCualificadosData =
  JSON.parse(localStorage.getItem("cualificadosData")) || [];

const initialState = {
  mensajesData: [],
  cualificadosData: storedCualificadosData,
  username: [],
  puestos: { cualificados: [], noCualificados: [] },
  conexionesData: [],
  password: [],
  invitacionesData: [],
  transfer: true,
  mes: "",
  nombreCuenta: [],
  mensajesCualificados: []
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MENSAJES_DATA:
      return { ...state, mensajesData: action.payload };

      case SET_MENSAJES_NEW:
        return { ...state, mensajesCualificados: action.payload };
      
    case TRANSFER_OK:
      return { ...state, transfer: !state.transfer };
    case SET_MES:
      return { ...state, mes: action.payload };

    case NOMBRE_CUENTA:
      return {
        ...state,
        nombreCuenta: state.nombreCuenta.concat(action.payload),
      };

    case SET_CUALIFICADOS_DATA:
      return { ...state, cualificadosData: action.payload };

    case SET_USERNAME:
      const username = localStorage.getItem("username") || [];
      return { ...state, username: username };

    case SET_PUESTOS:
      return { ...state, puestos: action.payload };

    case SET_CONEXIONES_DATA:
      return { ...state, conexionesData: action.payload };

    case SET_PASSWORD:
      const password = JSON.parse(localStorage.getItem("password")) || [];
      return { ...state, password: password };

    case SET_INVITACIONES_DATA:
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
