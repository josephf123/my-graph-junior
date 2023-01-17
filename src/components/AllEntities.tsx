import React, {useState} from "react"
import {IState as Props, entity, source} from "./App"
import {Box, Card, CardActions, CardContent, Button, Typography, IconButton} from '@mui/material'

import { Delete, DocumentScanner, LockOpen, LockOutlined } from '@mui/icons-material';

import HoverIconBar from "./HoverIconBar";

import { db } from "../firebase"
import { doc, collection, addDoc, getDocs, deleteDoc, query, where, getDoc } from 'firebase/firestore';

import {v4 as uuid} from "uuid"
import { ModalDetails } from "./EntityModal";

import { debounce } from 'lodash';
import { tag } from "./Tagbar";
import Masonry from 'react-masonry-css'
import "./componentsCSS/AllEntities.css"
import { TagButton } from "./TagButton";

interface IProps {
    entities: entity[],
    setEntities: React.Dispatch<React.SetStateAction<entity[]>>,
    privateMode: boolean,
    modalDetails: ModalDetails
    setModalDetails: React.Dispatch<React.SetStateAction<ModalDetails>>,
    searchQuery: string
}

const breakpointColumnsObj = {
    default: 4,
    1300: 3,
    1000: 2,
    850: 1
};

const filterEntities = (prefilteredEntities: entity[], query: string) => {
    if (query === "") {
        return prefilteredEntities
    } else {
        // Fn to check if the key of entity is "tags"
        const isTagArr = (tbd: any): tbd is tag[] => {
            if (Array.isArray(tbd)) {

                if (tbd.length != 0) {
                    console.log(tbd)
                    return (tbd as tag[])[0]?.tagId !== undefined
                }
                return true
            }
            return false
        }
        
        // This will go through every value inside entity (from key value pair) and see if it contains
        // the query, if so it will include it
        return prefilteredEntities.filter((entity) => {
            // if (entity.type === "journal") {
            //     let shouldIncludeJournal = false
            //     if (entity.source) {
            //         shouldIncludeJournal = entity.source.some((source: source) => {
            //             source.name.toLowerCase().includes(query.toLowerCase())
            //         })
            //     }
            //     if (shouldIncludeJournal) {
            //         return true
            //     }
            // } 
            return Object.keys(entity).some((k) => {
                let shouldInclude = false
                if (typeof entity[k] === "string") {
                    shouldInclude = entity[k].toLowerCase().includes(query.toLowerCase())
                }
                if (isTagArr(entity[k])) {
                    shouldInclude = shouldInclude || entity[k].some((tag: tag) => {
                        return tag.name.toLowerCase().includes(query.toLowerCase())
                    })
                }
                return shouldInclude
            })
        })
    }
}

const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {width,height};
}
export function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  
    React.useEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    return windowDimensions;
}

