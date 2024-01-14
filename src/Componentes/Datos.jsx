import React, { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, Alert, Space, Tooltip, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { actualizarPosicionesAction, setConexionesData, setInvitacionesData, setMensajesData } from "../Redux/actions";

export default function Datos() {
  const Papa = require("papaparse");
  const dispatch = useDispatch()
  
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showSuccessMessageCon, setShowSuccessMessageCon] = useState(false);
  const [showSuccessMessageMes, setShowSuccessMessageMes] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

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
  
  actualizarPosiciones();
  
  


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

      const newData = invitacionesData.filter((item) => item.id !== id);
      
      dispatch(setInvitacionesData(newData));
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
  
          const datosFiltrados = datos.filter(
            (objeto) => objeto.From === nombreMasComun
          );
    
          const nuevoArchivo = {
            id: generateUniqueId(),
            encabezados: resultado.encabezados,
            datos: datosFiltrados,
            nombre: nombreArchivo, // Agregar el nombre del archivo
          };

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
  
          const datosFinales = [...conexionesData, nuevoArchivo];
  
          dispatch(setConexionesData(datosFinales));

          messageApi.open({
            type: "success",
            content: `El archivo "${nombreArchivo}" se subió correctamente`,
          });
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
  
  function handleFileUploadMensajes(info) {
    if (info.fileList.length > 0) {
      const archivo = info.fileList[info.fileList.length - 1].originFileObj;
      const nombreArchivo = info.file.name; // Obtener el nombre del archivo subido
    
      parsearCSVMensajes(archivo)
        .then((resultado) => {
          const { encabezados, datos } = resultado;
  
          const nuevoArchivo = {
            id: generateUniqueId(),
            encabezados: encabezados,
            datos: datos,
            nombre: nombreArchivo, // Agregar el nombre del archivo
          };
  
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
      <Upload
        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
        listType="picture"
        beforeUpload={() => false}
        onChange={handleFileUpload}
      >
        <Button icon={<UploadOutlined />}>Subir CSV Invitaciones</Button>
      </Upload>

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
        afterClose={() => handleCloseAlert(archivo.id,"invitacionesData")}
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

      <Upload
        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
        listType="picture"
        beforeUpload={() => false}
        onChange={handleFileUploadConexiones}
      >
        <Button icon={<UploadOutlined />}>Subir CSV Conexiones</Button>
      </Upload>


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
                afterClose={() => handleCloseAlert(archivo.id,"conexionesData")}
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

      <Upload
        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
        listType="picture"
        beforeUpload={() => false}
        onChange={handleFileUploadMensajes}
      >
        <Button icon={<UploadOutlined />}>Subir CSV Mensajes</Button>
      </Upload>


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
                afterClose={() => handleCloseAlert(archivo.id,"mensajesData")}
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


    </div>
  );
}
