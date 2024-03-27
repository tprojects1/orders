import React, { useEffect, useState } from 'react';
// import parse from 'date-fns/parse';
import { formattedString, getTheCurrentBreakpoint } from '../../common';
import './styles.scss';
import { DataPanel, Tag } from '..';
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
  isSortable
}) => {

  const [allData, setAllData] = useState([...data]),
    [sortField, setSortField] = useState(defaultSortColumn || null), // Track currently sorted field
    [sortOrder, setSortOrder] = useState(defaultSortOrder || 'descending'), // Initial sort order (descending on load)
    [searchTerm, setSearchTerm] = useState(''),
    [showExactMatches, setShowExactMatches] = useState(false),
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
    filterData = function (searchTerm, exactMatchOnly) {

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

  const getColumnName = function (column) {
    return formattedString(column).replace('Id', 'ID');
  };

  const formattedColumns = columns.map((column) => (
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
      // console.log(getTheCurrentBreakpoint());
      const table = document.querySelector('table'),
        dataPanel = document.querySelector('.data-panel'),
        showTheDataPanel = function () {
          // if (getTheCurrentBreakpoint() == 'small') document.querySelector('.overlay').classList.remove('hidden');
          if (getTheCurrentBreakpoint() == 'small') document.querySelector('table').classList.add('faded');
          setTimeout(() => {
            dataPanel.classList.remove('hidden');
          }, 400);
        }

      if (getTheCurrentBreakpoint() == 'small') {
        table.style.width = '100%'
        if (dataPanel) showTheDataPanel();
        // else document.querySelector('.overlay').classList.add('hidden');
        else document.querySelector('table').classList.remove('faded');
      }
      else {
        // document.querySelector('.overlay').classList.add('hidden');
        document.querySelector('table').classList.remove('faded');
        if (dataPanel) {
          table.style.width = 'calc(100% - ' + dataPanel.offsetWidth + 'px)';
          showTheDataPanel();
        }
        else table.style.width = '100%';
      }
    });
  }

  const handleRowClick = (row, id) => {

    if (document.querySelector('[data-id="' + id + '"]').className.includes('selected')) closePanel() // close the panel if the currently selected row is clicked

    else {

      deselectTheRow();

      document.querySelector('[data-id="' + id + '"]').classList.add('selected');

      setSelectedRow(row);
      setTimeout(() => {
        try {

          // const inputElement = document.querySelector('.data-panel').querySelector('[type="text"]');

          /*let currentValue = inputElement.value;

          currentValue += " ";
          currentValue = currentValue.slice(0, -1);
          inputElement.value = currentValue;*/

          /*inputElement.focus();
          inputElement.blur();*/
          // console.log(inputElement)

          /*let event = new KeyboardEvent("type", {
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

          let enterEvent = new KeyboardEvent("keydown", {
            key: "x",  // Key property set to "x" for the letter 'x'
            keyCode: 88, // keyCode for 'x' is 88
            which: 88   // which property also set to 88 for consistency
          });
          
          inputElement.value += "x";
          inputElement.dispatchEvent(enterEvent);*/

          // inputElement.dispatchEvent(new KeyboardEvent('keydown',{'keyCode':32,'which':32}));





        } catch (e) {

        }
      });

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

  return (
    <>
      <div className={`table ${isSortable ? 'sortable' : ''} ${isEditable ? 'editable' : ''}`}>
        <div id="search">
          <div>
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
              {filteredData.map((row) => (
                <tr key={row.id} data-id={row.id} onClick={() => handleRowClick(row, row.id)}>
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
      </div>
    </>
  );
};

export default Table;
