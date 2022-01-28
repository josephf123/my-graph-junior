import React, {useState} from "react"
import {IState as Props, entry} from "./App"
import {Box, Card, CardActions, CardContent, Button, Typography, IconButton} from '@mui/material'

import { Delete, LockOpen, LockOutlined } from '@mui/icons-material';

import HoverIconBar from "./HoverIconBar";

import { db } from "../firebase"
import { doc, collection, addDoc, getDocs, deleteDoc, query, where, getDoc } from 'firebase/firestore';

import {v4 as uuid} from "uuid"
import { ModalDetails } from "./EntryModal";

interface IProps {
    entries: entry[],
    setEntries: React.Dispatch<React.SetStateAction<entry[]>>,
    privateMode: boolean,
    modalDetails: ModalDetails
    setModalDetails: React.Dispatch<React.SetStateAction<ModalDetails>>
}

const AllEntries: React.FC<IProps> = ({entries, setEntries, privateMode, modalDetails, setModalDetails}) => {
    console.log("this should run again")
    const renderEntries = () => entries.map((entry) => {
        const AllThings = () => {
            const [isHovering, setIsHovering] = useState(false);
            return (
                <>
                    { !entry.private || privateMode
                    ?
                        <Card 
                        key={entry.entryId}
                        sx={{display: "inline-block", m: 3, width: 500, cursor: "pointer"}} 
                        onMouseEnter={() => setIsHovering(true)} 
                        onMouseLeave={() => setIsHovering(false)} 
                        onClick={() => {
                            setIsHovering(false)
                            const modalDetails = {
                                open: true,
                                entry: entry
                            }
                            setModalDetails(modalDetails)
                        }}>
                            <CardContent>
                                <Typography variant="h5" component="div" gutterBottom>
                                    {entry.title}
                                </Typography>
                                <Typography sx={{ fontSize: 14, pb: 1 }} color="text.secondary">
                                    {entry.description}
                                </Typography>

                                <div style={{height: 28}}>
                                    { isHovering
                                    ? <HoverIconBar entryInd={entry} entries={entries} setEntries={setEntries} setIsHovering={setIsHovering} setModalDetails={setModalDetails}/>
                                    : <></>
                                    }
                                </div>
                           
                            </CardContent>
                        </Card>
                    : <></>
                    }
                </>
            )
        }

        return (
            < AllThings key={uuid()} />
        )

    })
    return (
        <div>
            {renderEntries()}
        </div>
    )

}

export default AllEntries