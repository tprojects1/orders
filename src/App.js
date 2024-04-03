import React, { useState } from 'react';
import { Orders } from './views';
import { Header } from './components';
import './styles/global.scss';

const App = () => {
  const [headerText, setHeaderText] = useState('asf');

  return (
    <>
      <Header text={headerText}></Header>
      <Orders
        headerText={headerText}
        setHeaderText={setHeaderText}
      ></Orders>
    </>
  );
};

export default App;
