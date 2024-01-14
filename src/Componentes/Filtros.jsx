import React, { Fragment, useState } from "react";
import { Button, Collapse, DatePicker, Modal } from "antd";
import locale from "antd/lib/date-picker/locale/es_ES";
import dayjs from 'dayjs';
import 'dayjs/locale/es'; 
import './styles.css'
import TransferCualificados from "./Transfer";
import { useSelector } from "react-redux";

const { Panel } = Collapse;
const { RangePicker } = DatePicker;

export default function Filtros({ onFilterByDate, data, recibirMes, actualizacionCuaificados }) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const conexiones = useSelector((state) => state.conexionesData);
  const positions = [...new Set(conexiones[0]?.datos.map((dato) => dato.Position))];
  const dataTabla = positions.map((position, index) => ({ position, key: index }));
  const handleOk = () => {
    setIsModalOpen(false);
    actualizacionCuaificados()
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  dayjs.locale('es'); 
  const firstDayOfMonth = dayjs().startOf('month');
  const today = dayjs();
  const nombreDelMes = firstDayOfMonth.format('MMMM');

  recibirMes(nombreDelMes)

  const handleDateChange = (dates, dateStrings) => {
    const formattedDates = dateStrings.map((date) => {
      const [year, month, day] = date.split("-").map((item) => item.slice(-2));
      return `${day}/${month}/${year}`;
    });
    onFilterByDate(formattedDates);
  };

  const prepareDataForTransfer = () => {
    const cualificadosData = dataTabla.map(item => {
      const cualificadoInfo = conexiones[0]?.datos.find(dato => dato.Position === item.position);
      if (cualificadoInfo) {
        return {
          ...item,
          name: `${cualificadoInfo["First Name"]} ${cualificadoInfo["Last Name"]}`,
        };
      }
      return item;
    });

    return cualificadosData;
  };


  return (
    <Fragment>
    <Collapse accordion defaultActiveKey={1}>
      <Panel header="Filtros" key="1">
        <p>Selecciona un rango de fechas:</p>
        {Object.keys(data).length === 0 ? (
          <RangePicker disabled locale={locale}/>
        ) : (
          <RangePicker
            onChange={handleDateChange}
            locale={locale}
            defaultValue={[firstDayOfMonth, today]}
          />
        )}
        <Button className="button-cualificados" onClick={showModal}>Puestos cualificados</Button>
      </Panel>
    </Collapse>

    <Modal
      title="Puestos cualificados"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1000}
    >
      <div className="transfer">
        <TransferCualificados data={prepareDataForTransfer()}/>
      </div>
    </Modal>
  </Fragment>
  );
}
