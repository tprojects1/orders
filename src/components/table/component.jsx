import React, { useEffect, useState } from 'react';
// import parse from 'date-fns/parse';
import { formattedString, getTheCurrentBreakpoint, repositionTheDataPanel, toggleElementEnablement } from '../../common';
import './styles.scss';
import { DataPanel, PageControls, Tag } from '..';
import Fuse from 'fuse.js';
// import useDeepCompare from '../../hooks/useDeepCompare';

const Table = ({ data,
  columns,
  defaultSortColumn,
  defaultSortOrder,
  setSelectedRow,
  selectedRow,
  uniqueStatuses,
  isEditable,
  hasPageControls,
  isSortable,
  isShowingADataPanel,
  setIsShowingADataPanel
}) => {

  const [allData, setAllData] = useState([...data]),
    [sortField, setSortField] = useState(defaultSortColumn || null), // Track currently sorted field
    [sortOrder, setSortOrder] = useState(defaultSortOrder || 'descending'), // Initial sort order (descending on load)
    [searchTerm, setSearchTerm] = useState(''),
    [showExactMatches, setShowExactMatches] = useState(false),
    [currentPage, setCurrentPage] = useState(1),
    [itemsPerPage, setItemsPerPage] = useState(20),
    [tableContainerWidth, setTableContainerWidth] = useState(null),
    containerSelector = '#table-container',
    fuse = new Fuse(allData, {
      keys: Object.keys(allData[0]), // Adjust keys if needed
      threshold: 0.4, // Adjust for misspelling tolerance
    }),
    handleSearchChange = (event) => {
      setSearchTerm(event.target.value.toLowerCase());
    },
    handleExactMatchToggle = (event) => {
      setShowExactMatches(event.target.checked);
    },
    filterData = (searchTerm, exactMatchOnly) => {

      if (searchTerm === '') {
        return allData; // Return all of the data if there isn't anything in the search
      } else {

        const searchTermLower = searchTerm.toLowerCase();

        return allData.filter((row) => {
          if (exactMatchOnly) {
            // Exact match logic (existing function)
            return Object.values(row).some((value) =>
              value.toString().toLowerCase().includes(searchTermLower)
            );
          } else {
            // Fuzzy match using Fuse.js
            const results = fuse.search(searchTermLower);
            return results.map((result) => result.item).includes(row);
          }
        });
      }
    },
    clearSearch = () => {
      setSearchTerm(''); // Reset the search term to clear the search results
    };

  const filteredData = filterData(searchTerm, showExactMatches),
    sortColumn = (column) => {
      const sortedAllData = [...allData].sort((a, b) => {

        if (column === sortField) {
          // Toggle sort order on the same field
          setSortOrder(sortOrder === 'ascending' ? 'descending' : 'ascending');
        } else {
          // Sort by the new field
          setSortField(column);
          setSortOrder('ascending'); // Reset sort order for new field
        }

        // newData.sort((a, b) => {
        const valueA = a[column];
        const valueB = b[column];

        if (typeof valueA === 'string') {
          return sortOrder === 'ascending'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA); // Locale-aware string comparison
        } else {
          return sortOrder === 'ascending' ? valueA - valueB : valueB - valueA; // Numeric comparison
        }
        // });

      });

      setAllData(sortedAllData);
    };

  useEffect(() => {
    if (defaultSortColumn) {
      sortColumn(defaultSortColumn);
    }
    window.addEventListener('resize', function () {
      resizeTheTable();
    });
  }, []);

  const [rows, setRows] = useState([...filteredData]);

  const getColumnName = (column) => {
    return formattedString(column).replace('Id', 'ID');
  },
    formattedColumns = columns.map((column) => (
      <th
        key={column}
        className={`table-header ${sortField === column ? (sortOrder === 'ascending' ? 'descending' : 'ascending') : ''}`}
        onClick={() => sortColumn(column)}
      >
        {isSortable ? (
          <div>
            <span>{getColumnName(column)}</span>
            <i />
          </div>
        ) : (
          getColumnName(column)
        )}
      </th>
    ));

  function resizeTheTable() {
    setTimeout(() => {
      const table = document.querySelector('table'),
        dataPanel = document.querySelector('.data-panel'),
        showTheDataPanel = () => {
          setTimeout(() => {
            repositionTheDataPanel();
            dataPanel.classList.remove('hidden');
          }, 400);
        }

      /*if (getTheCurrentBreakpoint() == 'small') {
        table.style.width = '100%'
        if (dataPanel) {
          setIsShowingADataPanel(true);
          showTheDataPanel();
        }
        else setIsShowingADataPanel(false);
      }
      else {
        if (dataPanel) {
          table.style.width = 'calc(100% - ' + dataPanel.offsetWidth + 'px)';
          setIsShowingADataPanel(true);
          showTheDataPanel();
        }
        else {
          table.style.width = '100%';
          setIsShowingADataPanel(false);
        }
      }*/

      table.style.width = getTheCurrentBreakpoint() == 'small'
        ? '100%'
        : dataPanel ? `calc(100% - ${dataPanel.offsetWidth}px)` : '100%';

      setIsShowingADataPanel(!!dataPanel); // Use double negation for boolean conversion
      if (dataPanel) showTheDataPanel();


    });
  }

  const handleRowClick = (row, id) => {

    if (document.querySelector('[data-id="' + id + '"]').className.includes('selected')) closePanel() // close the panel if the currently selected row is clicked

    else {

      deselectTheRow();

      document.querySelector('[data-id="' + id + '"]').classList.add('selected');

      setSelectedRow(row);
      /*(setTimeout(() => {
        try {

          const inputElement = document.querySelector('.data-panel').querySelector('[type="text"]');

          let currentValue = inputElement.value;

          currentValue += " ";
          currentValue = currentValue.slice(0, -1);
          inputElement.value = currentValue;

          inputElement.focus();
          inputElement.blur();
          console.log(inputElement)

          let event = new KeyboardEvent("type", {
            bubbles: true,
            cancelable: true,
            charCode: 0,
            keyCode: 0,
            key: "",
            shiftKey: false,
            altKey: false,
            ctrlKey: false,
            metaKey: false,
            repeat: false,
            location: KeyboardEvent.DOM_KEY_LOCATION_STANDARD,
          });

          setTimeout(() => {



            let enterEvent = new KeyboardEvent("keydown", {
              key: "x",  // Key property set to "x" for the letter 'x'
              keyCode: 88, // keyCode for 'x' is 88
              which: 88   // which property also set to 88 for consistency
            });

            const previousInputElementValue = inputElement.value;

            inputElement.value += 'x';
            inputElement.dispatchEvent(enterEvent);
            // inputElement.value = previousInputElementValue;

            inputElement.dispatchEvent(new KeyboardEvent('keydown', { 'keyCode': 32, 'which': 32 }));
          });

        } catch (e) {
          console.error(e);
        }
      }, 1000);*/

    }

    resizeTheTable();

  };

  function deselectTheRow() {
    document.querySelectorAll('[data-id]').forEach(row => {
      row.classList.remove('selected');
    });
  }

  function closePanel() {
    setSelectedRow(null);
    deselectTheRow();
    resizeTheTable();
  }

  useEffect(() => {
    const container = document.querySelector(containerSelector);
    setTimeout(() => {

      if (container) {
        setTableContainerWidth(container.clientWidth);
        // Add event listener for when the window resize affects the width
        window.addEventListener('resize', () => {
          setTableContainerWidth(container.clientWidth);
        });
      }

    });

    return () => {
      // Clean up event listener on component unmount
      window.removeEventListener('resize', () => { });
    };
  }, [containerSelector]);

  const styles = { width: tableContainerWidth ? `${tableContainerWidth}px` : 'auto' },
    handleRowCheckboxChange = (event, row) => {
      const updatedRows = [...rows];
      const rowIndex = updatedRows.findIndex((rowData) => rowData.id === row.id);

      if (rowIndex !== -1) {
        updatedRows[rowIndex] = { ...updatedRows[rowIndex], isChecked: event.target.checked };
        setAllData(updatedRows);
      }
    },
    handleSelectAllClick = (event) => {
      const isChecked = event.target.checked;
      setAllData(rows => rows.map(row => ({ ...row, isChecked })));
      console.log('Updated rows:', rows);
    };


  useEffect(() => {
    const allChecked = rows.every((row) => row.isChecked);
    document.getElementById('select-all').checked = allChecked; // Set "select all" checkbox
  }, [rows]); // Update on changes to rows state

  return (
    <>
      <div className={`table ${isSortable ? 'sortable' : ''} ${isEditable ? 'editable' : ''} ${hasPageControls ? 'has-page-controls' : ''} ${isShowingADataPanel ? 'is-showing-a-data-panel' : ''}`}>
        <div id="search" style={styles}>
          <div className="search">
            <input type="search" placeholder="Search" value={searchTerm} onChange={handleSearchChange} />
          </div>
          <label htmlFor="toggle-exact-matches">
            <input type="checkbox" id="toggle-exact-matches" checked={showExactMatches} onChange={handleExactMatchToggle} />
            Show exact matches only
          </label>
        </div>
        <div id="table-container">
          <table key={data.length}>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    id="select-all"
                    onClick={handleSelectAllClick}
                  />
                </th>
                {formattedColumns}
              </tr>
            </thead>
            <tbody>
              {/* Display no results message if filteredData is empty */}
              {filteredData.length === 0 && searchTerm !== '' && (
                <tr>
                  <td colSpan={columns.length} className='no-results'><h4>No Results</h4><p>There aren't any results for the term <strong>{searchTerm}</strong>, but you can try another search term or <a href="#" onClick={clearSearch}>view all of the table entries</a>.</p></td>
                </tr>
              )}
              {filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((row) => (
                <tr key={row.id} data-id={row.id} onClick={() => handleRowClick(row, row.id)}>
                  <td>
                    <input
                      type="checkbox"
                      value={row.id} // Assuming each row has a unique id
                      checked={row.isChecked}
                      onChange={(event) => handleRowCheckboxChange(event, row)}
                    // Add other necessary props for managing checked states
                    />
                  </td>
                  {columns.map((column) => (
                    <td key={column} data-name={column}>
                      {column === 'status' ? (
                        <Tag text={row[column]} />
                      ) : (
                        row[column]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {isEditable ? (
            <DataPanel
              selectedRow={selectedRow}
              setSelectedRow={setSelectedRow}
              uniqueStatuses={uniqueStatuses}
              onClose={() => closePanel()}
              onSave={(updatedData) => {
                setAllData((prevData) =>
                  prevData.map((row) =>
                    row.id === updatedData.id ? updatedData : row
                  )
                );
              }}
            />
          ) : ''}
        </div>
        <PageControls
          data={filteredData}
          visiblePageLinx={5}
          itemsPerPageOptions={[10, 20, 50]}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          containerSelector={containerSelector}
        />
      </div>
    </>
  );
};

export default Table;