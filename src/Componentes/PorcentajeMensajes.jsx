import React, { useState } from "react";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";

export default function PorcentajeContestacion({ dataTotal }) {
  const [excelData, setExcelData] = useState(null);

  const handleExportExcel = () => {
    const headers = [
      "Conversation ID",
      "Fecha",
      "From",
      "Mensaje",
      // Agrega más campos si es necesario
    ];

    const data = conversacionesFiltradas.map((conversacion) =>
      conversacion.map((mensaje) => [
        mensaje["CONVERSATION ID"],
        mensaje["DATE.DATE"],
        mensaje["FROM"],
        mensaje["CONTENT"],
        // Agrega más campos si es necesario
      ])
    );

    const flattenedData = data.flat();

    const excelDataArray = [headers, ...flattenedData]; // Cambiado el nombre de la variable

    const worksheet = XLSX.utils.aoa_to_sheet(excelDataArray); // Usar el array modificado
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Conversaciones");
    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });
    setExcelData(excelBuffer);
  };

  const downloadExcel = () => {
    const blob = new Blob([excelData], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "conversaciones.xlsx";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };


  const fechaFiltro = useSelector(state => state.fechasFiltro);
  // const nombreCuenta = useSelector(state=>state.nombreCuenta)
  let nombreCuenta = "Carlos Terzano";
  // Objeto para almacenar las conversaciones agrupadas por ID
  const conversacionesAgrupadas = {};

  // Iterar sobre el array de datos
  dataTotal?.forEach((objeto) => {
    const conversationID = objeto["CONVERSATION ID"];

    // Verificar si ya existe una entrada para este ID en el objeto agrupado
    if (conversacionesAgrupadas[conversationID]) {
      // Si existe, simplemente añade el objeto actual a la lista de objetos para este ID
      conversacionesAgrupadas[conversationID].push(objeto);
    } else {
      // Si no existe, crea una nueva entrada en el objeto agrupado con este ID y un array con el objeto actual
      conversacionesAgrupadas[conversationID] = [objeto];
    }
  });

  // Filtramos solo las conversaciones con más de un mensaje
  const conversacionesConMultiplesMensajes = Object.keys(
    conversacionesAgrupadas
  ).reduce((acc, conversationID) => {
    if (conversacionesAgrupadas[conversationID].length > 1) {
      acc[conversationID] = conversacionesAgrupadas[conversationID];
    }
    return acc;
  }, {});


  let conversacionesFiltradas = []

  if (fechaFiltro && fechaFiltro.length >= 2) {
    const [startDay, startMonth, startYear] = fechaFiltro[0].split("/").map(Number);
    const startDate = new Date(startYear + 2000, startMonth - 1, startDay);
    
    const [endDay, endMonth, endYear] = fechaFiltro[1].split("/").map(Number);
    const endDate = new Date(endYear + 2000, endMonth - 1, endDay);
    
      // Filtrar conversaciones por fecha
    conversacionesFiltradas = Object.keys(conversacionesConMultiplesMensajes).reduce((acc, conversationID) => {
    const primerMensaje = conversacionesConMultiplesMensajes[conversationID][0];
    const fechaMensaje = new Date(primerMensaje.DATE.DATE.split("/").reverse().join("-"));
    if (fechaMensaje >= startDate && fechaMensaje <= endDate) {
      acc.push(conversacionesConMultiplesMensajes[conversationID]);
    }

    return acc;
  }, []);

    // Resto del código para filtrar las conversaciones por fecha
  } else {
    // Manejo para el caso en que fechaFiltro no esté definido o no tenga al menos dos elementos
    console.error('fechaFiltro no está definido o no tiene suficientes elementos.');
  }


  // Calculamos el porcentaje de contestación basado en las conversaciones filtradas
let conversacionesIniciadasPorNombreCuenta = 0;
let conversacionesContestadas = 0;

conversacionesFiltradas.forEach((conversacion) => {
  // Verificar si la conversación fue iniciada por nombreCuenta
  if (conversacion[0].FROM === nombreCuenta) {
    conversacionesIniciadasPorNombreCuenta++;
    // Verificar si hubo al menos una respuesta en la conversación
    const tieneRespuesta = conversacion.some(
      (mensaje) => mensaje.FROM !== nombreCuenta
    );
    if (tieneRespuesta) {
      conversacionesContestadas++;
    }
  }
});

  // Calcular el porcentaje de contestación
  const porcentajeContestacion =
    (conversacionesContestadas / conversacionesIniciadasPorNombreCuenta) * 100;

  return (
    <>
        <div>
          Porcentaje de respuesta:{" "}
          {isNaN(porcentajeContestacion) ? "No disponible" : `${porcentajeContestacion.toFixed(2)}%`} ({conversacionesContestadas} de{" "}
          {conversacionesIniciadasPorNombreCuenta} conversaciones iniciadas por{" "}
          {nombreCuenta} fueron contestadas).
        </div> 
        <div>
        <button onClick={handleExportExcel}>Exportar a Excel</button>
        {excelData && (
          <button onClick={downloadExcel}>Descargar Excel</button>
        )}
      </div>
      </>
  );
}
