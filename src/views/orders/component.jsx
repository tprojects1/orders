import React, { useEffect, useState } from 'react';
import data from '../../data/orders.json';
import { getData } from '../../services/getData'; // Import the service for fetching the data
import { Table, Spinner } from '../../components';
import '../styles.scss';

const Orders = ({  
  setHeaderText
}) => {
  const [fetchedData, setFetchedData] = useState(null), // State to store the fetched data
    [error, setError] = useState(null), // State to store any errors
    [isVisible, setIsVisible] = useState(false),
    [selectedRow, setSelectedRow] = useState(null),
    [uniqueStatuses, setUniqueStatuses] = useState([]),
    [isShowingADataPanel, setIsShowingADataPanel] = useState(false),
    tableProperties = {
      isEditable: true,
      isSortable: true,
      hasPageControls: true
    }

  const handleTableDataUpdate = (updatedRow) => {
    // Create a new object with the updated values
    const newData = { ...updatedRow };

    // Update the states
    setFetchedData((prevData) => (
      prevData.map((row) => (row.id === updatedRow.id ? newData : row))
    ));
    setSelectedRow(newData);
  };

  // useEffect hook for fetching the data on load
  useEffect(() => {
    setHeaderText('Orders');
    const fetchData = async () => {
      try {
        const response = await getData(data); // Assuming getData fetches data

        // Extract unique statuses from fetched data
        const uniqueStatusSet = new Set(response.map(item => item.status));
        setUniqueStatuses(Array.from(uniqueStatusSet));

        setFetchedData(response);
        setTimeout(() => setIsVisible(true), 500);
      } catch (error) {
        setError(error);
      }
    };

    if (getData && !fetchedData) {
      fetchData();
    }
  }, [getData, fetchedData]);

  return (
    <section className='view'>
      <Spinner></Spinner>

      {error ? (
        <div>Error fetching data: {error.message}</div>
      ) : fetchedData ? (
        <>

          <section className={`${isShowingADataPanel ? 'is-showing-a-data-panel' : ''} ${isVisible ? '' : 'hidden'}`}>
            <Table
              uniqueStatuses={uniqueStatuses}
              data={fetchedData}
              handleTableDataUpdate={handleTableDataUpdate}
              setSelectedRow={setSelectedRow}
              selectedRow={selectedRow}
              isEditable={tableProperties.isEditable}
              isSortable={tableProperties.isSortable}
              hasPageControls={tableProperties.hasPageControls}
              defaultSortColumn={'date'}
              isShowingADataPanel={isShowingADataPanel}
              setIsShowingADataPanel={setIsShowingADataPanel}
              columns={
                [
                  'id',
                  'date',
                  'patient_name',
                  'doctor_name',
                  'patient_phone',
                  'doctor_phone',
                  'status'
                ]
              } />
          </section>
        </>
      ) : ('')}

    </section>
  );
};

export default Orders;
