import React, {useState} from "react"
import {entry, IState as Props} from "./App"
import {Box, Card, CardActions, CardContent, Button, Typography, TextField, Switch, FormControlLabel} from '@mui/material'
import "./componentsCSS/AddEntries.css"

import { db } from "../firebase"
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';

import {v4 as uuid} from "uuid"
import { useAuth } from "../contexts/AuthContext"
import { Tagbar } from "./Tagbar"
import { tag } from "./Tagbar"


interface IProps {
    entries: Props["entries"],
    setEntries: React.Dispatch<React.SetStateAction<Props["entries"]>>,
    tagInputNotEmpty: boolean
    setTagInputNotEmpty: React.Dispatch<React.SetStateAction<boolean>>
}

export type inputType = {
    title: string,
    description: string,
    private: boolean,
    tags: tag[]
}


export const AddEntries: React.FC<IProps> = ({entries, setEntries, tagInputNotEmpty ,setTagInputNotEmpty}) => {
    console.log("does this re-render????")
    const {currentUser} = useAuth()

    const [input, setInput] = React.useState({
        title: "",
        description: "",
        private: false,
        tags: ([] as tag[])
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
        let currentDate = new Date()
        const randomId = uuid().slice(0,8)
        const newEntry: entry = {
            entryId: randomId,
            title: input.title,
            description: input.description,
            private: input.private,
            tags: input.tags,
            dateCreated: currentDate,
            dateModified: currentDate
        }
        setEntries([newEntry, ...entries])
        // Resets input after entry has been added
        setInput({
            title: "",
            description: "",
            // this means if someone presses the button, it will stay on until turned off
            private: input.private,
            tags: ([] as tag[])
        })
        setTagInputNotEmpty(false)
        try {
            if (currentUser){
                console.log(input.tags, "HELLO!")
                const entrySumbit: entry = {
                    entryId: randomId,
                    title: input.title,
                    description: input.description,
                    private: input.private, 
                    tags: input.tags,
                    dateCreated: currentDate,
                    dateModified: currentDate
                }
                const docRef = await setDoc(doc(db, "users", currentUser.uid, "entries", randomId), entrySumbit);

                console.log("Document written with ID: ", randomId);
            }

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
                    sx={{ display: "flex", width: "100%", mb: 3}}
                    multiline

                    name="description"
                    
                    />
                </Box>
                <Tagbar input={input} setInput={setInput} entries={entries} 
                setEntries={setEntries}/>
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
