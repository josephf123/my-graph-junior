
import { entry } from "./App"

import { IconButton } from "@mui/material"
import { LockOutlined, LockOpen, Delete } from "@mui/icons-material"

import { doc, deleteDoc, getDoc, setDoc } from "firebase/firestore"
import { db } from "../firebase"

interface IProps {
    entryInd: entry,
    entries: entry[],
    setEntries: React.Dispatch<React.SetStateAction<entry[]>>,
    setIsHovering: React.Dispatch<React.SetStateAction<boolean>>
}

const HoverIconBar: React.FC<IProps> = ({entryInd, entries, setEntries, setIsHovering}) => {
    const handleDelete = async (event : React.MouseEvent<HTMLButtonElement, MouseEvent>, entryInd: entry) => {


        setIsHovering(false)
        // First clear from the entries database in order to quickly update the DOM
        // and then delete it from firestore (saves 200ms lag). This may cause a problem since
        // there aren't checks before we change entries.
        setEntries(entries.filter((el) => el.entryId !== entryInd.entryId))
    
    
    
        const docRef = doc(db, "entries", entryInd.entryId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            await deleteDoc(docRef);
        } else {
            console.log("No such document!");
            alert("woah slow down there bud, thats not a valid entry")
        }
    
    }
    const handleChangePrivacy = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, entryInd: entry) => {

        setIsHovering(false)
        console.log(new Date().getMilliseconds())
        setEntries( prevState => {
            const idx = prevState.findIndex((e) => e.entryId == entryInd.entryId)
            prevState[idx].private = !entryInd.private
            return prevState
        })
        console.log(new Date().getMilliseconds())

        const docRef = doc(db, "entries", entryInd.entryId)        
        await setDoc(docRef, {private: !entryInd.private}, {merge : true})
        console.log(new Date().getMilliseconds())

    }

    return (
        <>
            <IconButton onClick={(e) => handleChangePrivacy(e, entryInd)}>
                { entryInd.private
                ?
                <LockOutlined />
                : 
                <LockOpen />
            }
            </IconButton>
            <IconButton onClick={(e) => handleDelete(e, entryInd)}>
                <Delete />
            </IconButton>
        </>
    )
}

export default HoverIconBar