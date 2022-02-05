import { Box, Chip, Divider, ListItem, TextField } from '@mui/material';
import { arrayUnion, collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {v4 as uuid} from "uuid"
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { inputType } from './AddEntries';
import { entry } from './App';
import { ModalDetails } from './EntryModal';
import "./componentsCSS/Tagbar.css"
type Props = {
    entry?: entry,
    entries: entry[],
    setEntries: React.Dispatch<React.SetStateAction<entry[]>>,
    input?: inputType
    setInput?: React.Dispatch<React.SetStateAction<inputType>>
};

export type tag = {
    name : string,
    dateCreated: Date,
    tagId: string
    // More to come
}

export const Tagbar: React.FC<Props> = ({entry, entries, setEntries, input, setInput}) => {
    console.log("surely tagbar re-renders")
    const [tagInput, setTagInput] = useState("")
    const [tagListState, setTagListState] = useState([] as tag[])
    const [tagFieldFocused, setTagFieldFocused] = useState(false)
    
    
    // For the tagbar to make sure it doesn't suggest things that were already there
    let tagsAlreadyInEntry: tag[] = [];
    if (entry) {
        tagsAlreadyInEntry = entry.tags
    } else {
        if (input) {
            tagsAlreadyInEntry = input.tags
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
            <div style={{maxHeight: "200px", overflow: "scroll"}}>
                {
                    // tagListState should be the list of all tags that have ever been added
                    tagListState.map((tagName) => {
                        if (tagName.name.toLowerCase() === tagInput.toLowerCase()){
                            exactMatch = true
                        }
                        if (tagName.name.toLowerCase().includes(tagInput.toLowerCase()) &&
                        // this line checks if the suggested tag has already been added
                        !(tagsAlreadyInEntry.some(e => e.name.toLowerCase() == tagName.name.toLowerCase()))) {
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

        // This means that the tagbar is being used by an entry
        // i.e they may already have tags
        if (entry) {
            return (
                entry.tags.map((tag: tag) => {
                    return <Chip key={tag.name} sx={{m: 1, cursor: "pointer"}} label={tag.name} />
                })
            )
        }
        // This is if a tag is being created
        else {
            if (input) {
                return (
                    input.tags.map((tag: tag) => {
                        return <Chip key={tag.name} sx={{m: 1}} label={tag.name}/>
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

        // This means that the tagbar is in an entry that already exists
        if (entry) {
            // this is for the updating of the database
            setEntries( prevState => {
                const idx = prevState.findIndex((e) => e.entryId == entry.entryId)
                if (idx !== -1) {
                    let newEntry = entry
                    if (!newEntry.tags.includes(newTag)) {
                        newEntry.tags.push(newTag)
                        prevState[idx] = newEntry
                    }
                } 
                return prevState
            })
            // Add to backend list of all tags
            
        } 
        // This means that the tagbar is in an add entry page (creating a new entry)
        // therefore we just need to update the input
        else {
            // Find a smarter way to do this. We know we will pass into props
            // either an entry or setInput. How can we do this?
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
                    // const docSnap = await getDoc(docRef)
                    await updateDoc(docRef, {
                        tagList: arrayUnion(newTag)
                    })
                    
                    tagList.push(newTag)
        
                    setTagListState(tagList)
                }
            }
        }
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
                <div style={{display: "flex", flexDirection: "row"}}>
                    {renderTags()}
                </div>
            </div>
            
        </Box>
    </div>) 

};
