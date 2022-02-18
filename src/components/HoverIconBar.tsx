
import { entity, entry } from "./App"

import { IconButton } from "@mui/material"
import { LockOutlined, LockOpen, Delete, Edit } from "@mui/icons-material"
import { doc, deleteDoc, getDoc, setDoc } from "firebase/firestore"
import { db } from "../firebase"
import { useAuth } from "../contexts/AuthContext"
import { ModalDetails } from "./EntityModal"

interface IProps {
    entityInd: entity,
    entities: entity[],
    setEntities: React.Dispatch<React.SetStateAction<entity[]>>,
    setIsHovering: React.Dispatch<React.SetStateAction<boolean>>,
    setModalDetails:React.Dispatch<React.SetStateAction<ModalDetails>>
}

const HoverIconBar: React.FC<IProps> = ({entityInd, entities, setEntities, setIsHovering, setModalDetails}) => {

    const {currentUser} = useAuth()

    const handleDelete = async (event : React.MouseEvent<HTMLButtonElement, MouseEvent>, entityInd: entity) => {


        // First clear from the entries database in order to quickly update the DOM
        // and then delete it from firestore (saves 200ms lag). This may cause a problem since
        // there aren't checks before we change entries. This is called optimistic rendering.
        // $%^
        setEntities(prevState => 
            prevState.filter((el) => el.id !== entityInd.id)
        )
        setIsHovering(true)

        if (currentUser) {
            const docRef = doc(db, "users", currentUser.uid, "entities", entityInd.id)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                await deleteDoc(docRef);
            } else {
                console.log("No such document!");
            }
            
        }
        
    
    
    }
    const handleChangePrivacy = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, entityInd: entity) => {
        // $%^
        setIsHovering(false)
        console.log(new Date().getMilliseconds())
        setEntities( prevState => {
            const idx = prevState.findIndex((e) => e.id == entityInd.id)
            prevState[idx].private = !entityInd.private
            return prevState
        })
        console.log(new Date().getMilliseconds())
        if (currentUser) {
            const docRef = doc(db, "users", currentUser.uid, "entities", entityInd.id)        
            await setDoc(docRef, {private: !entityInd.private}, {merge : true})
            console.log(new Date().getMilliseconds())
        }

    }
    const handleEdit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, entityInd: entity) => {
        setIsHovering(false)
        const modalDetails = {
            open: true,
            entity: entityInd
        }
        setModalDetails(modalDetails)
        console.log("does this work????")

    }
    return (
        <>
            <IconButton onClick={(e) => {e.stopPropagation(); handleEdit(e, entityInd)}}>
                <Edit />
            </IconButton>

            <IconButton onClick={(e) => {e.stopPropagation(); handleChangePrivacy(e, entityInd)}}>
                { entityInd.private
                ?
                <LockOutlined />
                : 
                <LockOpen />
            }
            </IconButton>
            <IconButton onClick={(e) => {e.stopPropagation(); handleDelete(e, entityInd)}}>
                <Delete />
            </IconButton>
        </>
    )
}

export default HoverIconBar