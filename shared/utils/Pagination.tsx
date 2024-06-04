import React from 'react';
import styled from 'styled-components';

type PaginationProps = {
  totalItems: number,
  itemsPerPage: number,
  currentPage: number,
  onPageChange: (pageNumber: number) => void
}

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    padding: 10px;
`;

const PaginationButton = styled.button<{ active: boolean }>`
    border: none;
    background-color: ${props => props.active ? '#d0d0d0' : '#f0f0f0'};
    margin: 0 5px;
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-weight: ${props => props.active ? 'bold' : 'normal'};

    &:hover {
        background-color: #e0e0e0;
    }
`;

const Pagination: React.FC<PaginationProps> = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const maxPagesToShow = 5; // Change this to the maximum number of pages you want to show at once
  const pagesToShow = Math.min(maxPagesToShow, totalPages);
  const firstPageToShow = Math.max(1, Math.min(currentPage - Math.floor(pagesToShow / 2), totalPages - pagesToShow + 1));

  const pages = Array.from({ length: pagesToShow }, (_, i) => firstPageToShow + i);

  return (
    <PaginationContainer>
      {currentPage > 1 && <PaginationButton onClick={() => onPageChange(currentPage - 1)}>Previous</PaginationButton>}
      {pages.map(page => (
        <PaginationButton
          key={page}
          onClick={() => onPageChange(page)}
          active={page === currentPage}
        >
          {page}
        </PaginationButton>
      ))}
      {currentPage < totalPages && <PaginationButton onClick={() => onPageChange(currentPage + 1)}>Next</PaginationButton>}
    </PaginationContainer>
  );
};

export default Pagination;