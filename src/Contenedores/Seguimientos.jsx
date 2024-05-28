import React, { useEffect, useState } from "react";
import { Table, Tag, Input, Button, DatePicker } from "antd";
import "./styles.scss";
import { useSelector } from "react-redux";
import Conversaciones from "../Componentes/Conversaciones";
import calendly from "./../imagenes/calendly.webp";
import calendlydis from "./../imagenes/calen-dis.webp";
import dayjs from "dayjs";
import MetricasSeguimientos from "./MetricasSeguimientos";
import TablaEstadosCantidades from "./TablaEstadosCantidades";

const { Search } = Input;

const ContactTable = () => {
  const dataMes = useSelector((state) => state.seguimiento);
  const [filteredData, setFilteredData] = useState([]);
  const [uniqueContactarValues, setUniqueContactarValues] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(dayjs().endOf("month"));
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedRowKey, setSelectedRowKey] = useState(null);

  useEffect(() => {
    if (dataMes && dataMes.length > 0) {
      const seguimientoData = dataMes.map((item) => item.seguimiento || {});
      setFilteredData(seguimientoData);
      extractUniqueContactarValues(seguimientoData);
    }
  }, [dataMes]);

  useEffect(() => {
    filterData(searchText, startDate, endDate);
  }, [searchText, startDate, endDate]);

  const extractUniqueContactarValues = (data) => {
    const uniqueValues = new Set([]);
    data.forEach((item) => {
      const contactar = item.contactar;
      if (contactar) {
        if (contactar === "1") {
          uniqueValues.add("Mañana");
        } else {
          uniqueValues.add(contactar);
        }
      }
      if (
        item.mensajeApertura?.noInteresado ||
        item.followUp1?.noInteresado ||
        item.followUp2?.noInteresado ||
        item.followUp3?.noInteresado ||
        item.followUp4?.noInteresado
      ) {
        uniqueValues.add("No interesado");
      }
      if (
        item.mensajeApertura?.propuesta ||
        item.followUp1?.propuesta ||
        item.followUp2?.propuesta ||
        item.followUp3?.propuesta ||
        item.followUp4?.propuesta
      ) {
        uniqueValues.add("Propuesta enviada");
      } else {
        uniqueValues.add("Sin propuesta");
      }
    });
    setUniqueContactarValues(Array.from(uniqueValues));
  };

  const getColorForDays = (days) => {
    if (days === "Hoy") return "green";
    if (days === "Atrasado") return "red";
    if (days === "Mañana") return "yellow";
    if (days === "2") return "grey";
    if (days === "Finalizado") return "blue";
    if (days === "No interesado") return "red";
    if (days === "Propuesta enviada") return "orange";
    if (days === "Sin propuesta") return "purple";
    return "default";
  };

  const handleSearch = (searchText) => {
    setSearchText(searchText);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const filterData = (searchText, startDate, endDate) => {
    let filtered = dataMes.filter((item) => {
      const seguimiento = item.seguimiento;
      if (!seguimiento) return false;
      const searchTextMatch =
        !searchText ||
        (seguimiento.contacto &&
          seguimiento.contacto
            .toLowerCase()
            .includes(searchText.toLowerCase()));
      const dateMatch =
        item.conversacion &&
        item.conversacion.some((message) =>
          isDateInRange(parseDate(message.DATE.DATE), startDate, endDate)
        );
      return searchTextMatch && dateMatch;
    });

    const seguimientoData = filtered.map((item) => item.seguimiento || {});

    setFilteredData(seguimientoData);
  };

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return new Date(`${month}/${day}/${year}`);
  };

  const isDateInRange = (messageDate, startDate, endDate) => {
    if (startDate && endDate) {
      return messageDate >= startDate && messageDate <= endDate;
    } else if (startDate) {
      return messageDate >= startDate;
    } else if (endDate) {
      return messageDate <= endDate;
    }
    return true;
  };

  const clearFilters = () => {
    setSearchText("");
    setStartDate(dayjs().startOf("month"));
    setEndDate(dayjs().endOf("month"));
    const seguimientoData = dataMes.map((item) => item.seguimiento || {});
    setFilteredData(seguimientoData);
  };

  const columns = [
    {
      title: "Contacto",
      key: "contacto",
      width: "16%",
      render: (record) => (
        <a href={record.link} target="_blank" rel="noopener noreferrer">
          {record.contacto}
        </a>
      ),
    },
    {
      title: "Mensaje de Apertura",
      dataIndex: "mensajeApertura",
      key: "mensajeApertura",
      width: "12.5%",
      filters: [
        { text: "Contestó", value: "contesto" },
        { text: "No contestó", value: "noContesto" },
        { text: "Propuesta enviada", value: "propuesta" },
        { text: "Calendly enviado", value: "calendly" },
      ],
      onFilter: (value, record) => {
        if (value === "contesto")
          return (
            record.mensajeApertura.enviado && record.mensajeApertura.contesto
          );
        if (value === "noContesto")
          return (
            record.mensajeApertura.enviado && !record.mensajeApertura.contesto
          );
        if (value === "propuesta")
          return (
            record.mensajeApertura.enviado && record.mensajeApertura.propuesta
          );
        if (value === "calendly")
          return (
            record.mensajeApertura.enviado && record.mensajeApertura.calendly
          );
      },
      render: ({ enviado, contesto, calendly, noInteresado, propuesta }) => (
        <div className="tags-seguimientos">
          {enviado ? (
            <Tag color="green">Enviado</Tag>
          ) : (
            <Tag color="volcano">Pendiente</Tag>
          )}
          {contesto ? (
            <Tag color="blue">Contestó</Tag>
          ) : enviado ? (
            <Tag color="default">
              <div>No contestó</div>
            </Tag>
          ) : null}
          {calendly ? (
            <Tag color="pink">
              <div>
                Calendly
                <br />
                Enviado
              </div>
            </Tag>
          ) : null}
          {noInteresado ? <Tag color="red">No interesado</Tag> : null}
          {propuesta ? <Tag color="orange">Propuesta enviada</Tag> : null}
        </div>
      ),
    },
    ...Array.from({ length: 4 }).flatMap((_, index) => [
      {
        title: `Follow Up ${index + 1}`,
        dataIndex: `followUp${index + 1}`,
        key: `followUp${index + 1}`,
        width: "12.5%",
        filters: [
          { text: "Contestó", value: "contesto" },
          { text: "No contestó", value: "noContesto" },
          { text: "Propuesta enviada", value: "propuesta" },
          { text: "Calendly enviado", value: "calendly" },
        ],
        onFilter: (value, record) => {
          const followUp = record[`followUp${index + 1}`] || {};
          if (value === "contesto")
            return followUp.enviado && followUp.contesto;
          if (value === "noContesto")
            return followUp.enviado && !followUp.contesto;
          if (value === "propuesta")
            return followUp.enviado && followUp.propuesta;
          if (value === "calendly")
            return followUp.enviado && followUp.calendly;
        },
        render: (followUp, record) => {
          const { enviado, contesto, calendly, noInteresado, propuesta } =
            followUp || {};
          const prevKey = index === 0 ? "mensajeApertura" : `followUp${index}`;
          const prevEnviado = record[prevKey]?.enviado;
          if (!prevEnviado) return "-";
          return (
            <div className="tags-seguimientos">
              {enviado ? (
                <Tag color="green">Enviado</Tag>
              ) : (
                <Tag color="volcano">Pendiente</Tag>
              )}
              {contesto ? (
                <Tag color="blue">Contestó</Tag>
              ) : enviado ? (
                <Tag color="default">
                  <div>No contestó</div>
                </Tag>
              ) : null}
              {calendly ? (
                <Tag color="pink">
                  <div>
                    Calendly
                    <br /> Enviado
                  </div>
                </Tag>
              ) : null}
              {noInteresado ? <Tag color="red">No interesado</Tag> : null}
              {propuesta ? <Tag color="orange">Propuesta enviada</Tag> : null}
            </div>
          );
        },
      },
    ]),
    {
      title: "Calendly Enviado",
      dataIndex: "calendlyEnviado",
      key: "calendlyEnviado",
      filters: [
        { text: "Sí", value: true },
        { text: "No", value: false },
      ],
      onFilter: (value, record) => record.calendlyEnviado === value,
      render: (calendlyEnviado) =>
        calendlyEnviado ? (
          <img className="img-calen" src={calendly} />
        ) : (
          <img className="img-calen calen-dis" src={calendlydis} />
        ),
    },
    {
      title: "Contactar",
      dataIndex: "contactar",
      key: "contactar",
      filters: uniqueContactarValues.map((value) => ({
        text: value === "1" ? "Mañana" : value,
        value,
      })),
      onFilter: (value, record) => {
        if (value === "No interesado") {
          return (
            record.mensajeApertura?.noInteresado ||
            record.followUp1?.noInteresado ||
            record.followUp2?.noInteresado ||
            record.followUp3?.noInteresado ||
            record.followUp4?.noInteresado
          );
        }
        if (value === "Propuesta enviada") {
          return (
            record.mensajeApertura?.propuesta ||
            record.followUp1?.propuesta ||
            record.followUp2?.propuesta ||
            record.followUp3?.propuesta ||
            record.followUp4?.propuesta
          );
        }
        if (value === "Sin propuesta") {
          return !(
            record.mensajeApertura?.propuesta ||
            record.followUp1?.propuesta ||
            record.followUp2?.propuesta ||
            record.followUp3?.propuesta ||
            record.followUp4?.propuesta
          );
        }
        return record.contactar === (value === "Mañana" ? "1" : value);
      },
      render: (text, record) => {
        const daysLeft = record.contactar === "1" ? "Mañana" : record.contactar;
        let displayText;
        if (daysLeft === "1") {
          displayText = "1 día";
        } else if (daysLeft === "2") {
          displayText = "2 días";
        } else {
          displayText = daysLeft;
        }
        const color = getColorForDays(daysLeft);
        return <Tag color={color}>{displayText}</Tag>;
      },
    },
  ];

  const handleRowClick = (record) => {
    const matchingItem = dataMes.find(
      (item) => item.seguimiento.key === record.key
    );
    const conversacion = matchingItem ? matchingItem.conversacion : [];
    setSelectedConversation(conversacion);
    setSelectedRowKey(record.key);
  };

  return (
    <>
      <div className="filters">
        <Search
          placeholder="Buscar por nombre de contacto"
          onSearch={handleSearch}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="select-filter"
        />
        <DatePicker.RangePicker
          value={[startDate, endDate]}
          onChange={([start, end]) => {
            handleStartDateChange(start);
            handleEndDateChange(end);
          }}
        />
        <Button type="primary" onClick={clearFilters}>
          Borrar filtros
        </Button>
      </div>
      <div>
        <MetricasSeguimientos data={filteredData} />
      </div>
      <div className="contenedor-tabla-mensajes">
        <div className="table-width">
          <Table
            bordered
            columns={columns}
            dataSource={filteredData}
            scroll={{ y: 450, x: "95vh" }}
            className="table-prosp"
            size="small"
            onRow={(record, rowIndex) => ({
              onClick: () => handleRowClick(record),
              style: {
                cursor: "pointer",
                backgroundColor: record.key === selectedRowKey ? "#e6f7ff" : "",
              },
            })}
            pagination={{
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} de ${total} conversaciones totales`,
            }}
          />
        </div>
        <div className="conver-width">
          <Conversaciones conversacion={selectedConversation} />
        </div>
      </div>
      <TablaEstadosCantidades data={filteredData} />
    </>
  );
};

export default ContactTable;