const displayEntity = (
    entity: entity, 
    filteredEntities: entity[], 
    setEntities: React.Dispatch<React.SetStateAction<entity[]>>,
    isHovering: boolean,
    setIsHovering: React.Dispatch<React.SetStateAction<boolean>>,
    setModalDetails: React.Dispatch<React.SetStateAction<ModalDetails>>) => {
    // if (entity.type === "entry") {
        return (
            <CardContent sx={{display: "block", maxHeight: {xs: "100px", sm: "200px"}}}>
                <Typography style={{fontWeight: "600",  textAlign: "left"}} color="text.primary" component="div" gutterBottom>
                {entity.title.length > 25 ? entity.title.slice(0,25) : entity.title}
                </Typography>
                {
                    entity.description !== ""
                    ? 
                    <Typography color="text.secondary" sx={{whiteSpace: "pre-line", wordBreak: "break-word",  textAlign: "left"}}>
                        {entity.description.length > 50 ? entity.description.slice(0,50) : entity.description}
                    </Typography>
                    :
                    <div style={{height: "24px"}}></div>
                }

                <div style={{height: 28}}>
                    { isHovering
                    ? <HoverIconBar entityInd={entity} entities={filteredEntities} setEntities={setEntities} setIsHovering={setIsHovering} setModalDetails={setModalDetails}/>
                    : <></>
                    }
                </div>
            
            </CardContent>
        )
    // } else if (entity.type === "journal") {
    //     return (
    //         <CardContent sx={{display: "block", maxHeight: {xs: "200px", sm: "300px"}}}>
    //             <Typography style={{fontWeight: "600", textAlign: "left"}} component="div" gutterBottom>
    //             {entity.title.length > 25 ? entity.title.slice(0,25) : entity.title}
    //             </Typography>
    //             {
    //                 entity.description !== ""
    //                 ? 
    //                 <Typography color="text.secondary" sx={{whiteSpace: "pre-line", wordBreak: "break-word", textAlign: "left"}}>
    //                     {entity.description.length > 100 ? entity.description.slice(0,100) : entity.description}
    //                 </Typography>
    //                 :
    //                 <div style={{height: "24px"}}></div>
    //             }

    //             <div style={{height: 28}}>
    //                 { isHovering
    //                 ? <HoverIconBar entityInd={entity} entities={filteredEntities} setEntities={setEntities} setIsHovering={setIsHovering} setModalDetails={setModalDetails}/>
    //                 : <></>
    //                 }
    //             </div>
    //         </CardContent>
    //     )
    // } else if (entity.type === "profundity") {
    //     return (
    //     <CardContent sx={{display: "block"}}>

    //         <Typography sx={{whiteSpace: "pre-line", wordBreak: "break-word", textAlign: "left", fontWeight: 500}}>
    //             {entity.description.length > 100 ? entity.description.slice(0,100) : entity.description}
    //         </Typography>
    //         <div style={{height: "24px"}}></div>

    //         <div style={{height: 28}}>
    //             { isHovering
    //             ? <HoverIconBar entityInd={entity} entities={filteredEntities} setEntities={setEntities} setIsHovering={setIsHovering} setModalDetails={setModalDetails}/>
    //             : <></>
    //             }
    //         </div>
    //     </CardContent>
    //     )
    // } else {
    //     return <></>
    // }
}

const AllEntities: React.FC<IProps> = ({entities, setEntities, privateMode, modalDetails, setModalDetails, searchQuery}) => {
    console.log("this should run again")

    const privacyFilter = (filteredEntities: entity[]) => filteredEntities.filter((entity) => {
        if (!entity.private || privateMode) {
            return entity
        }
    })

    const renderEntities = (filteredEntities: entity[]) => filteredEntities.map((entity) => {
        const AllThings = () => {
            const [isHovering, setIsHovering] = useState(false);
            return (
                <div style={{display: "block", position: "relative", width: "100%"}}>
                    <Card 
                    key={entity.id}
                    sx={{ m: 3, cursor: "pointer", display: "block", boxShadow: 1}} 
                    onMouseOver={debounce(() => setIsHovering(true), 1)} 
                    onMouseOut={debounce(() => setIsHovering(false), 1)} 
                    onClick={() => {
                        setIsHovering(false)
                        const modalDetails = {
                            open: true,
                            entity: entity
                        }
                        setModalDetails(modalDetails)
                    }}>
                        { displayEntity(entity, filteredEntities, setEntities, isHovering, setIsHovering, setModalDetails ) }
                    
                    
                    {
                        entity.tags.length != 0 &&
                        <div className="tagHolderEntity">
                            {
                                entity.tags.map((tag, idx) => {
                                    return (
                                        <TagButton indTag={tag} idx={idx} />
                                    )
                                })
                            }
                        </div>
                    }
                    
                    
                    </Card>
                </div>
            )
            

            // return (
            //     <>
            //     { !entity.private || privateMode
            //     ?
            //         <div style={{display: "block", position: "relative", width: "100%"}}>
            //             <Card 
            //             key={entity.id}
            //             sx={{ m: 3, cursor: "pointer", display: "block"}} 
            //             onMouseOver={debounce(() => setIsHovering(true), 1)} 
            //             onMouseOut={debounce(() => setIsHovering(false), 1)} 
            //             onClick={() => {
            //                 setIsHovering(false)
            //                 const modalDetails = {
            //                     open: true,
            //                     entity: entity
            //                 }
            //                 setModalDetails(modalDetails)
            //             }}>
            //                 { displayEntity(entity, filteredEntities, setEntities, isHovering, setIsHovering, setModalDetails ) }
            //             </Card>
            //         </div>
            //     : <></>
            //     }
            //     </>
            //     )
        }

        return (
            < AllThings key={uuid()} />
        )

    })
    return (
        <div style={{display: "flex", justifyContent: "center", position: "relative"}}>
            <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            id="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
            >
                {renderEntities(privacyFilter(filterEntities(entities, searchQuery)))}
            </Masonry>
        </div>
    )

}

export default AllEntities