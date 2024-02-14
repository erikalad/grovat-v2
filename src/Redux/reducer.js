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
  FETCH_DATA_SUCCESS,
  FETCH_DATA_FAILURE,
  FETCH_DATA_START,
  LOGOUT_USER,
  EDIT_USER,
  ADD_USER
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
  //clientes
  clientes: null,
  loadingClientes: false,
  errorClientes: null,
  //usuarios
  usuarios:[],
  //customizaciones
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
  ],
  //funcionalidades:
  funcionalidades:[]
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
      
      //clientes
      case FETCH_DATA_START:
      return {
        ...state,
        loadingClientes: true,
        errorClientes: null,
      };
      case FETCH_DATA_SUCCESS:
        console.log("FETCH_DATA_SUCCESS", action.payload)
      
        const customizacionesTransformadas = [
          {
            key: '1',
            fieldName: 'Nombre de la Empresa',
            fieldValue: action.payload.customizaciones[0].nombreEmpresa,
            editable: false,
          },
          {
            key: '2',
            fieldName: 'Color Principal',
            fieldValue: action.payload.customizaciones[0].colorPrincipal,
            editable: false,
          },
          {
            key: '3',
            fieldName: 'Color Secundario',
            fieldValue: action.payload.customizaciones[0].colorSecundario,
            editable: false,
          },
          {
            key: '4',
            fieldName: 'URL del Logo',
            fieldValue: action.payload.customizaciones[0].logoImg,
            editable: false,
          },
          {
            key: '5',
            fieldName: 'Tipo de Letra',
            fieldValue: action.payload.customizaciones[0].tipoLetra,
            editable: false,
          },
        ]

        console.log(action.payload.customizaciones[0].colorSecundario)
        return {
          ...state,
          clientes: action.payload,
          loadingClientes: false,
          errorClientes: null,
          usuarios: action.payload.usuarios,
          customizaciones: customizacionesTransformadas,
          // funcionalidades: action.payload.funcionalidades
        };
      
    case FETCH_DATA_FAILURE:
      return {
        ...state,
        errorClientes: action.payload,
        loadingClientes: false,
      };

    case LOGOUT_USER:
      localStorage.removeItem("username");
      localStorage.removeItem("password");
      localStorage.removeItem('usuarioLogueado');
      return{
        ...state,
        clientes: null
      }

      case EDIT_USER:
        localStorage.setItem('usuarioLogueado', JSON.stringify(action.payload.usuario));
        return state

      case ADD_USER:
        return {
          ...state,
          usuarios: [...state.usuarios, action.payload.usuario]
        };

    default:
      return state;
  }
};

export default rootReducer;
