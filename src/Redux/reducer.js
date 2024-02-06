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
  NOMBRE_CUENTA_BORRAR,
  SET_CUSTOMIZACIONES,
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
  mensajesCualificados: [],
  usuarios:[{
    key:1,
    id_usuario: "2b643f4d-c1f4-4e28-b531-0cca19f638df",
    nombre: "lourdes",
    apellido: "molina",
    email: "lourdes@gmail.com",
    logueado: false,
    usuario: "lourdesmolina",
    contraseña: "sdasd",
    type: "usuario",
    activo: "Activo",
    createdAt: "2024-01-30T00:16:33.741Z",
    updatedAt: "2024-01-30T00:16:33.741Z",
    clienteId: "f88a4b0d-b9bd-46a3-a9a7-4bbcd1172b14"
  }],
  customizaciones:[
    {
      key: '1',
      fieldName: 'Nombre de la Empresa',
      fieldValue: 'MeIC Analitycs',
      editable: false,
    },
    {
      key: '2',
      fieldName: 'Color Principal',
      fieldValue: '#05061b',
      editable: false,
    },
    {
      key: '3',
      fieldName: 'Color Secundario',
      fieldValue: '#ac9978',
      editable: false,
    },
    {
      key: '4',
      fieldName: 'URL del Logo',
      fieldValue: 'https://media.licdn.com/dms/image/D4D0BAQE0mxb1TZiJ7w/company-logo_200_200/0/1706100610750?e=1714003200&v=beta&t=5bX3Q7_4khxM5MToQnjtuj3OwcMX3gHtqrdOIOQ6eOg',
      editable: false,
    },
    {
      key: '5',
      fieldName: 'Tipo de Letra',
      fieldValue: 'Montserrat',
      editable: false,
    },
  ]
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

      case NOMBRE_CUENTA_BORRAR:
        const nombreABorrar = action.payload;
        return {
          ...state,
          nombreCuenta: state.nombreCuenta.filter(nombre => nombre !== nombreABorrar),
        };

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

      case SET_CUSTOMIZACIONES:
        const { fieldName, fieldValue } = action.payload;
        return {
          ...state,
          customizaciones: state.customizaciones.map((item) =>
            item.fieldName === fieldName ? { ...item, fieldValue } : item
          ),
        };

    default:
      return state;
  }
};

export default rootReducer;
