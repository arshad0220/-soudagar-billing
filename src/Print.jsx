import React, { forwardRef } from 'react';
import { Card, ListGroup, Table } from 'react-bootstrap';
import Logo from '../public/logo.png';
import Seal from '../public/seal_sign.png';

const Print = forwardRef(({ invoiceData }, ref) => {
  const itemsPerPage = 10;
  const totalPages = Math.ceil(invoiceData.items.length / itemsPerPage);

  return (
    <div
      ref={ref}
      style={{
        fontFamily: 'Consolas',
        fontSize: 15,
        width: '210mm', // A4 width
        minHeight: '297mm', // A4 height
        margin: 'auto', // Center horizontally
        textAlign: 'center', // Center content
      }}
    >
      {Array.from({ length: totalPages }, (_, pageIndex) => {
        const startIndex = pageIndex * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const itemsToDisplay = invoiceData.items.slice(startIndex, endIndex);

        return (
          <Card key={pageIndex} style={{ marginBottom: '10mm' }}>
            <Card.Header>
              <h2>Soudagar Traders</h2>
              <p>Date: {invoiceData.date.toDateString()}</p>
              <p>Invoice Number: {invoiceData.invoiceNumber}</p>
              <p>Manager Name: {invoiceData.managerName}</p>
              <p>Customer Name: {invoiceData.customerName}</p>
            </Card.Header>
            <ListGroup>
              <Table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Date</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsToDisplay.map((item, index) => (
                    <tr key={index}>
                      <td>{item.item}</td>
                      <td>{item.itemDate.toDateString()}</td>
                      <td>{item.qty}</td>
                      <td>{item.price}</td>
                      <td>{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </ListGroup>
            <Card.Footer>
              <p>Page {pageIndex + 1} of {totalPages}</p>
              <p>Grand Total: {invoiceData.grandTotal}</p>
            </Card.Footer>
            {pageIndex === totalPages - 1 && (
              <div style={{ marginTop: '5mm' }}>
                <img src={Seal} alt="Logo" style={{ width: '50mm', height: '50mm' }} />
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
});

export default Print;
