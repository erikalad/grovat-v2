import React, { Fragment, useEffect, useState } from "react";
import { Button, Collapse, DatePicker, Modal, Tag } from "antd";
import locale from "antd/lib/date-picker/locale/es_ES";
import dayjs from 'dayjs';
import 'dayjs/locale/es'; 
import './styles.scss'
import TransferCualificados from "./Transfer";
import { useDispatch, useSelector } from "react-redux";
import { setCantSemanas, setMes, transferOk } from "../Redux/actions";

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
  const [weeks, setWeeks] = useState(0); // Estado para almacenar la cantidad de semanas

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

    // Calcula la cantidad de semanas y actualiza el estado
    const weeks = calculateWeeks(formattedDates[0], formattedDates[1]);
    setWeeks(weeks);

    // No realizamos el filtrado aquí
    // Llamamos a la función onFilterByDate para comunicar los cambios
    onFilterByDate(formattedDates);
  };

  // Función para calcular la cantidad de semanas
  const calculateWeeks = (startDate, endDate) => {
    try {
        // Asegurarse de que las fechas estén en el formato correcto antes de pasarlas a dayjs
        const start = dayjs(startDate, 'DD/MM/YY');
        const end = dayjs(endDate, 'DD/MM/YY');
        
        if (!start.isValid() || !end.isValid()) {
            throw new Error("Las fechas proporcionadas no son válidas.");
        }

        const days = end.diff(start, 'day') + 1; // Agregamos 1 para incluir el último día
        if (isNaN(days)) {
            throw new Error("No se pudo calcular el número de días correctamente.");
        }

        const weeks = Math.ceil(days / 7); // Redondeamos hacia arriba para obtener el número de semanas
        dispatch(setCantSemanas(weeks))
    } catch (error) {
        console.error("Error al calcular las semanas:", error);
        return 1; // Si hay un error, devolvemos 1 semana por defecto
    }
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
              style={{ maxWidth: '100%', overflowX: 'auto' }}
              onChange={handleDateChange}
              locale={locale}
              defaultValue={[firstDayOfMonth, today]}
            />
          )}
          <Button className="button-cualificados" onClick={showModal}>Puestos cualificados</Button>

          {/* Mostrar la cantidad de semanas */}
          {weeks > 0 && (
            <div>
              {weeks} {weeks > 1 ? 'semanas' : 'semana'}
            </div>
          )}

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
