import React, { useEffect, useState } from 'react';
import { formattedString, appendAnOverlayIfNecessary } from '../../common';
import { Button } from '../../components';
import './styles.scss';

const DataPanel = (

    {
        selectedRow,
        onClose,
        onSave,
        setSelectedRow,
        uniqueStatuses
    }

) => {

    //   const [modifiedData, setModifiedData] = useState(selectedRow || {}); // Initialize with selectedRow or empty object
    const [modifiedData, setModifiedData] = useState(selectedRow || {});

    /*useEffect(() => {
        appendAnOverlayIfNecessary();
    }, []);*/

    useEffect(() => {
        setTimeout(() => {
            document.querySelector('.save')?.querySelector('button').setAttribute('disabled', 'true');
        }, 2000);
    }, []);

    if (!selectedRow) return null; // Hide the panel when no row is selected

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setModifiedData({ ...selectedRow, [name]: value }); // Still needed for tracking changes
        setSelectedRow({ ...selectedRow, [name]: value }); // Update selectedRow directly                
        document.querySelector('.save').querySelector('button').removeAttribute('disabled');
    };

    const handleSave = () => {
        onSave(modifiedData); // Pass modified data to onSave on button click    
        setTimeout(() => {
            onSave(modifiedData);
        });
    };

    const editableFields = [
        'status',
        'patient_phone',
        'doctor_phone',
        'patient_name',
        'notes'
    ]

    return (
        <div className="data-panel hidden">
            <Button action='close' onClick={onClose} />
            <h2>Order #{selectedRow.id}</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                {/* Dynamically render form elements based on selectedRow data */}
                {Object.entries(selectedRow).map(([key, value]) => (
                    editableFields.includes(key) && (
                        <div key={key}>
                            <label htmlFor={key}>{formattedString(key)}</label>
                            {key === 'status' ? (
                                <select
                                    id={key}
                                    name={key}
                                    value={selectedRow[key]}
                                    onChange={handleInputChange}
                                >
                                    {uniqueStatuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            ) : key === 'notes' ? (
                                <textarea
                                    id={key}
                                    name={key}
                                    value={selectedRow[key]}
                                    onChange={handleInputChange}
                                ></textarea>
                            ) : (
                                <input
                                    type="text"
                                    id={key}
                                    name={key}
                                    value={selectedRow[key]}
                                    onChange={handleInputChange}
                                />
                            )}
                        </div>
                    )
                ))}
                <div className="save">
                    <Button text="Save" type="submit" icon="check" onClick={handleSave} />
                </div>
            </form>
        </div>
    );



};

export default DataPanel;