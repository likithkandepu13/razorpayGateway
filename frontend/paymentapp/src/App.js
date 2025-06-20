// import React from 'react';
// import './App.css';
// import PaymentForm from './components/paymentForm';

// function App() {
//   return (
//     <div className="App">
//       <h1>Basic Payment App</h1>
//       <PaymentForm />
//     </div>
//   );
// }

// export default App;


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaymentForm from '../src/components/paymentForm';
import PaymentHistory from '../src/components/PaymentHistory';

function App() {
  return (
    <div>
      <PaymentForm />
      <PaymentHistory />
      <ToastContainer />
    </div>
  );
}
export default App;