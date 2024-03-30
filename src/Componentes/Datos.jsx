import React, { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, Alert, Space, Tooltip, message, Modal, Input } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { actualizarPosicionesAction, deleteNameCuenta, setAllConexiones, setConexionesData, setDataMensBack, setInvitacionesData, setMensajesData, setMensajesDataAll, setNameCuenta } from "../Redux/actions";
import './styles.scss'

export default function Datos() {
  const Papa = require("papaparse");
  const dispatch = useDispatch()
  
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showSuccessMessageCon, setShowSuccessMessageCon] = useState(false);
  const [showSuccessMessageMes, setShowSuccessMessageMes] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [modalVisible, setModalVisible] = useState(false);
  const [nombreCuentaInput, setNombreCuentaInput] = useState("");
  const nombreCuenta = useSelector((state)=> state.nombreCuenta)
  const invitacionesData = useSelector((state) => state.invitacionesData);
  const conexionesData = useSelector((state) => state.conexionesData);
  const mensajesData = useSelector((state) => state.mensajesData);
  const cualificadosData = useSelector((state) => state.cualificadosData);

  const numArchivosCargados = invitacionesData ? invitacionesData.length : 0;
  const conexionesNumArchivosCargados = conexionesData ? conexionesData.length : 0;
  const mensajesnumArchivosCargados = mensajesData ? mensajesData.length : 0;
  
  function actualizarPosiciones() {
  
    if (invitacionesData && cualificadosData) {
      invitacionesData.forEach((invitacion) => {
        invitacion.datos.forEach((dato) => {
          const cualificado = cualificadosData.find((c) => c.name === dato.To);
  
          if (cualificado) {
            dato.position = cualificado.position;
          }
        });
      });
      dispatch(actualizarPosicionesAction(invitacionesData));
    }
  }

  const handleMenuClick = () => {
    if (invitacionesData.length === 0 && nombreCuenta.length === 0 ) {
      setModalVisible(true);
    }
  };
  
  const handleModalOk = () => {
    dispatch(setNameCuenta(nombreCuentaInput))
      messageApi.open({
        type: "success",
        content: "El nombre de la cuenta se cargó correctamente",
      });
    setModalVisible(false);
  };
  const handleModalCancel = () => {
    setModalVisible(false);
  };
  
  
  useEffect(() => {
    // Mueve la llamada a actualizarPosiciones dentro del efecto
    actualizarPosiciones();
  }, [invitacionesData, cualificadosData]);  // Agrega las dependencias necesarias



  const moment = require('moment');

  useEffect(() => {
    if (showSuccessMessage,showSuccessMessageCon,showSuccessMessageMes) {
      messageApi.open({
        type: "success",
        content: "El archivo fue eliminado correctamente",
      });
      setShowSuccessMessage(false);
      setShowSuccessMessageCon(false);
      setShowSuccessMessageMes(false);
    }
  }, [showSuccessMessage,showSuccessMessageCon,showSuccessMessageMes, messageApi]);

  const generateUniqueId = () => {
    return Math.floor(Math.random() * 10000);
  };

  const handleCloseAlert = (id, archivo) => {
    if (archivo === "invitacionesData") {
      const index = invitacionesData.findIndex((item) => item.id === id);
  
      if (index !== -1) {
        // El elemento con el id se encontró en la posición 'index'
        const newData = invitacionesData.filter((item) => item.id !== id);
        // Obtener los nombres del archivo borrado
        const nombresBorrados = invitacionesData[index].datos.map((objeto) => objeto.From);
  
      // Calcular el nombre más común de todos los datos que se borraron
      const contadorNombres = nombresBorrados.reduce((contador, nombre) => {
        contador[nombre] = (contador[nombre] || 0) + 1;
        return contador;
      }, {});
      const nombreMasComunBorrado = Object.keys(contadorNombres).reduce((a, b) =>
        contadorNombres[a] > contadorNombres[b] ? a : b
      );
      dispatch(deleteNameCuenta(nombreMasComunBorrado));
     
      
      dispatch(setInvitacionesData(newData));
    }
      setShowSuccessMessage(true);
    }
  
    if (archivo === "conexionesData") {

      const newData = conexionesData.filter((item) => item.id !== id);
        dispatch(setConexionesData(newData));

      setShowSuccessMessageCon(true);
  
      // Borrar el localStorage de "puestos" cuando se elimina el archivo de conexiones
      localStorage.removeItem("puestos");
    }
  
    if (archivo === "mensajesData") {
  
      const newData = mensajesData.filter((item) => item.id !== id);
  
      dispatch(setMensajesData(newData));

      setShowSuccessMessageMes(true);
    }
  };
  

  function parsearCSV(archivo) {
    return new Promise((resolve, reject) => {
      Papa.parse(archivo, {
        header: true,
        dynamicTyping: true,
        complete: function (results) {
          const encabezados = results.meta.fields;
          const datos = results.data.map((objeto) => {
            if (objeto["Sent At"]) {
              const [rawFecha, hora] = objeto["Sent At"].split(", ");
              const [mes, dia, año] = rawFecha.split("/");
              const fechaFormateada = `${dia.padStart(2, "0")}/${mes.padStart(
                2,
                "0"
              )}/${año}`;
              objeto["Fecha"] = fechaFormateada || "";
              objeto["Hora"] = hora || "";
              delete objeto["Sent At"];
            }
            return objeto;
          });
          resolve({ encabezados, datos });
        },
        error: function (error) {
          reject(error);
        },
      });
    });
  }


  function parsearCSVConexiones(archivo) {
    return new Promise((resolve, reject) => {
      Papa.parse(archivo, {
        header: false,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function (results) {
          const filas = results.data;
          const encabezados = filas[2];
          const datos = filas.slice(3);
  
          const datosFormateados = datos.map((fila) => {
            const filaObjeto = {};
            encabezados.forEach((encabezado, index) => {
              if (encabezado === 'Connected On') {
                const fechaFormateada = moment(fila[index], 'DD MMM YYYY').format('DD/MM/YYYY');
                filaObjeto[encabezado] = fechaFormateada;
              } else {
                filaObjeto[encabezado] = fila[index];
              }
            });
            return filaObjeto;
          });
  
          const nuevoArchivo = {
            id: generateUniqueId(),
            encabezados: encabezados,
            datos: datosFormateados,
          };
  
          resolve(nuevoArchivo);
        },
        error: function (error) {
          reject(error);
        },
      });
    });
  }
  
  

  function handleFileUpload(info) {
    if (info.fileList.length > 0) {
      const archivo = info.fileList[info.fileList.length - 1].originFileObj;
      const nombreArchivo = info.file.name; // Obtener el nombre del archivo subido

 

    
      parsearCSV(archivo)
        .then((resultado) => {

          
          const { datos } = resultado;
          const nombres = datos.map((objeto) => objeto.From);
          const contadorNombres = nombres.reduce((contador, nombre) => {
            contador[nombre] = (contador[nombre] || 0) + 1;
            return contador;
          }, {});
          const nombreMasComun = Object.keys(contadorNombres).reduce((a, b) =>
          contadorNombres[a] > contadorNombres[b] ? a : b
        );

          
          const columnasEsperadas = ['From', 'To'];
          const columnasArchivo = resultado.encabezados;
  
          // Verificar que todas las columnas esperadas estén presentes en el archivo
          if (!columnasEsperadas.every((columna) => columnasArchivo.includes(columna))) {
            messageApi.open({
              type: "error",
              content: `Error: El archivo "${nombreArchivo}" no contiene todas las columnas esperadas.`,
            });
            return;
          }
         

     
          const datosFiltrados = datos.filter(
            (objeto) => objeto.From === nombreMasComun
          );
    
          const nuevoArchivo = {
            id: generateUniqueId(),
            encabezados: resultado.encabezados,
            datos: datosFiltrados,
            nombre: nombreArchivo, // Agregar el nombre del archivo
          };
          dispatch(setNameCuenta(nombreMasComun))

             // Verificar si ya existe un archivo con la misma longitud de datos y el primer objeto de datos igual
        if (invitacionesData.some((archivoExistente) =>
        archivoExistente.datos.length === nuevoArchivo.datos.length &&
        JSON.stringify(archivoExistente.datos[0]) === JSON.stringify(nuevoArchivo.datos[0])
      )) {
        messageApi.open({
          type: "error",
          content: `El archivo "${nombreArchivo}" ya se ha cargado anteriormente.`,
        });
        return;
      }

          const datosFinales = [...invitacionesData, nuevoArchivo];

          dispatch(setInvitacionesData(datosFinales));
  
          messageApi.open({
            type: "success",
            content: `El archivo "${nombreArchivo}" se subió correctamente`,
          });
        })
        .catch((error) => {
          console.error("Error al cargar el archivo CSV:", error);
        });
    }
  }
  

  function handleFileUploadConexiones(info) {
    if (info.fileList.length > 0) {
      const archivo = info.fileList[info.fileList.length - 1].originFileObj;
      const nombreArchivo = info.file.name; // Obtener el nombre del archivo subido
    
      parsearCSVConexiones(archivo)
        .then((resultado) => {
          const { datos } = resultado;
  
          const nuevoArchivo = {
            id: generateUniqueId(),
            encabezados: resultado.encabezados,
            datos: datos,
            nombre: nombreArchivo, // Agregar el nombre del archivo
          };

          const columnasEsperadas = ['Position'];
          const columnasArchivo = resultado.encabezados;
  
          // Verificar que todas las columnas esperadas estén presentes en el archivo
          if (!columnasEsperadas.every((columna) => columnasArchivo.includes(columna))) {
            messageApi.open({
              type: "error",
              content: `Error: El archivo "${nombreArchivo}" no contiene todas las columnas esperadas.`,
            });
            return;
          }

           // Verificar si ya existe un archivo con la misma longitud de datos y el primer objeto de datos igual
        if (conexionesData.some((archivoExistente) =>
        archivoExistente.datos.length === nuevoArchivo.datos.length &&
        JSON.stringify(archivoExistente.datos[0]) === JSON.stringify(nuevoArchivo.datos[0])
      )) {
        messageApi.open({
          type: "error",
          content: `El archivo "${nombreArchivo}" ya se ha cargado anteriormente.`,
        });
        return;
      }
          const datosFinales = [...conexionesData, nuevoArchivo];
  
           // Mapear los datos para crear el nuevo array de objetos
          const nuevoArray = datos.map((contacto) => ({
            nombreCompleto: `${contacto["First Name"]} ${contacto["Last Name"]}`,
            fechaConexion: contacto["Connected On"]
          }));

          dispatch(setAllConexiones(nuevoArray)) //guardo todos los nombres y la fecha de conexion para poder saberlo dsd mensajes
          dispatch(setConexionesData(datosFinales));

          messageApi.open({
            type: "success",
            content: `El archivo "${nombreArchivo}" se subió correctamente`,
          });
          handleMenuClick()
        })
        .catch((error) => {
          console.error("Error al cargar el archivo CSV de conexiones:", error);
        });
    }
  }

  function parsearCSVMensajes(archivo) {
    return new Promise((resolve, reject) => {
      Papa.parse(archivo, {
        header: true, // Tomar la primera fila como encabezados
        dynamicTyping: true,
        skipEmptyLines: true,
        transform: (value, column) => {
          if (column === 'DATE') {
            const parts = value.split(' ');
            const fechaParts = parts[0].split('-');
            const fechaFormateada = `${fechaParts[2]}/${fechaParts[1]}/${fechaParts[0]}`;
            const hora = parts[1];
  
            // Añadir una nueva propiedad 'HORA' al objeto
            return { DATE: fechaFormateada, HORA: hora };
          }
          return value;
        },
        complete: function (results) {
          const encabezados = results.meta.fields; // Tomar los encabezados
          const datos = results.data; // Tomar los datos
  
          resolve({ encabezados, datos });
        },
        error: function (error) {
          reject(error);
        },
      });
    });
  }

  function ordenarMensajesPorFecha(mensajes) {
    return mensajes.sort((a, b) => {
        // Primero, convertimos la fecha de DD/MM/YYYY a YYYY/MM/DD para una correcta interpretación
        const fechaA = a.DATE.DATE.split("/").reverse().join("-");
        const fechaB = b.DATE.DATE.split("/").reverse().join("-");

        // Concatenamos la fecha en formato YYYY-MM-DD con la hora para obtener un datetime completo
        const datetimeA = new Date(fechaA + "T" + a.DATE.HORA);
        const datetimeB = new Date(fechaB + "T" + b.DATE.HORA);

        // Comparamos los datetimes
        return datetimeA - datetimeB;
    });
}


  function handleFileUploadMensajes(info) {
    if (info.fileList.length > 0) {
      const archivo = info.fileList[info.fileList.length - 1].originFileObj;
      const nombreArchivo = info.file.name; // Obtener el nombre del archivo subido
  
      parsearCSVMensajes(archivo)
        .then((resultado) => {
          const { encabezados, datos } = resultado;
          console.log(datos)
          dispatch(setDataMensBack(datos, nombreCuenta[0]))
          dispatch(setMensajesDataAll(datos))

          // Filtrar los datos para incluir solo los mensajes con 'TO' igual a los valores en nombreCuenta
          const mensajesFiltrados = datos.filter(item => nombreCuenta.includes(item.FROM));

              
          const columnasEsperadas = ['FROM', 'TO', 'CONTENT'];
          const columnasArchivo = resultado.encabezados;
  
          // Verificar que todas las columnas esperadas estén presentes en el archivo
          if (!columnasEsperadas.every((columna) => columnasArchivo.includes(columna))) {
            messageApi.open({
              type: "error",
              content: `Error: El archivo "${nombreArchivo}" no contiene todas las columnas esperadas.`,
            });
            return;
          }
  
          // Ordenar los mensajes por fecha de forma ascendente
          const mensajesOrdenados = ordenarMensajesPorFecha(mensajesFiltrados);
  
          // Utilizar un conjunto para realizar un seguimiento de los mensajes únicos basados en 'TO'
          const mensajesUnicosSet = new Set();
  
          // Filtrar y agregar solo los mensajes únicos más antiguos
          const mensajesUnicos = mensajesOrdenados.filter((mensaje) => {
            if (!mensajesUnicosSet.has(mensaje.TO)) {
              mensajesUnicosSet.add(mensaje.TO);
              return true;
            }
            return false;
          });
  
          const nuevoArchivo = {
            id: generateUniqueId(),
            encabezados: encabezados,
            datos: mensajesUnicos, // Usar los mensajes filtrados y únicos
            nombre: nombreArchivo, // Agregar el nombre del archivo
          };

                 // Verificar si ya existe un archivo con la misma longitud de datos y el primer objeto de datos igual
        if (mensajesData.some((archivoExistente) =>
        archivoExistente.datos.length === nuevoArchivo.datos.length &&
        JSON.stringify(archivoExistente.datos[0]) === JSON.stringify(nuevoArchivo.datos[0])
      )) {
        messageApi.open({
          type: "error",
          content: `El archivo "${nombreArchivo}" ya se ha cargado anteriormente.`,
        });
        return;
      }
  
          const datosFinales = [...mensajesData, nuevoArchivo];
  
          dispatch(setMensajesData(datosFinales));

  
          messageApi.open({
            type: "success",
            content: `El archivo "${nombreArchivo}" se subió correctamente`,
          });
        })
        .catch((error) => {
          console.error("Error al cargar el archivo CSV de mensajes:", error);
        });
    }
  }

  
  return (
    <div>
      {/* Subir CSV Invitaciones */}
      <Upload
        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
        listType="picture"
        beforeUpload={() => false}
        onChange={handleFileUpload}
        accept=".csv"
        className="upload-btn"
      >
        <Button icon={<UploadOutlined />} className="btn-subir">Subir CSV Invitaciones</Button>
      </Upload>
  
      {/* Espacio para mostrar archivos subidos */}
      <Space
        direction="vertical"
        style={{
          width: "100%",
          marginTop: "0.5rem",
          marginBottom: "0.5rem"
        }}
      >
        {contextHolder}
  
        {Array.from({ length: numArchivosCargados }, (_, index) => {
          const archivo = invitacionesData[index];
  
          if (archivo) {
            return (
              <Alert
                key={archivo.id}
                message={archivo.nombre}
                type="success"
                closable
                afterClose={() => handleCloseAlert(archivo.id, "invitacionesData")}
                closeIcon={
                  <Tooltip title="Borrar archivo">
                    <DeleteOutlined />
                  </Tooltip>
                }
              />
            );
          }
  
          return null;
        })}
      </Space>
  
      {/* Subir CSV Conexiones */}
      <Upload
        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
        listType="picture"
        beforeUpload={() => false}
        onChange={handleFileUploadConexiones}
        accept=".csv"
        className="upload-btn"
      >
        <Button icon={<UploadOutlined />} className="btn-subir">Subir CSV Conexiones</Button>
      </Upload>
  
      {/* Espacio para mostrar archivos subidos */}
      <Space
        direction="vertical"
        style={{
          width: "100%",
          marginTop: "0.5rem",
          marginBottom: "0.5rem"
        }}
      >
        {contextHolder}
  
        {Array.from({ length: conexionesNumArchivosCargados }, (_, index) => {
          const archivo = conexionesData[index];
  
          if (archivo) {
            return (
              <Alert
                key={archivo.id}
                message={archivo.nombre}
                type="success"
                closable
                afterClose={() => handleCloseAlert(archivo.id, "conexionesData")}
                closeIcon={
                  <Tooltip title="Borrar archivo">
                    <DeleteOutlined />
                  </Tooltip>
                }
              />
            );
          }
  
          return null;
        })}
      </Space>
  
      {/* Subir CSV Mensajes */}
      <Upload
        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
        listType="picture"
        beforeUpload={() => false}
        onChange={handleFileUploadMensajes}
        accept=".csv"
        className="upload-btn"
      >
        <Button icon={<UploadOutlined />} className="btn-subir">Subir CSV Mensajes</Button>
      </Upload>
  
      {/* Espacio para mostrar archivos subidos */}
      <Space
        direction="vertical"
        style={{
          width: "100%",
          marginTop: "0.5rem",
          marginBottom: "0.5rem"
        }}
      >
        {contextHolder}
  
        {Array.from({ length: mensajesnumArchivosCargados }, (_, index) => {
          const archivo = mensajesData[index];
  
          if (archivo) {
            return (
              <Alert
                key={archivo.id}
                message={archivo.nombre}
                type="success"
                closable
                afterClose={() => handleCloseAlert(archivo.id, "mensajesData")}
                closeIcon={
                  <Tooltip title="Borrar archivo">
                    <DeleteOutlined />
                  </Tooltip>
                }
              />
            );
          }
  
          return null;
        })}
      </Space>


      <Modal
        title="Ingrese el nombre de la cuenta"
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <div>
          Notamos que no subiste archivo de Invitaciones, nos indicarias el nombre de la cuenta para poder continuar?
        </div>
        <br/>
        <Input
          placeholder="Nombre de la cuenta"
          value={nombreCuentaInput}
          onChange={(e) => setNombreCuentaInput(e.target.value)}
        />
      <br/> 
      <br/> 
        <Alert message="El nombre tiene que ser tal cual se encuentra en la página de LinkedIn, copiá y pegalo" type="info" />
      </Modal>
    </div>
  );
}