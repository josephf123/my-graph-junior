
import { entry } from "./App"

import { IconButton } from "@mui/material"
import { LockOutlined, LockOpen, Delete, Edit } from "@mui/icons-material"
import { doc, deleteDoc, getDoc, setDoc } from "firebase/firestore"
import { db } from "../firebase"
import { useAuth } from "../contexts/AuthContext"
import { ModalDetails } from "./EntryModal"

interface IProps {
    entryInd: entry,
    entries: entry[],
    setEntries: React.Dispatch<React.SetStateAction<entry[]>>,
    setIsHovering: React.Dispatch<React.SetStateAction<boolean>>,
    setModalDetails:React.Dispatch<React.SetStateAction<ModalDetails>>
}

const HoverIconBar: React.FC<IProps> = ({entryInd, entries, setEntries, setIsHovering, setModalDetails}) => {

    const {currentUser} = useAuth()

    const handleDelete = async (event : React.MouseEvent<HTMLButtonElement, MouseEvent>, entryInd: entry) => {


        setIsHovering(false)
        // First clear from the entries database in order to quickly update the DOM
        // and then delete it from firestore (saves 200ms lag). This may cause a problem since
        // there aren't checks before we change entries.
        setEntries(entries.filter((el) => el.entryId !== entryInd.entryId))
    
        if (currentUser) {
            const docRef = doc(db, "users", currentUser.uid, "entries", entryInd.entryId)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                await deleteDoc(docRef);
            } else {
                console.log("No such document!");
                alert("woah slow down there bud, thats not a valid entry")
            }

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
        if (currentUser) {
            const docRef = doc(db, "users", currentUser.uid, "entries", entryInd.entryId)        
            await setDoc(docRef, {private: !entryInd.private}, {merge : true})
            console.log(new Date().getMilliseconds())
        }

    }
    const handleEdit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, entryInd: entry) => {
        setIsHovering(false)
        const modalDetails = {
            open: true,
            entry: entryInd
        }
        setModalDetails(modalDetails)
        console.log("does this work????")

    }
    return (
        <>
            <IconButton onClick={(e) => {e.stopPropagation(); handleEdit(e, entryInd)}}>
                <Edit />
            </IconButton>

            <IconButton onClick={(e) => {e.stopPropagation(); handleChangePrivacy(e, entryInd)}}>
                { entryInd.private
                ?
                <LockOutlined />
                : 
                <LockOpen />
            }
            </IconButton>
            <IconButton onClick={(e) => {e.stopPropagation(); handleDelete(e, entryInd)}}>
                <Delete />
            </IconButton>
        </>
    )
}

export default HoverIconBar