import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import AllEntries from './components/AllEntries';
import AddEntries from './components/AddEntries';
import PrivateButton from './components/PrivateMode';

import ReactDOM from 'react-dom';
import Button from '@mui/material/Button';

export interface IState {
  entries : {
    title: string,
    description: string,
    private: boolean
  }[];
  privateMode: boolean
}


function App() {

  const [entries, setEntries] = useState<IState["entries"]>([{
    title: "New entry example",
    description: "Lorem Ipsum",
    private: false 
  }])

  const [privateMode, setPrivateMode] = useState<IState["privateMode"]>(false)

  return (
    <div className="App">
      <PrivateButton privateMode={privateMode} setPrivateMode={setPrivateMode}/>
      <AddEntries entries={entries} setEntries={setEntries}/>
      <div className="entryHolder">
        <AllEntries entries={entries} privateMode={privateMode}/>
      </div>

      <Button variant="contained">Hello World</Button>

    </div>
  );
}

export default App;
