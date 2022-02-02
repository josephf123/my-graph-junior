import "../firebase"
import React, {useState, useEffect} from 'react';
import './componentsCSS/App.css';
import { collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { firebaseApp, db } from "../firebase"

import AllEntries from './AllEntries';
import { AddEntries } from './AddEntries';
import PrivateButton from './PrivateMode';
import { Alert, Button, Card, CardContent } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { signOut, updateCurrentUser } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import { EntryModal, ModalDetails } from "./EntryModal";
import { tag } from "./Tagbar";

export interface entry {
  entryId: string,
  title: string,
  description: string,
  tags: tag[],
  private: boolean,
  dateCreated: Date,
  dateModified: Date
}

export interface IState {
  entries : entry[];
  privateMode: boolean
}
const App = () => {
  const navigate = useNavigate()
  const { currentUser ,signout } = useAuth()

  const [privateMode, setPrivateMode] = useState<IState["privateMode"]>(false)
  const [error, setError] = useState<string>("")
  const [modalDetails, setModalDetails] = useState({open: false, entry: {} as entry})


  const handleLogout = () => {
      setError("")
      signout()
      .then(() => {
          navigate("/login")
      })
      .catch(() => {
          setError("Failed to logout")
      })
      
  }

  const [entries, setEntries] = useState<IState["entries"]>([])

  const getFirestoreData = async () => {

      let entryList: IState["entries"] = []
      if (currentUser) {
        const querySnapshot = await getDocs(query(collection(db, "users", currentUser.uid, "entries"), orderBy("dateModified")))
        querySnapshot.forEach((doc) => {
            let data = doc.data()
            let entry: entry = {
                entryId: (data.entryId as string),
                title: (data.entryTitle as string),
                description: (data.entryDescription as string),
                tags: (data.tags as tag[]), 
                private: (data.isPrivate as boolean),
                dateCreated: (data.dateCreated as Date),
                dateModified: (data.dateModified as Date)
            }
            console.log(entry)
            entryList.push(entry)
        });
        setEntries(entryList.reverse())
      }


  }

  useEffect(() => {
      getFirestoreData();
  }, [])


  

  return (
      <>
      <Button onClick={handleLogout}>Log out</Button>
      <PrivateButton privateMode={privateMode} setPrivateMode={setPrivateMode}/>
      <div className="entryHolder">
          <AddEntries entries={entries} setEntries={setEntries}/>
      </div>
      <div className="entryModal">
        <EntryModal modalDetails={modalDetails} setModalDetails={setModalDetails} entries={entries} setEntries={setEntries}/>
      </div>
      <div>
          <AllEntries entries={entries} setEntries={setEntries} privateMode={privateMode} modalDetails={modalDetails} setModalDetails={setModalDetails}/>
      </div>
      <Card>
          <CardContent>
              <h2>Profile</h2>
              {error && <Alert severity='error'>{error}</Alert>}
              <strong>Email: {currentUser!.email}</strong>
              <Link to="update-profile">Update profile</Link>

          </CardContent>
      </Card>

      </>
  )

}

export default App