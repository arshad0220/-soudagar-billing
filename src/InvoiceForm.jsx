import React, { useEffect, useState, useRef, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import { Form, Button, Card, Col, Row } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Print from './Print.jsx';
import ReactToPrint from 'react-to-print';
import Logo from '../public/logo.png';

const A4_DIMENSIONS = {
  width: '210mm',
  height: '297mm',
};

function InvoiceForm() {
  const componentRef = useRef();

  const [date, setDate] = useState(new Date());
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [managerName] = useState('Soudagar Traders');
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState([{ item: 'Eggs', itemDate: new Date(), qty: '', price: '', total: '' }]);
  const [invoiceData, setInvoiceData] = useState(null);

  const grandTotal = items.reduce((total, item) => total + (parseFloat(item.total) || 0), 0);

  const handleAddItem = () => {
    const newItems = [...items, { item: '', itemDate: new Date(), qty: '', price: '', total: '' }];
    setItems(newItems);
  };

  const handleItemChange = useCallback(
    (e, index) => {
      const { name, value } = e.target;
      const newItems = [...items];
      newItems[index][name] = value;

      const totalPrice = parseInt(newItems[index].qty) * parseFloat(newItems[index].price);
      newItems[index].total = isNaN(totalPrice) ? '' : Math.round(totalPrice).toFixed(0);

      setItems(newItems);
    },
    [items]
  );

  const handleDateChange = useCallback(
    (index, date) => {
      const newItems = [...items];
      newItems[index].itemDate = date;
      setItems(newItems);
    },
    [items]
  );

  const handleDeleteItem = useCallback(
    (index) => {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    },
    [items]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      // Generate invoice number based on the current timestamp
      const generatedInvoiceNumber = Date.now();

      const currentInvoiceData = {
        date,
        invoiceNumber: generatedInvoiceNumber.toString(), // Use the generated timestamp as the invoice number
        managerName,
        customerName,
        items,
        grandTotal,
      };
      setInvoiceData(currentInvoiceData);

      // Optionally update the invoice number in the state if needed for display or other purposes
      setInvoiceNumber(generatedInvoiceNumber.toString());

      // Store the generated invoice data in localStorage for persistence
      localStorage.setItem('invoiceData', JSON.stringify(currentInvoiceData));
    },
    [date, managerName, customerName, items, grandTotal]
  );

  return (
    <div style={{ ...A4_DIMENSIONS, fontFamily: 'Consolas', fontSize: 18 }}>
      <div style={{ textAlign: 'center', marginTop: 5 }}>
        <img src={Logo} alt="Logo" style={{ width: 100, height: 100 }} />
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Date</Form.Label>
          <DatePicker selected={date} onChange={(date) => setDate(date)} className="form-control" />
        </Form.Group>
        <Form.Group>
          <Form.Label>Invoice Number</Form.Label>
          <Form.Control type="text" value={invoiceNumber} readOnly />
        </Form.Group>
        <Form.Group>
          <Form.Label>Manager Name</Form.Label>
          <Form.Control type="text" value={managerName} readOnly />
        </Form.Group>
        <Form.Group>
          <Form.Label>Customer Name</Form.Label>
          <Form.Control type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        </Form.Group>
        {items.map((item, index) => (
          <Card key={index}>
            <Card.Body>
              <Form.Group as={Row}>
                <Col><Form.Control type="text" value={item.item} readOnly /></Col>
                <Col>
                  <DatePicker
                    selected={item.itemDate}
                    onChange={(date) => handleDateChange(index, date)}
                    className="form-control"
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    name="qty"
                    value={item.qty}
                    onChange={(e) => handleItemChange(e, index)}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    name="price"
                    value={item.price}
                    onChange={(e) => handleItemChange(e, index)}
                  />
                </Col>
                <Col><Form.Control type="text" value={item.total} readOnly /></Col>
                <Col><Button onClick={() => handleDeleteItem(index)}>Delete</Button></Col>
              </Form.Group>
            </Card.Body>
          </Card>
        ))}
        <Form.Group>
          <Form.Label>Grand Total</Form.Label>
          <Form.Control type="text" value={Math.round(grandTotal).toFixed(0)} readOnly />
        </Form.Group>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <Button onClick={handleAddItem}>Add Another Item</Button>
          <ReactToPrint trigger={() => <Button type="button">Print</Button>} content={() => componentRef.current} />
          <Button type="submit">Submit</Button>
        </div>
      </Form>
      <div ref={componentRef}>{invoiceData && <Print invoiceData={invoiceData} />}</div>
    </div>
  );
}

export default InvoiceForm;
