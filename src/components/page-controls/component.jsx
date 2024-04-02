import React from 'react';
import './styles.scss';
import { Button } from '..';

function PageControls(
    {
        visiblePageLinx,
        itemsPerPageOptions,
        data,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage
    }
) {

    const goToPage = (direction) => {
        switch (direction) {
            case 'previous':
                if (currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }
                break;
            case 'next':
                if (currentPage < totalPages) {
                    setCurrentPage(currentPage + 1);
                }
                break;
        }
    },
        totalPages = Math.ceil(data?.length / itemsPerPage),
        goToPreviousSetOfPages = () => {
            setCurrentPage(Math.max(1, currentPage - visiblePageLinx));
        }, goToNextSetOfPages = () => {
            setCurrentPage(Math.min(totalPages, currentPage + visiblePageLinx));
        }, renderPageButtons = () => {

            const totalPagesToShow = Math.ceil(totalPages / visiblePageLinx);

            let startIndex = Math.max(
                1,
                Math.min(currentPage, Math.floor((currentPage - 1) / visiblePageLinx) * visiblePageLinx + 1)
            ), endIndex = Math.min(totalPages, startIndex + visiblePageLinx - 1),
                buttons = [<li key='previousPage'><Button tier='secondary' onClick={() => goToPage('previous')} disabled={currentPage === 1}><i className="fa-solid fa-chevron-left"></i></Button></li>];

            for (let i = startIndex; i <= endIndex; i++) {
                buttons.push(
                    <li key={i}>
                        <Button tier='secondary' onClick={() => setCurrentPage(i)} isActive={currentPage === i}>
                            {i}
                        </Button>
                    </li>
                );
            }

            if (startIndex > 1) {
                buttons.unshift(
                    <li key='previousSetOfPages'>
                        <Button tier='secondary' onClick={goToPreviousSetOfPages} disabled={currentPage === 1}>
                        <i className="fa-solid fa-angles-left"></i>
                        </Button>
                    </li>
                );
            }

            buttons.push(<li key='nextPage'><Button tier='secondary' onClick={() => goToPage('next')} disabled={currentPage === totalPages}><i className="fa-solid fa-chevron-right"></i></Button></li>)

            if (endIndex < totalPages) {
                buttons.push(
                    <li key='nextSetOfPages'>
                        <Button tier='secondary' onClick={goToNextSetOfPages} disabled={currentPage === totalPagesToShow}>
                            <i className="fa-solid fa-angles-right"></i>
                        </Button>
                    </li>
                );
            }

            return buttons;
        }

    return (
        <div className="page-controls">
            <div>
                <span>Page <strong>{currentPage}</strong> of {totalPages}</span>
                <span>Show</span>
                <select value={itemsPerPage} onChange={(e) => setItemsPerPage(parseInt(e.target.value))}>
                    {itemsPerPageOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <span>items per page</span>
            </div>
            <div>
                <ul>
                    {renderPageButtons()}
                </ul>
            </div>
        </div>
    );
}

export default PageControls;