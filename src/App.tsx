import React from 'react';

import styled from 'styled-components/macro'

import logo from './logo.svg';
import './App.css';

const StyledHeader = styled.header`
  background-color: brown;
`;

function App() {
  return (
    <div className="App">
      <StyledHeader className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </StyledHeader>
    </div>
  );
}

export default App;
