import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, DatePicker, Modal, Tag, Tooltip } from "antd";
import locale from "antd/lib/date-picker/locale/es_ES";
import dayjs from 'dayjs';
import 'dayjs/locale/es'; 
import './styles.scss'
import TransferCualificados from "./Transfer";
import { useDispatch, useSelector } from "react-redux";
import { setCantSemanas, setFechasFiltros, setMes, transferOk } from "../Redux/actions";
import { CiEdit } from "react-icons/ci";
import Reporteria from "./../Contenedores/Reporteria"; // Importa el componente de Reportería


const { RangePicker } = DatePicker;

export default function Filtros({ onFilterByDate, data, fechasReporteria }) {
  const colorPrincipal = useSelector(state => state.customizaciones.find(item => item.fieldName === 'Color Principal')?.fieldValue);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenReporteria, setIsModalOpenreporteria] = useState(false);
  const conexiones = useSelector((state) => state.conexionesData);
  const positions = [...new Set(conexiones[0]?.datos.map((dato) => dato.Position))];
  const dataTabla = positions.map((position, index) => ({ position, key: index }));
  const nombreCuenta = useSelector((state)=> state.nombreCuenta)
  const [cuentas, setCuentas] = useState(nombreCuenta)
  const [weeks, setWeeks] = useState(0); // Estado para almacenar la cantidad de semanas
  const dispatch = useDispatch()
  dayjs.locale('es'); 
  const firstDayOfMonth = dayjs().startOf('month');
  const today = dayjs();
  const nombreDelMes = firstDayOfMonth.format('MMMM');

  useEffect(() => {
    // Si fechasReporteria tiene datos, filtra data con esas fechas
    if (fechasReporteria.length === 2) {
      // Verifica el tipo de los elementos en fechasReporteria y los convierte a instancias de dayjs
      const [start, end] = fechasReporteria.map(date => {
        // Si date es una cadena, asumimos que está en el formato 'DD/MM/YY'
        if (typeof date === 'string') {
          return dayjs(date, 'DD/MM/YY');
        }
        // Si date es un objeto, asumimos que es un objeto de dayjs o similar
        else if (typeof date === 'object' && date.$d) {
          return dayjs(date.$d);
        }
        // Si no es ninguno de los anteriores, retorna null
        else {
          return null;
        }
      });
  
      // Asegúrate de que ambas fechas son instancias válidas de dayjs antes de continuar
      if (start && end) {
        // Formatea las fechas a cadenas 'DD/MM/YY'
        const formattedStart = start.format('DD/MM/YY');
        const formattedEnd = end.format('DD/MM/YY');
  
  
        // Ahora 'formattedStart' y 'formattedEnd' son cadenas formateadas 'DD/MM/YY', listas para ser usadas
        // Suponiendo que quieres enviar estas fechas formateadas a onFilterByDate
        onFilterByDate([formattedStart, formattedEnd]);
      }
    }
  }, [fechasReporteria]);
  

  useEffect(()=>{
    calculateWeeks(firstDayOfMonth, today)
    dispatch(setFechasFiltros([firstDayOfMonth, today]))
  },[])

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


  const showModalReporteria = () => {
    setIsModalOpenreporteria(true);
  };

  const handleCancelReporteria = () => {
    setIsModalOpenreporteria(false);
  };




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
    dispatch(setFechasFiltros(formattedDates))
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
      <Card className="filtros-metricas">
          <div>Filtros</div>
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
          {/* Cambios en el botón de Reportería */}
          {!data.datos.length > 0 ?
          <Tooltip title="Cargá datos para poder hacer una reportería">
          <Button onClick={showModalReporteria} icon={<CiEdit />}disabled >Reportería</Button>
          </Tooltip>
          : 
          <Button onClick={showModalReporteria} icon={<CiEdit />} >Reportería</Button>
           }
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
    </Card>

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

      {/* Agrega el componente de Reportería dentro del modal */}
      <Modal
        width={1400}
        title="Reportería"
        open={isModalOpenReporteria}
        onCancel={handleCancelReporteria}
        footer={null}
      >
        <Reporteria />
      </Modal>

    </Fragment>
  );
}
