import React, { useEffect, useState } from "react";
import { Divider, Tag } from "antd";
import Filtros from "../Componentes/Filtros";
import Estadisticas from "../Graficos/Estadisticas";
import Progreso from "../Graficos/Progreso";

import "./styles.css";
import MetricasDetalle from "./MetricasDetalle";
import TreeMapComponent from "../Graficos/Treemap";
import EstadisticasConexiones from "../Graficos/EstadisticasConexiones";
import ProgresoConexiones from "../Graficos/ProgresoConexiones";
import EstadisticasMensajes from "../Graficos/EstadisticasMensajes";
import ProgresoMensajes from "../Graficos/ProgresoMensajes";
import { useDispatch, useSelector } from "react-redux";
import { setMensajesDataNew } from "../Redux/actions";

export default function Metricas() {
  const invitacionesString = useSelector((state) => state.invitacionesData);
  const archivos = invitacionesString ? invitacionesString : [];
  const cantArchivos = archivos.length
  const conexionesString = useSelector((state) => state.conexionesData);
  const archivosConexiones = conexionesString ? conexionesString : [];
  const mensajesString = useSelector((state) => state.mensajesData);
  const archivosMensajes = mensajesString ? mensajesString : [];
  const cantMens = archivosMensajes.length
  const storedCualificadosData = useSelector((state) => state.cualificadosData);

  const datosConcatenados = archivos.flatMap((archivo) => archivo.datos);
  const datosConcatenadosConexiones = archivosConexiones.flatMap((archivo) => archivo.datos);
  const datosConcatenadosMensajes = archivosMensajes.flatMap((archivo) => archivo.datos);

  const data = { datos: datosConcatenados };
  const dataCon = { datos: datosConcatenadosConexiones };
  const dataMes = { datos: datosConcatenadosMensajes };

  const [datosFiltrados, setDatosFiltrados] = useState(data.datos || []);
  const [datosFiltradoCon, setDatosFiltradosCon] = useState(dataCon.datos || []);
  const [datosFiltradosMes, setDatosFiltradosMes] = useState(dataMes.datos || []);

  const dispatch = useDispatch()

  useEffect(()=>{
      // Iterar sobre cada elemento en datosFiltradosMes
datosFiltradosMes.forEach((itemFiltrado) => {
  // Buscar el elemento correspondiente en storedCualificadosData
  const matchingItem = storedCualificadosData.find((itemCualificado) => {
    return (
      itemCualificado.name === itemFiltrado.TO &&
      itemCualificado.TO === itemFiltrado.name
    );
  });

  // Si se encuentra una coincidencia, agregar propiedades a datosFiltradosMes
  if (matchingItem) {
    itemFiltrado.position = matchingItem.position;
    itemFiltrado.cualificados = matchingItem.cualificados;
  }
});

dispatch(setMensajesDataNew(datosFiltradosMes))

  // Recorre los objetos en data
  datosFiltradoCon.forEach((item) => {
    // Construye el nombre completo
    const fullName = `${item["First Name"]} ${item["Last Name"]}`;

    // Busca si hay un mensaje filtrado con el mismo TO
    const mensajeFiltrado = datosFiltradosMes.find(
      (mensaje) => mensaje.TO === fullName
    );
    // Actualiza la propiedad contactado según las condiciones
    item.contactado = mensajeFiltrado
        ? true
        : false
  });

  },[storedCualificadosData])


  const obtenerMesesFiltrados = () => {
    const meses = datosFiltrados.reduce((acc, item) => {
      const [_, month] = item.Fecha.split("/").map(Number);
      const nombreMes = obtenerNombreMes(month);
      if (!acc.includes(nombreMes)) {
        acc.push(nombreMes);
      }
      return acc;
    }, []);

    return meses.join(", ");
  };

  const obtenerMesEnCurso = () => {
    const mesActual = new Date().getMonth() + 1;
    return obtenerNombreMes(mesActual);
  };

  const obtenerNombreMes = (numeroMes) => {
    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return meses[numeroMes - 1];
  };



  const filterByMonthConexiones = () => {
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1;
    
    const datosMesYAnioActual = dataCon?.datos.filter((item) => {
      if (item && item["Connected On"]) {
        const [day, month, year] = item["Connected On"].split("/").map(Number);
        return month === mesActual && year === 2024; // Filtrar por el año 2024
      }
      return false;
    });
  
    setDatosFiltradosCon(datosMesYAnioActual || []);
  };
  


  
  const filterByMonthMensajes = () => {
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1;
    
    const datosMesYAnioActual = dataMes?.datos.filter((item) => {
      if (item && item.DATE.DATE) {
        const [day, month, year] = item.DATE.DATE.split("/").map(Number);
        return month === mesActual && year === 2024; // Filtrar por el año 2024
      }
      return false;
    });
  
    setDatosFiltradosMes(datosMesYAnioActual || []);
  };
  
  useEffect(() => {
    if (Object.keys(data).length !== 0) {
      filterByMonth();
    }
    if (Object.keys(dataCon).length !== 0) {
      filterByMonthConexiones(); 
    }
    if (Object.keys(dataMes).length !== 0) {
      filterByMonthMensajes(); 
    }
    
    }, []);

    const filterByMonth = () => {
      const fechaActual = new Date();
      const mesActual = fechaActual.getMonth() + 1;
      
      const datosMesYAnioActual = data?.datos.filter((item) => {
        if (item && item.Fecha) {
          const [day, month, year] = item.Fecha.split("/").map(Number);
          return month === mesActual && year === 24; // Filtrar por el año 2024
        }
        return false;
      });
    
      setDatosFiltrados(datosMesYAnioActual || []);
    };
    
  const filterByDate = (selectedDates) => {
    if (!selectedDates || selectedDates.length !== 2) {
      setDatosFiltrados(data?.datos || []);
      setDatosFiltradosCon(dataCon?.datos || []); // Agregar el setDatosFiltradosCon aquí
      setDatosFiltradosMes(dataMes?.datos || []); // Agregar el setDatosFiltradosMes aquí
    } else {
      const [startDay, startMonth, startYear] = selectedDates[0]
        .split("/")
        .map(Number);
      const [endDay, endMonth, endYear] = selectedDates[1]
        .split("/")
        .map(Number);
      const startDate = new Date(startYear + 2000, startMonth - 1, startDay);
      const endDate = new Date(endYear + 2000, endMonth - 1, endDay);
  
      const filteredData = data?.datos.filter((item) => {
        if (item && item.Fecha) {
          const [day, month, year] = item.Fecha.split("/").map(Number);
          const itemDate = new Date(year + 2000, month - 1, day);
          return itemDate >= startDate && itemDate <= endDate;
        }
        return false;
      });
  
      const sortedData = filteredData?.sort((a, b) => {
        const [dayA, monthA, yearA] = a.Fecha.split("/").map(Number);
        const dateA = new Date(yearA + 2000, monthA - 1, dayA);
  
        const [dayB, monthB, yearB] = b.Fecha.split("/").map(Number);
        const dateB = new Date(yearB + 2000, monthB - 1, dayB);
  
        return dateA - dateB;
      });
  
      setDatosFiltrados(sortedData || []);
  
      // Filtrar dataCon
      const filteredDataCon = dataCon?.datos.filter((item) => {
        if (item && item["Connected On"]) {
          const [day, month, year] = item["Connected On"].split("/").map(Number);
          const itemDate = new Date(year, month - 1, day);
          return itemDate >= startDate && itemDate <= endDate;
        }
        return false;
      });
      setDatosFiltradosCon(filteredDataCon || []);
  
      // Filtrar dataMes
      const filteredDataMes = dataMes?.datos.filter((item) => {
        if (item && item.DATE && item.DATE.DATE) {
          const [day, month, year] = item.DATE.DATE.split("/").map(Number);
          const itemDate = new Date(year, month - 1, day);
          return itemDate >= startDate && itemDate <= endDate;
        }
        return false;
      });
      setDatosFiltradosMes(filteredDataMes || []);
    }
  };
  

  const allowedColumns = ["From", "Fecha", "Hora"];

  const primerEntrada =
    data && data.datos && data.datos.length > 0 ? data.datos[0] : {};
  const primerEntradaCon =
  dataCon && dataCon.datos && dataCon.datos.length > 0 ? dataCon.datos[0] : {};
  const primerEntradaMes =
  dataMes && dataMes.datos && dataMes.datos.length > 0 ? dataMes.datos[0] : {};

  const allowedColumnsMes = ["FROM", "CONTENT", "TO", "position", "cualificados"];

  const columnsMes = Object.keys(primerEntradaMes).map((clave, index) => {
    const uniqueValues = Array.from(
      new Set(dataMes.datos.map((item) => item[clave]))
    ).filter(Boolean);
  
    const filters = allowedColumnsMes.includes(clave)
      ? uniqueValues.map((value) => ({ text: value, value: value }))
      : null;
  
 // Modifica la configuración de la columna "cualificados"
if (clave === "cualificados") {
  const cualificadosFilterOptions = [
    { text: 'Cualificado', value: true },
    { text: 'No Cualificado', value: false },
    { text: 'Sin Especificar', value: null },
  ];

  return {
    title: clave,
    dataIndex: clave,
    key: `columna_${index}`,
    filters: cualificadosFilterOptions,
    onFilter: allowedColumnsMes.includes(clave)
      ? (value, record) => {
          if (value === null) {
            // Filtra registros con cualificados null o sin propiedad cualificados
            return record[clave] === null || record[clave] === undefined;
          } else {
            // Filtra registros según el valor booleano
            return record[clave] === value;
          }
        }
      : null,
    render: (text, record) => {
      // Renderiza un Tag de Ant Design basado en el valor booleano
      return record.cualificados === true ? (
        <Tag color="green">Cualificado</Tag>
      ) : record.cualificados === false ? (
        <Tag color="red">No Cualificado</Tag>
      ) : (
        <Tag color="blue">Sin Especificar</Tag>
      );
    },
  };
}
// Modifica la configuración de la columna "DATE"
if (clave === "DATE") {
  return {
    title: clave,
    dataIndex: clave,
    key: `columna_${index}`,
    filters: filters,
    onFilter: allowedColumnsMes.includes(clave)
      ? (value, record) => {
          // Filtra registros por valor de la propiedad "DATE"
          return record[clave].DATE === value;
        }
      : null,
    render: (text, record) => {
      // Renderiza solo la parte de la fecha en un formato deseado
      const fecha = record[clave].DATE;
      return fecha;
    },
    sorter: (a, b) => {
      const aValue = a[clave];
      const bValue = b[clave];
  
      // Accede a la propiedad "DATE" para la clasificación
      const aDate = aValue ? new Date(aValue.DATE).getTime() : 0;
      const bDate = bValue ? new Date(bValue.DATE).getTime() : 0;
      return aDate - bDate;
    },
    sortDirections: ["descend"],
  };
}



  
    // Resto de la configuración de las columnas
    return {
      title: clave,
      dataIndex: clave,
      key: `columna_${index}`,
      filters: filters,
      onFilter: allowedColumnsMes.includes(clave)
        ? (value, record) => record[clave] === value
        : null,
      sorter: (a, b) => {
        const aValue = a[clave];
        const bValue = b[clave];
  
        // Verificar si los valores son definidos antes de acceder a 'length'
        const aLength = aValue ? aValue.length : 0;
        const bLength = bValue ? bValue.length : 0;
  
        return aLength - bLength;
      },
      sortDirections: ["descend"],
    };
  });
  
  const excludedColumnsMes = [
    "CONVERSATION ID",
    "CONVERSATION TITLE",
    "FOLDER",
    "RECIPIENT PROFILE URLS",
    "SENDER PROFILE URL",
    "SUBJECT"
  ];
  
  const filteredColumnsMes = columnsMes.filter(
    (column) => !excludedColumnsMes.includes(column.title)
  );
  
  
  


  const columns = Object.keys(primerEntrada).map((clave, index) => {
    const uniqueValues = Array.from(
      new Set(data.datos.map((item) => item[clave]))
    ).filter(Boolean);

    const filters = allowedColumns.includes(clave)
      ? uniqueValues.map((value) => ({ text: value, value: value }))
      : null;

    return {
      title: clave,
      dataIndex: clave,
      key: `columna_${index}`,
      filters: filters,
      onFilter: allowedColumns.includes(clave)
        ? (value, record) => record[clave] === value
        : null,
        sorter: (a, b) => {
          const aValue = a[clave];
          const bValue = b[clave];
        
          // Verificar si los valores son definidos antes de acceder a 'length'
          const aLength = aValue ? aValue.length : 0;
          const bLength = bValue ? bValue.length : 0;
        
          return aLength - bLength;
        },
      sortDirections: ["descend"],
    };
  });

  const excludedColumns = [
    "Direction",
    "Message",
    "inviterProfileUrl",
    "inviteeProfileUrl",
  ];

  const filteredColumns = columns.filter(
    (column) => !excludedColumns.includes(column.title)
  );


  const columnsConexiones = Object.keys(primerEntradaCon).map((clave, index) => {
    let columnConfig = {};
  
    if (clave === 'First Name' || clave === 'Last Name') {
  
      columnConfig = {
        title: 'Name',
        width: '5%',
        dataIndex: 'Name',
        key: 'Name',
        render: (_, record) => `${record['First Name']} ${record['Last Name']}`,
        sorter: (a, b) => {
          const nameA = `${a['First Name']} ${a['Last Name']}`.toLowerCase();
          const nameB = `${b['First Name']} ${b['Last Name']}`.toLowerCase();
          return nameA.localeCompare(nameB);
        },
    };
  } 
  else if (clave === 'contactado') {
    columnConfig = {
      title: 'Contactado',
      dataIndex: 'contactado',
      width: '5%',
      key: 'contactado',
      render: (contactado) => (
        <Tag color={contactado ? 'green' : 'red'}>
          {contactado ? 'Contactado' : 'No Contactado'}
        </Tag>
      ),
      sorter: (a, b) => (a.contactado ? 1 : 0) - (b.contactado ? 1 : 0),
    };
  }
  else if (clave === 'Connected On') {
    // Columna de fecha con el formato dd/mm/aaaa
    columnConfig = {
      title: 'Connected On',
      dataIndex: 'Connected On',
      width: '5%',
      key: 'Connected On',
      render: (date) => {
        const [day, month, year] = date.split('/');
        return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
      },
      sorter: (a, b) => new Date(a['Connected On']) - new Date(b['Connected On']),
    };
  } else if (clave === 'Position') {
    columnConfig = {
      title: 'Position',
      dataIndex: 'Position',
      width: '5%',
      key: `columna_${index}`,
      sorter: (a, b) => a.Position.localeCompare(b.Position),
    };
  } else if (clave === 'URL') {
    columnConfig = {
      title: 'URL',
      dataIndex: 'URL',
      width: '5%',
      key: `columna_${index}`,
      render: (text, record) => <a href={text} target="_blank" rel="noopener noreferrer">{text}</a>,
    };
  }

  return columnConfig;
});

const columnsConexionesFiltered = columnsConexiones.filter((column, index, self) =>
  index === self.findIndex((c) => c.dataIndex === column.dataIndex) && column.title
);

  const mesesFiltrados = obtenerMesesFiltrados(); 




  return (
    <>
      <Filtros
        onFilterByDate={filterByDate}
        data={data}
      />
      <Divider orientation="left">
        <div className="mes">
          {datosFiltrados.length > 0
            ? obtenerMesesFiltrados()
            : obtenerMesEnCurso()}
        </div>
      </Divider>
      <div className="statidistics-progress">
        <Estadisticas className="statidistics" data={datosFiltrados} cantArchivos={cantArchivos} type='invitaciones'  mesesFiltrados={mesesFiltrados}/>
        <Progreso data={datosFiltrados} mesesFiltrados={mesesFiltrados} cantArchivos={cantArchivos}/>
        <EstadisticasConexiones className="statidistics" data={datosFiltradoCon}/>
        <ProgresoConexiones data={datosFiltradoCon} invitaciones={datosFiltrados}/>
        <EstadisticasMensajes className="statidistics" data={datosFiltradosMes} cantArchivos={cantMens} type='mensajes' mesesFiltrados={mesesFiltrados}/>
        <ProgresoMensajes data={datosFiltradosMes} mesesFiltrados={mesesFiltrados} cantArchivos={cantMens} conexiones={datosFiltradoCon}/>
      </div>
      <div className="contenedor-estadisticas-barra">
      <MetricasDetalle data={datosFiltrados} filteredColumns={filteredColumns} type='invitaciones' />
      <MetricasDetalle data={datosFiltradoCon} filteredColumns={columnsConexionesFiltered} type='conexiones' />
      <MetricasDetalle data={datosFiltradosMes} filteredColumns={filteredColumnsMes} type='mensajes'/>
      </div>
      <div>
        <TreeMapComponent data={datosFiltradoCon}/>
      </div>
    </>
  );
}
