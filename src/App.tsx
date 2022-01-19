import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import AllEntries from './components/AllEntries';
import AddEntries from './components/AddEntries';
import PrivateButton from './components/PrivateMode';

import ReactDOM from 'react-dom';
import Button from '@mui/material/Button';

import {v4 as uuid} from "uuid"

// import {firebase, db} from "./firebase"
import db from "./firebase"
import { collection, addDoc, getDocs } from 'firebase/firestore';

export interface entry {
  entryId: string,
  title: string,
  description: string,
  private: boolean
}

export interface IState {
  entries : entry[];
  privateMode: boolean
}


function App() {

  // This should change to get the data from firestore
  const [entries, setEntries] = useState<IState["entries"]>([])

  const getFirestoreData = async () => {
    let entryList: IState["entries"] = []
    const querySnapshot = await getDocs(collection(db, "entries"))

    querySnapshot.forEach((doc) => {
      let data = doc.data()
      let entry: entry = {
        entryId: (data.entryId as string),
        title: (data.entryTitle as string),
        description: (data.entryDescription as string),
        private: (data.isPrivate as boolean)
      }
      entryList.push(entry)
    });
    setEntries(entryList)



  }

  useEffect(() => {
    getFirestoreData();
  }, [])


  const [privateMode, setPrivateMode] = useState<IState["privateMode"]>(false)

  return (
    <div className="App">
      <PrivateButton privateMode={privateMode} setPrivateMode={setPrivateMode}/>
      <div className="entryHolder">
        <AddEntries entries={entries} setEntries={setEntries}/>
      </div>
      <div>

        <AllEntries entries={entries} setEntries={setEntries} privateMode={privateMode}/>
      </div>


    </div>
  );
}

export default App;
