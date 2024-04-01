import React, { useEffect, useRef, useState } from "react";
import Metricas from "./Metricas";
import "./styles.scss";
import { useSelector } from "react-redux";
import html2pdf from "html2pdf.js";
import { Button, message } from "antd";
import { GoDownload } from "react-icons/go";


export default function Reporteria() {
  const fechas = useSelector(state => state.fechasfiltros);
  const nombreCuenta = useSelector((state)=> state.nombreCuenta[0])
  const logoUrl = useSelector(
    (state) =>
      state.customizaciones.find((item) => item.fieldName === "URL del Logo")
        ?.fieldValue
  );
  const nombreEmpresa = useSelector(
    (state) =>
      state.customizaciones.find(
        (item) => item.fieldName === "Nombre de la Empresa"
      )?.fieldValue
  );
  const reporteriaRef = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [logoLoaded, setLogoLoaded] = useState(null);

  useEffect(() => {
    // Descargar la imagen como una URL de datos
    if (logoUrl) {
      fetch(logoUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            setLogoLoaded(reader.result);
          };
        })
        .catch((error) => console.error("Error al cargar la imagen:", error));
    }
  }, [logoUrl]);

  useEffect(() => {
    // Actualiza el componente si las fechas cambian
    // Puedes agregar aquí lógica adicional para manejar el cambio de fechas si es necesario
  }, [fechas]);

  function descargarPDF() {
    if (!logoLoaded) {
      messageApi.error(
        "La imagen del logo aún se está cargando. Por favor, espera..."
      );
      return;
    }

    const contenedor = reporteriaRef.current;

      // Obtener la fecha actual
      const fechaActual = new Date();
      // Formatear la fecha como 'YYYY-MM-DD'
      const fechaFormateada = fechaActual.toISOString().split('T')[0];
      // Crear el nombre del archivo con la fecha actual y el nombre de la cuenta
      const nombreArchivo = `${nombreEmpresa}_métricas_${nombreCuenta}_${fechaFormateada}.pdf`;

    const opciones = {
      margin: [0, 0, 0, 0],
      filename: nombreArchivo,
      image: { type: "jpeg", quality: 1.0, src: logoLoaded }, // Utiliza logoLoaded como fuente de la imagen
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: "mm",
        format: "a3",
        orientation: "landscape",
        compressPDF: true,
      },
      pagebreak: { before: ".page-break" },
    };

    html2pdf().from(contenedor).set(opciones).save();
  }

  return (
    <div>
      <div className="nav-reporteria">
        <div>
          <Button onClick={descargarPDF} icon={<GoDownload />}>Descargar PDF</Button>
        </div>
        <div className="reporteria-metricas" ref={reporteriaRef}>
          {logoLoaded && (
            <div className="logo-marca">
              <img src={logoLoaded} alt={nombreEmpresa} />
              <div className="titulo-reporteria">
                <div>
                  {nombreEmpresa} 
                  <br/>
                  Reporte de Métricas
                </div>
                <div className="subtitulo-reporteria">
                  Desde {fechas.map(date => typeof date === 'object' ? date.format('DD/MM/YY') : date).join(' hasta ')}
                </div>
              </div>
            </div>
          )}
          <Metricas fechasReporteria={fechas}/>
        </div>
        {contextHolder}
      </div>
    </div>
  );
}
