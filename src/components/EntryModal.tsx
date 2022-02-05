import { Box, Card, CardContent, FilledInput, FormControlLabel, Modal, Switch, TextField, Typography } from "@mui/material"
import { doc, setDoc } from "firebase/firestore"
import React, { useEffect, useRef, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { db } from "../firebase"
import { entry } from "./App"

import "./componentsCSS/EntryModal.css"
import { tag, Tagbar } from "./Tagbar"

export type ModalDetails = {
    open: boolean,
    entry: entry
}
interface IProps {
    modalDetails : ModalDetails,
    setModalDetails: React.Dispatch<React.SetStateAction<ModalDetails>>,
    entries:entry[],
    setEntries: React.Dispatch<React.SetStateAction<entry[]>>,
}


export const EntryModal: React.FC<IProps> = ({modalDetails, setModalDetails, entries, setEntries}) => {

    const { currentUser } = useAuth()
    console.log(modalDetails)
    const [input, setInput] = React.useState({
        title: "",
        description: "",
        private: false,
        tags: ([] as tag[])
    })

    // This allows for input to be set once the props are passed in
    // from modalDetails
    useEffect(() => {
        console.log(modalDetails)
        setInput({
            title: modalDetails.entry.title,
            description: modalDetails.entry.description,
            private: modalDetails.entry.private,
            tags: modalDetails.entry.tags // can't communicate with modalDetails from tagbar
        })

    }, [modalDetails])


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {checked, name, value, type} = e.target
        // Allows for checkbox to be updated
        const assigningVal = type === "checkbox" ? checked : value
        setInput({
            ...input,
            [name]: assigningVal
        })
    }

    const handleSubmit = async () => {
        let currentDate = new Date()
        const entrySumbit: entry = {
            entryId: modalDetails.entry.entryId,
            title: input.title,
            description: input.description,
            private: input.private,
            tags: modalDetails.entry.tags,
            dateCreated: modalDetails.entry.dateCreated,
            dateModified: currentDate
        }
        setEntries( prevState => {
            const idx = prevState.findIndex((e) => e.entryId == modalDetails.entry.entryId)
            prevState[idx] = entrySumbit
            return prevState
        })
        try {
            if (currentUser){
                const docRef = await setDoc(doc(db, "users", currentUser.uid, "entries", modalDetails.entry.entryId), entrySumbit);

                console.log("Document written with ID: ", modalDetails.entry.entryId);
            }

        } catch (e) {
            console.error("Error adding document: ", e);
        }

    }

    return (
        <>
    
        <Modal
        open={modalDetails ? modalDetails.open: false}
        onClose={() => {
            setModalDetails({open: false, entry: {} as entry})
            handleSubmit();
        }}
        >
            <Card className={modalDetails.open ? "entryModalOpen" : "entryModalClosed"}>
                <CardContent className="cardContentModal">
                    <Box sx={{display: "flex"}}>
                        <TextField 
                        onChange={handleChange}
                        value={input.title}
                        label="" variant="standard"
                        sx={{mr: "auto", mb: 1}}
                        name="title"
                        />
                    </Box>
                    <Box sx={{display: "flex", mr: 2, pr: 2}}>
                        <FilledInput 
                        onChange={handleChange}
                        value={input.description}
                        minRows={8}
                        maxRows={12}
                        sx={{ display: "flex", width: "100%", mb: 2}}
                        multiline
                        disableUnderline={true}
                        name="description"
                        className="textfieldDescription"
                        />
                    </Box>
                    <Tagbar entry={modalDetails.entry} entries={entries} setEntries={setEntries}/>
                    <FormControlLabel control={<Switch
                    onChange={ handleChange }
                    checked={input.private}
                    name="private"
                    sx={{textAlign: "center", margin: "auto"}}
                    />} label="Private mode" sx={{margin: "auto", textAlign: "center"}}/>
                    </CardContent>
            </Card>
        </Modal>
        
        </>
        
    )
}

