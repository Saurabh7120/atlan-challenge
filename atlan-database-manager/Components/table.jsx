import React from 'react';
import { Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer} from '@chakra-ui/react'

const TableComponent = ({cols,rows}) => {
    return (
        <TableContainer maxH={'680px'} overflowY='auto'>
          <Table variant='simple'>
            <Thead>
              <Tr>
                {cols.map((i,idx) => <th key={idx}>{i}</th>)}
              </Tr>
            </Thead>
            <Tbody>
              {rows.map((i,idx) => 
              <Tr key={idx}>
              {i.split(',').map((j,idx) => <Td key={idx}>{j}</Td>)}
              </Tr>
              )}
            
            </Tbody>
          
          </Table>
        </TableContainer>
    );
};

export default TableComponent;