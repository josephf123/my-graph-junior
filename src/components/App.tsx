import "../firebase"
import React, {useState, useEffect} from 'react';
import './componentsCSS/App.css';
import { collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { firebaseApp, db } from "../firebase"

import AllEntities from './AllEntities';
import { AddEntities, EntityData } from './AddEntities';
import PrivateButton from './PrivateMode';
import { Alert, AppBar, Box, Button, Card, CardContent, Drawer, FormControlLabel, IconButton, List, Switch, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { Link, useNavigate } from 'react-router-dom';
import { signOut, updateCurrentUser } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import { EntityModal, ModalDetails } from "./EntityModal";
import { tag } from "./Tagbar";
import { SearchBar } from "./SearchBar";

interface allEntities {
    // This is an index signature. 
    // pretty much means I can now index entry if I want to find something
    // I had to use it for Object.keys(entry).some((k) => ...)
    type: EntityData,
    [x: string]: any;
    id: string,
    private: boolean
    dateCreated: Date,
    dateModified: Date,
    tags: tag[]
}
export interface entry extends allEntities {
  type: "entry",
  title: string,
  description: string,
} 
export interface journal extends allEntities {
  type: "journal",
  title: string,
  description: string,
} 
export interface profundity extends allEntities {
  type: "profundity",
  description: string,
  sources: source[],
} 
export interface source {
  name: string,
  dateCreated: Date,
  sourceId: string
}

export type entity = entry | journal | profundity 

export interface IState {
  entities : entity[];
  privateMode: boolean
}
const App = () => {
  console.log("App is re-rendering", )
  const navigate = useNavigate()
  const { currentUser ,signout } = useAuth()

  const [privateMode, setPrivateMode] = useState<IState["privateMode"]>(false)
  const [error, setError] = useState<string>("")
  const [modalDetails, setModalDetails] = useState({open: false, entity: {} as entity})
  const [tagInputNotEmpty, setTagInputNotEmpty] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [entityDataType, setEntityDataType] = React.useState<EntityData>("entry")

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

  const [entities, setEntities] = useState<IState["entities"]>([])

  const getFirestoreData = async () => {

      let entityList: IState["entities"] = []
      if (currentUser) {
        const querySnapshot = await getDocs(query(collection(db, "users", currentUser.uid, "entities"), orderBy("dateCreated", "desc")))
        querySnapshot.forEach((doc) => {
            let data = doc.data()
            let entity: entity;
            let entityIsDefined = true
            if (data.type === "entry") {
                entity = data as entry
            } else if (data.type === "journal") {
                entity = data as journal
            } else if (data.type === "profundity") {
                entity = data as profundity
            } else {
                entity = {} as entry
                entityIsDefined = false
            }
            // let entry: entry = {
            //     entryId: (data.entryId as string),
            //     title: (data.title as string),
            //     description: (data.description as string),
            //     tags: (data.tags as tag[]), 
            //     private: (data.private as boolean),
            //     dateCreated: (data.dateCreated as Date),
            //     dateModified: (data.dateModified as Date)
            // }
            if (entityIsDefined) {
                console.log(entity)
                entityList.push(entity)
            }
        });
        setEntities(entityList)
      }


  }

  useEffect(() => {
      getFirestoreData();
  }, [])


  

  return (
      <>
      <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" >
                <Toolbar>
                    <Box sx={{display: "flex", justifyContent: "space-between", width: "100%"}}>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={() => setDrawerOpen(!drawerOpen)}
                            >
                        <MenuIcon />
                        
                        </IconButton>
                        <Typography component="div" sx={{align: "center", pt: {xs: 1, md: 0}, fontSize: {xs: "1rem", md: "2rem"}}}>
                            My Graph Junior
                        </Typography>
                        <Box sx={{width: "48px"}}></Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} >
                <List sx={{width: {xs: "170px", sm: "250px"}}}>
                    <p>Hello there</p>
                    <PrivateButton privateMode={privateMode} setPrivateMode={setPrivateMode}/>

                    <Button sx={{width: "100%"}}>
                        <Link to="update-profile">Update profile</Link>
                    </Button>
                    <Button sx={{width: "100%"}} onClick={handleLogout}>Log out</Button>
                </List>
            </Drawer>
        </Box>
      
      <div>
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
      <div className="entityHolder">
          <AddEntities entities={entities} setEntities={setEntities} tagInputNotEmpty={tagInputNotEmpty} setTagInputNotEmpty={setTagInputNotEmpty}
          entityDataType={entityDataType} setEntityDataType={setEntityDataType}
          />
      </div>
      <div className="entityModal">
        <EntityModal modalDetails={modalDetails} setModalDetails={setModalDetails} entities={entities} setEntities={setEntities}/>
      </div>
      <div>
          <AllEntities entities={entities} setEntities={setEntities} privateMode={privateMode} modalDetails={modalDetails} 
          setModalDetails={setModalDetails} searchQuery={searchQuery}/>
      </div>
      {/* <Card>
          <CardContent>
              <h2>Profile</h2>
              {error && <Alert severity='error'>{error}</Alert>}
              <strong>Email: {currentUser!.email}</strong>
              

          </CardContent>
      </Card> */}

      </>
  )

}

export default App