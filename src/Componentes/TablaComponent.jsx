
import React from "react";
import { Table } from "antd";


export default function TablaReutilizable({ datos, allowedColumns }){
    // Asegúrate de que los datos existen y no están vacíos
    const primerEntrada = datos && datos.length > 0 ? datos[0] : {};
  
    // Genera las columnas basándose en las claves del primer elemento
    const columns = Object.keys(primerEntrada).map((clave, index) => {
      const uniqueValues = Array.from(
        new Set(datos.map((item) => item[clave]))
      ).filter(Boolean);
  
      const filters = allowedColumns.includes(clave)
        ? uniqueValues.map((value) => ({ text: value, value: value }))
        : null;
  
      // Aquí puedes agregar tus condiciones personalizadas para cada columna
  
      return {
        title: clave,
        dataIndex: clave,
        key: `columna_${index}`,
        filters: filters,
        onFilter: allowedColumns.includes(clave)
          ? (value, record) => record[clave] === value
          : null,
      };
    });
  
    return <Table columns={columns} dataSource={datos} />;
  };
  
  