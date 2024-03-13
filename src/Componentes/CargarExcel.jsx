import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Steps,
  message,
  Input,
  Tooltip,
  Tag,
} from "antd";
import { UploadOutlined, SaveOutlined, EditOutlined } from "@ant-design/icons";
import './styles.scss'
import * as XLSX from "xlsx";

const { Step } = Steps;

const TablaUsuarios = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [excelData, setExcelData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [validated, setValidated] = useState(false);
  const [showCargarButton, setShowCargarButton] = useState(false);
  const [columns, setColumns] = useState([
    {
      title: "Nombre",
      dataIndex: "Nombre",
      key: "Nombre",
      render: (text, record) =>
        record.editable ? (
          <Input
            value={text}
            onChange={(e) =>
              handleFieldValueChange(e.target.value, record.key, "Nombre")
            }
          />
        ) : (
          text
        ),
    },
    {
      title: "Apellido",
      dataIndex: "Apellido",
      key: "Apellido",
      render: (text, record) =>
        record.editable ? (
          <Input
            value={text}
            onChange={(e) =>
              handleFieldValueChange(e.target.value, record.key, "Apellido")
            }
          />
        ) : (
          text
        ),
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "Email",
      render: (text, record) =>
        record.editable ? (
          <Input
            value={text}
            onChange={(e) =>
              handleFieldValueChange(e.target.value, record.key, "Email")
            }
          />
        ) : (
          text
        ),
    },
    {
      title: "Usuario",
      dataIndex: "Usuario",
      key: "Usuario",
      render: (text, record) =>
        record.editable ? (
          <Input
            value={text}
            onChange={(e) =>
              handleFieldValueChange(e.target.value, record.key, "Usuario")
            }
          />
        ) : (
          text
        ),
    },
    {
      title: "Contraseña",
      dataIndex: "Contraseña",
      key: "Contraseña",
      render: (text, record) =>
        record.editable ? (
          <Input
            value={text}
            onChange={(e) =>
              handleFieldValueChange(e.target.value, record.key, "Contraseña")
            }
          />
        ) : (
          text
        ),
    },
    {
      title: "Acción",
      dataIndex: "Acción",
      key: "Acción",
      render: (_, record) => (
        <span>
          {record.editable ? (
            <Tooltip title="Guardar">
              <Button
                className="btn-guardar"
                shape="circle"
                onClick={() => handleSave(record.key)}
                icon={<SaveOutlined />}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Editar">
              <Button
                type="primary"
                shape="circle"
                onClick={() => handleEdit(record.key)}
                icon={<EditOutlined />}
              />
            </Tooltip>
          )}
        </span>
      ),
    },
  ]);

  useEffect(() => {
    const updatedColumns = [...columns]; // Clonar las columnas existentes
    const validationColumnIndex = updatedColumns.findIndex(
      (column) => column.key === "Validación"
    );
    if (validated && validationColumnIndex === -1) {
      // Si validated es true y la columna de validación no existe, la agregamos
      const actionColumnIndex = updatedColumns.findIndex(
        (column) => column.key === "Acción"
      );
      updatedColumns.splice(actionColumnIndex, 0, {
        title: "Validación",
        dataIndex: "Validación",
        key: "Validación",
        render: (_, record) => {
          const isValid = validateRow(record);
          return isValid ? <Tag color="green">Validado</Tag> : <Tag color="red">Completar</Tag>;
        },
      });
    }
    setColumns(updatedColumns);
    const allValidated = excelData.every((record) => validateRow(record));
    setShowCargarButton(allValidated);
  }, [validated]);

  const handleEdit = (key) => {
    setLoading(true);
    setExcelData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, editable: true } : item
      )
    );
  };
  
  const handleSave = async (key) => {
    setExcelData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, editable: false } : item
      )
    );
    setLoading(false);
  };
  

  const handleModalOpen = () => {
    setCurrentStep(0);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setExcelData([]);
    setLoading(false);
    setValidated(false); // Resetear el estado de validación al cerrar el modal
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleDownloadTemplate = () => {
    const data = [
      { Nombre: "", Apellido: "", Email: "", Usuario: "", Contraseña: "" },
    ];
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");
    XLSX.writeFile(workbook, "template.xlsx");
  };

  const handleUpload = (file) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const workbook = XLSX.read(content, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        range: 1,
      });
      const transformedData = jsonData.map((row, index) => ({
        key: index,
        Nombre: row[0],
        Apellido: row[1],
        Email: row[2],
        Usuario: row[3],
        Contraseña: row[4],
        editable: false, // Añadir la propiedad editable a cada objeto
      }));
      setExcelData(transformedData);
      handleNextStep();
    };
    reader.readAsBinaryString(file);
    setLoading(false);
  };

  const handleAddUsers = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleModalClose();
      message.success("Usuarios cargados correctamente");
    }, 2000);
  };

  const handleFieldValueChange = (value, key, fieldName) => {
    setExcelData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, [fieldName]: value } : item
      )
    );
  };

  const validateRow = (record) => {
    for (const key in record) {
      if (record[key] === undefined) {
        return false;
      }
    }
    return true;
  };

  const handleValidateAndAddUsers = () => {
    const isValid = validateData(excelData);
    setValidated(isValid); // Establecer el estado de validación
  
    // Verificar si todos los registros están validados
    const allValidated = excelData.every((record) => validateRow(record));
    setShowCargarButton(allValidated); // Activar o desactivar el botón Cargar
  };

  const handleCargar = () => {
    handleAddUsers();
  };

  const validateData = (data) => {
    for (let i = 0; i < data.length; i++) {
      const rowData = data[i];
      for (const key in rowData) {
        if (rowData[key] === undefined) {
          return false;
        }
      }
    }
    return true;
  };

  return (
    <>
      <Button
        type="primary"
        onClick={handleModalOpen}
        icon={<UploadOutlined />}
      >
        Cargar Excel
      </Button>
      <Modal
        title="Cargar Usuarios desde Excel"
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={1000}
      >
        <Steps current={currentStep}>
          <Step title="Descargar Plantilla" />
          <Step title="Subir Archivo Excel" />
          <Step title="Validar y Cargar" />
        </Steps>
        {currentStep === 0 && (
          <div className="modal-paso1">
            <p>Descarga aquí la plantilla de Excel requerida.</p>
            <Button type="primary" onClick={handleDownloadTemplate}>
              Descargar Excel
            </Button>
            <Button onClick={handleNextStep}>Siguiente</Button>
          </div>
        )}
        {currentStep === 1 && (
          <div  className="modal-paso1">
            <input
              type="file"
              accept=".xls,.xlsx"
              className="input-file"
              onChange={(e) => handleUpload(e.target.files[0])}
            />
            <Button onClick={handlePrevStep}>Anterior</Button>
            <Button onClick={handleNextStep}>Siguiente</Button>
          </div>
        )}
        {currentStep === 2 && (
          <div>
            <Table
              dataSource={excelData}
              columns={columns}
              pagination={false}
              bordered
              style={{ margin: "15px" }}
              scroll={{ x: "max-content" }}
            />
            <Button onClick={handlePrevStep} style={{marginRight:16}}>Anterior</Button>
            <Button
              type="primary"
              onClick={handleValidateAndAddUsers}
              loading={loading}
              disabled={excelData.length === 0 || showCargarButton}
            >
              Validar todos
            </Button>
            {showCargarButton && (
              <Button
                type="primary"
                onClick={handleCargar}
                loading={loading}
                disabled={excelData.length === 0}
                style={{marginLeft:16}}
              >
                Cargar
              </Button>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default TablaUsuarios;
