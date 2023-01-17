import { Box, Card, CardContent, FilledInput, FormControlLabel, Modal, Switch, TextField, Typography } from "@mui/material"
import { doc, setDoc } from "firebase/firestore"
import React, { useEffect, useRef, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { db } from "../firebase"
import { inputInterface } from "./AddEntities"
import { entity, source } from "./App"

import "./componentsCSS/EntityModal.css"
import { tag, Tagbar } from "./Tagbar"

export type ModalDetails = {
    open: boolean,
    entity: entity
}
interface IProps {
    modalDetails : ModalDetails,
    setModalDetails: React.Dispatch<React.SetStateAction<ModalDetails>>,
    entities : entity[],
    setEntities: React.Dispatch<React.SetStateAction<entity[]>>,
    tagListState: tag[],
    setTagListState: React.Dispatch<React.SetStateAction<tag[]>>
}

interface modalInputInterface {
    title: string,
    description: string,
    private: boolean,
    tags: tag[],
    sources?: source[]
}

export const EntityModal: React.FC<IProps> = ({modalDetails, setModalDetails, entities, setEntities, tagListState, setTagListState}) => {
    console.log(modalDetails.entity.type)
    const { currentUser } = useAuth()
    console.log(modalDetails)
    const [input, setInput] = React.useState<modalInputInterface>({
        title: "",
        description: "",
        private: false,
        tags: ([] as tag[]),
        sources: ([] as source[])
    })

    // This allows for input to be set once the props are passed in
    // from modalDetails
    useEffect(() => {

        // if (modalDetails.entity.type === "entry" || modalDetails.entity.type === "journal") {
        setInput({
            title: modalDetails.entity.title,
            description: modalDetails.entity.description,
            private: modalDetails.entity.private,
            tags: modalDetails.entity.tags, // can't communicate with modalDetails from tagbar,
        })
        // } else if (modalDetails.entity.type === "profundity") {
        //     setInput({
        //         type: modalDetails.entity.type,
        //         description: modalDetails.entity.description,
        //         private: modalDetails.entity.private,
        //         tags: modalDetails.entity.tags, // can't communicate with modalDetails from tagbar,
        //         sources: modalDetails.entity.sources
        //     })
        // }

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
        // $%^

        // let entitySubmit = handleDifferentDataTypes(modalDetails.entity.type, modalDetails.entity.id, input.description,
        //     modalDetails.entity.tags, modalDetails.entity.dateCreated, currentDate, input.private, input.title, input.sources)
        let entitySubmit: entity = {
            id: modalDetails.entity.id,
            // if title is undefined, title will be empty string
            title: (input.title) ? input.title : "",
            description: input.description,
            private: input.private,
            tags: modalDetails.entity.tags,
            dateCreated: modalDetails.entity.dateCreated,
            dateModified: currentDate
        }


        if (entitySubmit !== undefined) {
            setEntities( prevState => {
                const idx = prevState.findIndex((e) => e.id == modalDetails.entity.id)
                prevState[idx] = entitySubmit!
                return prevState
            })
            try {
                if (currentUser){
                    const docRef = await setDoc(doc(db, "users", currentUser.uid, "entities", modalDetails.entity.id), entitySubmit);
    
                    console.log("Document written with ID: ", modalDetails.entity.id);
                }
    
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }
        // const entrySumbit: entry = {
        //     id: modalDetails.entry.id,
        //     title: input.title,
        //     description: input.description,
        //     private: input.private,
        //     tags: modalDetails.entry.tags,
        //     dateCreated: modalDetails.entry.dateCreated,
        //     dateModified: currentDate
        // }
        // $%^
        

    }

    return (
        <>
    
        <Modal
        open={modalDetails ? modalDetails.open: false}
        onClose={() => {
            setModalDetails({open: false, entity: {} as entity})
            handleSubmit();
        }}
        >
            <Card className={modalDetails.open ? "entityModalOpen" : "entityModalClosed"} 
            sx={{width: {xs: "350px", sm: "550px"}}}>
                <CardContent className="cardContentModal">
                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                        <TextField 
                        onChange={handleChange}
                        value={input.title}
                        label="" variant="standard"
                        sx={{mr: "auto", mb: 1}}
                        name="title"
                        />
                    </Box>
                        
                    <Box sx={{display: "flex"}}>
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
                    
                    <Tagbar entity={modalDetails.entity} entities={entities} setEntities={setEntities} tagListState={tagListState} setTagListState={setTagListState}/>
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

