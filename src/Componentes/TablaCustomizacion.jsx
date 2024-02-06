import React, { useState } from 'react';
import { Table, Input, Button, message, Tooltip, ColorPicker, Select, Spin } from 'antd';
import { CiEdit } from 'react-icons/ci';
import { TfiSave } from 'react-icons/tfi';
import './styles.scss';
import { useSelector, useDispatch } from 'react-redux';
import { setCustomizaciones } from '../Redux/actions';

const { Option } = Select;

const EditableTable = () => {
  const customizaciones = useSelector((state) => state.customizaciones);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(customizaciones);
  const dispatch = useDispatch();

  const success = (updatedData, key) => {
    messageApi.open({
      type: 'success',
      content: `${updatedData.find((item) => item.key === key).fieldName} guardado`,
    });
  };

  const handleFieldValueChange = (value, key) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, fieldValue: value } : item
      )
    );
  };

  const handleEdit = (key) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, editable: !item.editable } : item
      )
    );
  };

  const handleSave = async (key) => {
    const updatedData = data.map((item) =>
      item.key === key ? { ...item, editable: false } : item
    );

    setData(updatedData);
    showLoader();
    setTimeout(() => {
      success(updatedData, key);
    }, 1500);

    setTimeout(() => {
    const editedItem = updatedData.find((item) => item.key === key);
    if (editedItem) {
      dispatch(setCustomizaciones(editedItem.fieldName, editedItem.fieldValue));
    }
    }, 2000);

  };

  const handleColorChange = (color, key) => {
    const hexColor = color?.toHexString();
    setData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, fieldValue: hexColor } : item
      )
    );
  };

  const handleFontChange = (fontName, key) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, fieldValue: fontName } : item
      )
    );
  };

  const columns = [
    {
      title: 'Campo',
      dataIndex: 'fieldName',
      key: 'fieldName',
    },
    {
      title: 'Valor',
      dataIndex: 'fieldValue',
      key: 'fieldValue',
      render: (text, record) => {
        if (record.editable && (record.fieldName === 'Color Principal' || record.fieldName === 'Color Secundario')) {
          return (
            <ColorPicker
              value={text}
              onChange={(color) => handleColorChange(color, record.key)}
            />
          );
        } else if (record.editable && record.fieldName === 'Tipo de Letra') {
          return (
            <Select
            value={text}
            style={{ width: '100%' }}
            onChange={(fontName) => handleFontChange(fontName, record.key)}
          >
            <Option value="Amatic SC" style={{ fontFamily: 'Amatic SC' }}>Amatic SC</Option>
            <Option value="Open Sans" style={{ fontFamily: 'Open Sans' }}>Open Sans</Option>
            <Option value="Dancing Script" style={{ fontFamily: 'Dancing Script'}}>Dancing Script</Option>
            <Option value="Gloria Hallelujah" style={{ fontFamily: 'Gloria Hallelujah'}}>Gloria Hallelujah</Option>
            <Option value="Grape Nuts" style={{ fontFamily: 'Grape Nuts'}}>Grape Nuts</Option>
            <Option value="Mate" style={{ fontFamily: 'Mate' }}>Mate</Option>
            <Option value="Montserrat Alternates" style={{ fontFamily: 'Montserrat Alternates' }}>Montserrat Alternates</Option>
            <Option value="Playfair Display" style={{ fontFamily: 'Playfair Display' }}>Playfair Display</Option>
            <Option value="Roboto" style={{ fontFamily: 'Roboto' }}>Roboto</Option>
            <Option value="Shadows Into Light" style={{ fontFamily: 'Shadows Into Light'}}>Shadows Into Light</Option>
            <Option value="Montserrat" style={{ fontFamily: 'Montserrat' }}>Montserrat</Option>
          </Select>
          );
        } else if (record.editable) {
          return (
            <Input
              value={text}
              onChange={(e) => handleFieldValueChange(e.target.value, record.key)}
            />
          );
        } else if (record.fieldName === 'Color Principal' || record.fieldName === 'Color Secundario') {
          return (
            <ColorPicker
              value={text}
              disabled
            />
          );
        } else if (record.fieldName === 'URL del Logo') {
          return (
            <a href={text} target="_blank" rel="noopener noreferrer">{text}</a>
          );
        }
        return text;
      },
    },
    {
      title: 'Acción',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <span>
          {record.editable ? (
            <Tooltip title="Guardar">
              <Button className='btn-guardar' shape="circle" onClick={() => handleSave(record.key)} icon={<TfiSave />} />
            </Tooltip>
          ) : (
            <Tooltip title="Editar">
              <Button type="primary" shape="circle" onClick={() => handleEdit(record.key)} icon={<CiEdit />} />
            </Tooltip>
          )}
        </span>
      ),
    },
  ];

  const showLoader = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <>
      {contextHolder}
      <Table dataSource={data} columns={columns} bordered pagination={false} scroll={{ x: 'max-content' }} />
      <Spin spinning={loading} fullscreen />
    </>
  );
};

export default EditableTable;
