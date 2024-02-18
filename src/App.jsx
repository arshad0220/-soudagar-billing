import React from 'react';
import InvoiceForm from './InvoiceForm.jsx';
import print from './Print.jsx';

const App = () => {
  return (
    <div className="App">
      <InvoiceForm />
      <print />
    </div>
  );
};

export default App;
