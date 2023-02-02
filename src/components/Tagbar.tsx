import { Box, Chip, Divider, ListItem, TextField } from '@mui/material';
import { arrayUnion, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useLayoutEffect, useReducer, useState } from 'react';
import {v4 as uuid} from "uuid"
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { inputInterface } from './AddEntities';
import { entity } from './App';
import { ModalDetails } from './EntityModal';
import "./componentsCSS/Tagbar.css"
type Props = {
    entity?: entity,
    entities: entity[],
    setEntities: React.Dispatch<React.SetStateAction<entity[]>>,
    input?: inputInterface
    setInput?: React.Dispatch<React.SetStateAction<inputInterface>>,
    tagListState: tag[],
    setTagListState: React.Dispatch<React.SetStateAction<tag[]>>
};

export type tag = {
    name : string,
    dateCreated: Date,
    tagId: string
    // More to come
}

export const Tagbar: React.FC<Props> = ({entity, entities, setEntities, input, setInput, tagListState, setTagListState}) => {
    console.log("surely tagbar re-renders")
    const [tagInput, setTagInput] = useState("")
    // const [tagListState, setTagListState] = useState([] as tag[])
    const [tagFieldFocused, setTagFieldFocused] = useState(false)
    
    // A function that allows me to rerender Tagbar
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    
    // For the tagbar to make sure it doesn't suggest things that were already there
    let tagsAlreadyInEntity: tag[] = [];
    if (entity) {
        tagsAlreadyInEntity = entity.tags
    } else {
        if (input) {
            tagsAlreadyInEntity = input.tags
        }
    }

    const { currentUser } = useAuth()

    const renderTagListFirebase = async () => {
        let tagList: tag[] = []
        if (currentUser) {
            const docRef = doc(db, "users", currentUser.uid)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                let data = docSnap.data()
                tagList = (data.tagList as tag[])
            }
            setTagListState(tagList)
        }
    }

    useEffect(() => {
        renderTagListFirebase()
    }, [])

    
    const renderMatches = (tagInput: string, tagListState: tag[]) => {
        let exactMatch = false
        console.log(tagListState, tagFieldFocused)
        if (!tagFieldFocused) return <></>
        return (
            <div style={{maxHeight: "200px", overflow: "overlay"}}>
                {
                    // tagListState should be the list of all tags that have ever been added
                    tagListState &&
                    tagListState.map((tagName) => {
                        if (tagName.name.toLowerCase() === tagInput.toLowerCase()){
                            exactMatch = true
                        }
                        if (tagName.name.toLowerCase().includes(tagInput.toLowerCase()) &&
                        // this line checks if the suggested tag has already been added
                        !(tagsAlreadyInEntity.some(e => e.name.toLowerCase() == tagName.name.toLowerCase()))) {
                        return <ListItem onMouseDown={(e) => handleClick(e, tagName)} key={tagName.name} 
                           className="addExistingTag" >{tagName.name}</ListItem>
                        }

                    })
                }
                <Divider />
                {
                    // will not show this if the tag is already added
                    exactMatch || tagInput.length <= 2 
                    ? <></>
                    :<ListItem onMouseDown={(e) => handleClick(e)} className="addNewTag"> Add the tag: {tagInput}</ListItem>
                }
                
            </div>
        )
    }

    const renderTags = () => {
        // This means that the tagbar is being used by an entity
        // i.e they may already have tags
        console.log(entity)
        console.log("THIS IS ENTITY!!!")
        if (entity) {
            return (
                entity.tags.map((tag: tag) => {
                    return <Chip key={tag.name} sx={{m: 1, cursor: "pointer"}} label={tag.name} 
                    onClick={() => console.log("hi")} onDelete={() => {handleDeleteTag(tag,entity)}}
                    />
                })
            )
        }
        // This is if a tag is being created
        else {
            if (input) {
                console.log("these are the tags", input.tags)
                return (
                    input.tags.map((tag: tag) => {
                        console.log(tag)
                        return <Chip key={tag.name} sx={{m: 1}} label={tag.name}
                        onClick={() => console.log("hi")} onDelete={() => {handleDeleteTag(tag)}}
                        />
                    })
                )
            }
        }
    }

    const handleClick = async (e: React.MouseEvent<HTMLElement>, newTagAdded?: tag ) => {
        
        if (!currentUser) return;
        setTagInput("")

        const randomId = uuid().slice(0,8)

        let newTag: tag;
        if (typeof newTagAdded === "undefined") {
            newTag = {
                name: tagInput,
                dateCreated: new Date(),
                tagId: randomId
            }        
        } else {
            newTag = newTagAdded
        }

        // This means that the tagbar is in an entity that already exists
        if (entity) {
            // this is for the updating of the database
            setEntities( prevState => {
                const idx = prevState.findIndex((e) => e.id == entity.id)
                if (idx !== -1) {
                    let newEntity = entity
                    if (!newEntity.tags.includes(newTag)) {
                        newEntity.tags.push(newTag)
                        prevState[idx] = newEntity
                    }
                } 
                return prevState
            })
            
        } 
        // This means that the tagbar is in an add entity page (creating a new entity)
        // therefore we just need to update the input
        else {
            // Find a smarter way to do this. We know we will pass into props
            // either an entity or setInput. How can we do this?
            if (setInput) {
                setInput(prevState => {
                    if (!prevState.tags.includes(newTag)) {
                        prevState.tags.push(newTag)
                    }
                    return prevState
                })

            }

        }

        // If it is a new tag, add to the tagList in backend
        if (typeof newTagAdded === "undefined") {
            let tagList: tag[] = tagListState
            // Can't create tag with same name
            if (!tagList.some((e) => e.name.toLowerCase() === newTag.name.toLowerCase())) {
                if (currentUser) {
                    const docRef = doc(db, "users", currentUser.uid)
                    const docSnap = await getDoc(docRef)
                    if (docSnap) {
                        if (docSnap.data() && docSnap.data()?.tagList) {
                            await updateDoc(docRef, {
                                tagList: arrayUnion(newTag)
                            })
                        } else {
                            await setDoc(docRef, {
                                tagList: [newTag]
                            })
                        }  
                    }
                        
                    tagList.push(newTag)
        
                    setTagListState(tagList)
                }
            }
        }
    }
    // $%^
    const handleDeleteTag = async (tagDelete: tag, fromEntity?: entity) => {
        // This means it is from AddEntities and the entity has not
        // been created yet
        
        if (typeof fromEntity === "undefined") {
            if (setInput) {
                setInput(prevState => {
                    console.log(tagDelete)
                    if (prevState.tags.includes(tagDelete)) {
                        prevState.tags = prevState.tags.filter((tag) => tag !== tagDelete)
                    }
                    return prevState
                })
            }
        } 
        // This means it has been created and we must update firestore
        else {
            setEntities( prevState => {
                const idx = prevState.findIndex((e) => e.id == fromEntity.id)
                if (idx !== -1) {
                    let newEntity = fromEntity
                    if (newEntity.tags.includes(tagDelete)) {
                        newEntity.tags = newEntity.tags.filter((tag) => tag !== tagDelete)
                        prevState[idx] = newEntity
                    }
                } 
                return prevState
            })

        }
        forceUpdate()
    }
    
    return (
    <div>
        <Box sx={{display: "flex", mr: 2, pr: 2, flexDirection: "column"}}>
            <TextField 
            onChange={(e) => setTagInput(e.target.value)}
            onFocus={() => {
                setTagFieldFocused(true); 
                setTagInput("")}
            }
            onBlur={(e) => {
                setTagInput("")
                setTagFieldFocused(false)
            }}
            value={tagInput}
            label="Search or create tags" 
            variant="standard" 
            sx={{ display: "flex", width: "100%"}}
            name="tags"
            autoComplete='off'
            />
            <div id="tagMatches" style={{display: "flex", flexDirection: "column"}}>
                {renderMatches(tagInput, tagListState)}
                <div style={{flexDirection: "row", textAlign: "left"}}>
                    {renderTags()}
                </div>
            </div>
            
        </Box>
    </div>) 

};
