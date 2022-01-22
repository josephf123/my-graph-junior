import "../firebase"
import React, {useState, useEffect} from 'react';
import './componentsCSS/App.css';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { firebaseApp, db } from "../firebase"

import AllEntries from './AllEntries';
import AddEntries from './AddEntries';
import PrivateButton from './PrivateMode';
import { Alert, Button, Card, CardContent } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { signOut, updateCurrentUser } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';


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
const App = () => {
  const navigate = useNavigate()
  const { currentUser ,signout } = useAuth()

  const [privateMode, setPrivateMode] = useState<IState["privateMode"]>(false)
  const [error, setError] = useState<string>("")

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


  

  return (
      <>
      <Button onClick={handleLogout}>Log out</Button>
      <PrivateButton privateMode={privateMode} setPrivateMode={setPrivateMode}/>
      <div className="entryHolder">
          <AddEntries entries={entries} setEntries={setEntries}/>
      </div>
      <div>
          <AllEntries entries={entries} setEntries={setEntries} privateMode={privateMode}/>
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