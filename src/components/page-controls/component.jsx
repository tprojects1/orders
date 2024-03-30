import React from 'react';
import './styles.scss';

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
                buttons = [<li><button onClick={() => goToPage('previous')} disabled={currentPage === 1}>&lt;</button></li>];

            for (let i = startIndex; i <= endIndex; i++) {
                buttons.push(
                    <li key={i}>
                        <button onClick={() => setCurrentPage(i)} className={currentPage === i ? 'active' : ''}>
                            {i}
                        </button>
                    </li>
                );
            }

            if (startIndex > 1) {
                buttons.unshift(
                    <li key="prev">
                        <button onClick={goToPreviousSetOfPages} disabled={currentPage === 1}>
                            &lt;&lt;
                        </button>
                    </li>
                );
            }

            buttons.push(<li><button onClick={() => goToPage('next')} disabled={currentPage === totalPages}>&gt;</button></li>)

            if (endIndex < totalPages) {
                buttons.push(
                    <li key="next">
                        <button onClick={goToNextSetOfPages} disabled={currentPage === totalPagesToShow}>
                            &gt;&gt;
                        </button>
                    </li>
                );
            }

            return buttons;
        }

    return (
        <div class="page-controls">
            <div>
                <span>Page {currentPage} of {totalPages}</span>
                <select value={itemsPerPage} onChange={(e) => setItemsPerPage(parseInt(e.target.value))}>
                    {itemsPerPageOptions.map((option) => (
                        <option key={option} value={option}>
                            {option} per page
                        </option>
                    ))}
                </select>
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