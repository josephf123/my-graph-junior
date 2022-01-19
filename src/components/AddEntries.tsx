import React, {useState} from "react"
import {IState as Props} from "../App"
import {Box, Card, CardActions, CardContent, Button, Typography, TextField, Switch, FormControlLabel} from '@mui/material'
import "./componentsCSS/AddEntries.css"

import db from "../firebase"
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';

import {v4 as uuid} from "uuid"


interface IProps {
    entries: Props["entries"],
    setEntries: React.Dispatch<React.SetStateAction<Props["entries"]>>
}


const AddEntries: React.FC<IProps> = ({entries, setEntries}) => {
    

    const [input, setInput] = React.useState({
        title: "",
        description: "",
        private: false
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {checked, name, value, type} = e.target
        // Allows for checkbox to be updated
        const assigningVal = type === "checkbox" ? checked : value
        setInput({
            ...input,
            [name]: assigningVal
        })
    }

    const handleClick = async () => {
        // Add input field as most recent entry
        const randomId = uuid().slice(0,8)
        setEntries([
            ...entries,
            {
                entryId: randomId,
                title: input.title,
                description: input.description,
                private: input.private
            }
            
        ])
        // Resets input after entry has been added
        setInput({
            title: "",
            description: "",
            // this means if someone presses the button, it will stay on until turned off
            private: input.private
        })
        try {
            const docRef = await setDoc(doc(db, "entries", randomId), {
                userId: 1,
                entryId: randomId,
                entryTitle: input.title,
                entryDescription: input.description,
                isPrivate: input.private
            });
            console.log("Document written with ID: ", randomId);
        } catch (e) {
            console.error("Error adding document: ", e);
        }


    }


    return (
        <Card sx={{m: 3, width: 500}}>
            <CardContent className="inputHolder">
                <Box sx={{display: "flex"}}>
                    <TextField 
                    onChange={handleChange}
                    value={input.title}
                    label="Title" variant="standard"
                    sx={{mr: "auto", mb: 1}}
                    name="title"
                    />
                </Box>
                <Box sx={{display: "flex", mr: 2, pr: 2}}>
                    <TextField 
                    onChange={handleChange}
                    value={input.description}
                    label="Description" 
                    variant="standard" 
                    rows={5}
                    sx={{ display: "flex", width: "100%", mb: 2}}
                    multiline

                    name="description"
                    
                    />
                </Box>
                <FormControlLabel control={<Switch
                onChange={ handleChange }
                checked={input.private}
                name="private"
                sx={{textAlign: "center"}}
                />} label="Private mode" sx={{margin: "auto"}}/>
                <Button variant="contained" onClick={ handleClick } sx={{mr: 4}}>Submit</Button>
            </CardContent>
        </Card>
    )
}

export default AddEntries