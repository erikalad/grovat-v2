import React, { Fragment, useEffect, useState } from "react";
import { Button, Collapse, DatePicker, Modal, Tag } from "antd";
import locale from "antd/lib/date-picker/locale/es_ES";
import dayjs from 'dayjs';
import 'dayjs/locale/es'; 
import './styles.scss'
import TransferCualificados from "./Transfer";
import { useDispatch, useSelector } from "react-redux";
import { setMes, transferOk } from "../Redux/actions";

const { Panel } = Collapse;
const { RangePicker } = DatePicker;

export default function Filtros({ onFilterByDate, data }) {
  const colorPrincipal = useSelector(state => state.customizaciones.find(item => item.fieldName === 'Color Principal')?.fieldValue);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const conexiones = useSelector((state) => state.conexionesData);
  const positions = [...new Set(conexiones[0]?.datos.map((dato) => dato.Position))];
  const dataTabla = positions.map((position, index) => ({ position, key: index }));
  const nombreCuenta = useSelector((state)=> state.nombreCuenta)
  const [cuentas, setCuentas] = useState(nombreCuenta)

  const dispatch = useDispatch()

  const handleOk = () => {
    setIsModalOpen(false);
    dispatch(transferOk())
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

  dispatch(setMes(nombreDelMes));

  const handleDateChange = (dates, dateStrings) => {
    const formattedDates = dateStrings.map((date) => {
      const [year, month, day] = date.split("-").map((item) => item.slice(-2));
      return `${day}/${month}/${year}`;
    });
    
    // No realizamos el filtrado aquí
    // Llamamos a la función onFilterByDate para comunicar los cambios
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

  useEffect(()=>{
    setCuentas(nombreCuenta)
  },[nombreCuenta])

  return (
    <Fragment>
    <Collapse accordion defaultActiveKey={1}>
      <Panel header="Filtros" key="1">
        <p>Selecciona un rango de fechas:</p>
        {Object.keys(data).length === 0 ? (
          <RangePicker disabled locale={locale} className="rangepicker"/>
        ) : (
          <RangePicker
            onChange={handleDateChange}
            locale={locale}
            defaultValue={[firstDayOfMonth, today]}
          />
        )}
        <Button className="button-cualificados" onClick={showModal}>Puestos cualificados</Button>
 
        {cuentas.length > 0 && (
        <div className="tags-cuenta">
          {cuentas.length > 1 ? 'Cuentas:' : 'Cuenta:'}
          {[...new Set(cuentas.filter(nombre => nombre !== null && nombre !== undefined))].map((nombre, index) => (
            <Tag key={index} className="tag">
              {nombre}
            </Tag>
              ))}
            </div>
          )}


       

   
      </Panel>
    </Collapse>

    <Modal
      title="Puestos cualificados"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1000}
      okButtonProps={{ style: { backgroundColor: {colorPrincipal} } }}
    >
      <div className="transfer">
        <TransferCualificados data={prepareDataForTransfer()}/>
      </div>
    </Modal>
  </Fragment>
  );
}
