import { Box, Chip, Divider, ListItem, TextField } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import React from 'react';
import {v4 as uuid} from "uuid"
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { inputType } from './AddEntries';
import { entry } from './App';
import { ModalDetails } from './EntryModal';

type Props = {
    entry?: entry,
    entries: entry[],
    setEntries: React.Dispatch<React.SetStateAction<entry[]>>,
    input?: inputType
    setInput?: React.Dispatch<React.SetStateAction<inputType>>,
    setModalDetails? : React.Dispatch<React.SetStateAction<ModalDetails>>,
};

export type tag = {
    name : string,
    dateCreated: Date,
    tagId: string
    // More to come
}

export const Tagbar: React.FC<Props> = ({entry, entries, setEntries, input, setInput, setModalDetails}) => {
    console.log("durely tagbar re-renders")
    console.log(input)
    const [tagInput, setTagInput] = React.useState("")
    const [tagListState, setTagListState] = React.useState({} as tag[])
    const [tagFieldFocused, setTagFieldFocused] = React.useState(false)
    let tagsAlreadyInEntry: tag[] = [];
    if (entry) {
        tagsAlreadyInEntry = entry.tags
    } else {
        if (input) {
            tagsAlreadyInEntry = input.tags
        }
    }

        // let tagList = []
        // const querySnapshot = await getDocs(collection(db, "users", currentUser.uid, "tags"))
        // querySnapshot.forEach((doc) => {
        //     let data = doc.data()
        //     tagList.push(data.name)
        // })

    const { currentUser } = useAuth()

    
    const renderMatches = (tagInput: string, tagsAlreadyInEntry: tag[]) => {
        let exactMatch = false
        if (!tagFieldFocused) return <></>
        console.log(tagsAlreadyInEntry)
        return (
            <div>
                {
                    // tagsAlreadyInEntry should be the list of all tags
                    tagsAlreadyInEntry.map((tagName) => {
                        if (tagName.name.toLowerCase() === tagInput.toLowerCase()){
                            console.log("OKOKOKOKOKO")
                            exactMatch = true
                        } else {
                            if (tagName.name.toLowerCase().includes(tagInput.toLowerCase()) &&
                            // this line checks if the suggested tag has already been added
                            !(tagsAlreadyInEntry.some(e => e.name.toLowerCase() != tagInput.toLowerCase()))) {
                            return <ListItem onClick={(e) => handleClick(e)} key={tagName.name} 
                                style={{display: "flex", borderLeft: "1px solid lightgrey", borderRight: "1px solid lightgrey", cursor: "pointer"}} >{tagName.name}</ListItem>
                            }
                        }    

                    })
                }
                <Divider />
                {
                    // will not show this if the tag is already added
                    exactMatch || tagInput.length <= 2 
                    ? <></>
                    :<ListItem onClick={(e) => handleClick(e)} style={{display: "flex", borderBottom: "1px solid lightgrey",
                    borderLeft: "1px solid lightgrey", borderRight: "1px solid lightgrey", cursor: "pointer"}}> Add the tag: {tagInput}</ListItem>
                }
                
            </div>
        )
    }

    const renderTags = () => {

        // This means that the tagbar is being used by an entry
        // i.e they may already have tags
        if (entry) {
            console.log(entry)
            return (
                entry.tags.map((tag: tag) => {
                    return <Chip key={tag.name} sx={{m: 1, cursor: "pointer"}} label={tag.name} />
                })
            )
        } else {
            if (input) {
                return (
                    input.tags.map((tag: tag) => {
                        console.log("hello there", tag)
                        return <Chip key={tag.name} sx={{m: 1}} label={tag.name}/>
                    })
                )
            }
        }

        // return (
        //     <Box sx={{m: 1, textAlign: "left"}}>
        //         <Chip sx={{m: 1}} label="all the tags I have"/>
        //         <Chip sx={{m:1}} label="another one" />
        //         <Chip sx={{m:1}} label="another one" />
        //         <Chip sx={{m:1}} label="another one" />
        //         <Chip sx={{m:1}} label="another one" />
        //     </Box>

        // )
    }

    const handleClick = async (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation()
        e.preventDefault()
        console.log("ami being clicked?")
        if (!currentUser) return;
        if (tagInput.length <= 2) return;
        console.log(tagInput)
        const randomId = uuid().slice(0,8)
        const newTag: tag = {
            name: tagInput,
            dateCreated: new Date(),
            tagId: randomId
        }
        // This means that the tagbar is in an entry that already exists
        if (entry) {
            console.log(entry)
            // this is for the updating of the database
            setEntries( prevState => {
                console.log(prevState)
                const idx = prevState.findIndex((e) => e.entryId == entry.entryId)
                if (idx !== -1) {
                    let newEntry = entry
                    newEntry.tags.push(newTag)
                    prevState[idx] = newEntry
                } 
                console.log(prevState)
                return prevState
            })
            // Do firebase stuff here
        } 
        // This means that the tagbar is in an add entry page (creating a new entry)
        // therefore we just need to update the input
        else {
            // Find a smarter way to do this. We know we will pass into props
            // either an entry or setInput. How can we do this?
            if (setInput) {
                setInput(prevState => {
                    prevState.tags.push(newTag)
                    return prevState
                })

            }

        }
        setTagInput("")

    }

    
    return (
    <div>
        <Box sx={{display: "flex", mr: 2, pr: 2, flexDirection: "column"}}>
            <TextField 
            onChange={(e) => setTagInput(e.target.value)}
            onFocus={() => {setTagFieldFocused(true)}}
            value={tagInput}
            label="Search or create tags" 
            variant="standard" 
            sx={{ display: "flex", width: "100%"}}
            name="tags"
            autoComplete='off'
            />
            <div id="tagMatches" style={{display: "flex", flexDirection: "column"}}>
                {renderMatches(tagInput, tagsAlreadyInEntry)}
                <div style={{display: "flex", flexDirection: "row"}}>
                    {renderTags()}
                </div>
            </div>
        </Box>
    </div>) 

};
