import React, { useEffect, useState } from 'react';
import data from '../../data/orders.json'; // Import local JSON data for initial rendering
import { getData } from '../../services/getData'; // Import function for fetching data (optional)
import { Header, Table, Spinner } from '../../components';

const Orders = () => {
  const [fetchedData, setFetchedData] = useState(null), // State to store fetched data
    [error, setError] = useState(null), // State to store error, if any
    [isVisible, setIsVisible] = useState(false),
    [selectedRow, setSelectedRow] = useState(null),
    [uniqueStatuses, setUniqueStatuses] = useState([]),
    isEditable = true;

  const handleTableDataUpdate = (updatedRow) => {
    // Create a new object with updated values
    const newData = { ...updatedRow };

    // Update states
    setFetchedData((prevData) => (
      prevData.map((row) => (row.id === updatedRow.id ? newData : row))
    ));
    setSelectedRow(newData);
  };

  // useEffect hook for fetching data (optional)
  useEffect(() => {
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
    <>
      <Spinner></Spinner>

      {error ? (
        <div>Error fetching data: {error.message}</div>
      ) : fetchedData ? (
        <>
          <Header text="Orders"></Header>
          <section className={isVisible ? '' : 'hidden'}>
            <Table
              uniqueStatuses={uniqueStatuses}
              data={fetchedData}
              handleTableDataUpdate={handleTableDataUpdate}
              setSelectedRow={setSelectedRow}
              selectedRow={selectedRow}
              isEditable={isEditable}
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

    </>
  );
};

export default Orders;
