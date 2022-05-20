import React, {Dispatch, SetStateAction, useState} from "react"
import {entity, entry, IState as Props, journal, profundity, source} from "./App"
import {Box, Card, CardActions, CardContent, Button, Typography, TextField, Switch, FormControlLabel, Select, FormControl, InputLabel} from '@mui/material'
import "./componentsCSS/AddEntities.css"
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { db } from "../firebase"
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';

import {v4 as uuid} from "uuid"
import { useAuth } from "../contexts/AuthContext"
import { Tagbar } from "./Tagbar"
import { tag } from "./Tagbar"
import { ChangeDataTypeEntries } from "./ChangeDataTypeEntries";
import { entityDataArray } from "./ChangeDataTypeEntries"
import { AddTypeEntry } from "./AddTypeEntry";
import { AddTypeJournal } from "./AddTypeJournal";
import { AddTypeProfundity } from "./AddTypeProfundity";

export type EntityData = typeof entityDataArray[number]

interface IProps {
    entities: Props["entities"],
    setEntities: React.Dispatch<React.SetStateAction<Props["entities"]>>,
    tagInputNotEmpty: boolean
    setTagInputNotEmpty: React.Dispatch<React.SetStateAction<boolean>>,
    entityDataType: EntityData,
    setEntityDataType: React.Dispatch<React.SetStateAction<EntityData>>,
    tagListState: tag[],
    setTagListState: React.Dispatch<React.SetStateAction<tag[]>>
}
export interface inputInterface {
    type: EntityData,
    title: string,
    description: string,
    private: boolean,
    tags: tag[],
    sources: source[]
}

export const handleDifferentDataTypes = (entityDataType: EntityData,
    id: string, description: string, tags: tag[], dateCreated: Date,
     dateModified: Date, privateVal: boolean, title?: string, sources?: source[]
    ): entry|journal|profundity|undefined => {
    if (entityDataType === "entry") {
        if (title) {
            const entry: entry = {
                type: entityDataType,
                id: id,
                title: title ,
                description: description,
                private: privateVal,
                tags: tags,
                dateCreated: dateCreated,
                dateModified: dateModified
            }
            return entry

        }
    } else if (entityDataType === "journal") {
        if (title) {
            const journal: journal = {
                type: entityDataType,
                id: id,
                title: title ,
                description: description,
                private: privateVal,
                tags: tags,
                dateCreated: dateCreated,
                dateModified: dateModified
            }
            return journal

        }
    } else if (entityDataType == "profundity") {
        console.log(sources)
        if (sources) {
            const profundity: profundity = {
                type: entityDataType,
                id: id,
                description: description,
                private: privateVal,
                tags: tags,
                dateCreated: dateCreated,
                dateModified: dateModified,
                sources: sources
            }
            return profundity

        }
    } else {
        return undefined
    }
}

const displayAddEntity = (
    entityDataType: EntityData,
    setEntityDataType: React.Dispatch<React.SetStateAction<EntityData>>,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    input: inputInterface,
    setInput: Dispatch<SetStateAction<inputInterface>>
    ) => {
    if (entityDataType == "entry") {
        return <AddTypeEntry  input={input} setInput={setInput} handleChange={handleChange} entityDataType={entityDataType} setEntityDataType={setEntityDataType}/>
    } else if (entityDataType == "journal") {
        return <AddTypeJournal input={input} setInput={setInput} handleChange={handleChange} entityDataType={entityDataType} setEntityDataType={setEntityDataType} />
    } else if (entityDataType == "profundity") {
        return <AddTypeProfundity input={input} setInput={setInput} handleChange={handleChange} entityDataType={entityDataType} setEntityDataType={setEntityDataType} />
    } else {
        return <p>Error!</p>
    }
}




export const AddEntities: React.FC<IProps> = ({entities, setEntities, tagInputNotEmpty ,setTagInputNotEmpty, entityDataType, setEntityDataType,
     tagListState, setTagListState}) => {
    console.log("does this re-render????")
    const {currentUser} = useAuth()

    const [input, setInput] = React.useState<inputInterface>({
        type: entityDataType,
        title: "",
        description: "",
        private: false,
        tags: ([] as tag[]),
        sources: ([] as source[])
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
        let newEntity: entity;
        let noEntity = false
        let createdEntity = handleDifferentDataTypes(entityDataType, randomId, input.description,
             input.tags, currentDate, currentDate, input.private, input.title, input.sources)
        
        console.log(createdEntity)
        if (typeof createdEntity !== "undefined") {
            newEntity = createdEntity
        } else {
            console.log('here?4312')
            noEntity = true
            newEntity = {} as entry
        }
        
        if (!noEntity) {
            setEntities([newEntity, ...entities])
            // Resets input after entry has been added
            setInput({
                type: entityDataType,
                title: "",
                description: "",
                // this means if someone presses the button, it will stay on until turned off
                private: input.private,
                tags: ([] as tag[]),
                sources: ([] as source[])
            })
            setTagInputNotEmpty(false)
            try {
                if (currentUser){
                    console.log(input.tags, "HELLO!")
                    // $%^
                    let entitySubmit: entity = newEntity
                    const docRef = await setDoc(doc(db, "users", currentUser.uid, "entities", randomId), entitySubmit);

                    console.log("Document written with ID: ", randomId);
                }

            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }

    }


    return (
        <Card sx={{m: 3}}>
            <CardContent className="inputHolder">
                { displayAddEntity(entityDataType, setEntityDataType, handleChange, input, setInput)}
                <Tagbar input={input} setInput={setInput} entities={entities} 
                setEntities={setEntities} tagListState={tagListState} setTagListState={setTagListState}/>
                <FormControlLabel control={<Switch
                onChange={ handleChange }
                checked={input.private}
                name="private"
                sx={{textAlign: "center"}}
                />} label="Private mode" sx={{margin: "auto"}}/>
                
                <Button variant="contained" onClick={ handleClick } >Submit</Button>
            </CardContent>
        </Card>
    )
}
