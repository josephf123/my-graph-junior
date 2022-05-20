import "../firebase"
import React, {useState, useEffect} from 'react';
import './componentsCSS/App.css';
import { collection, addDoc, getDoc, orderBy, query, doc } from 'firebase/firestore';
import { firebaseApp, db } from "../firebase"
import { useAuth } from '../contexts/AuthContext';

import { tag } from "./Tagbar";
import "./componentsCSS/tagListBox.css"
import { Box, Card } from "@mui/material";

interface Props {
    tagListState: tag[],
    setTagListState: React.Dispatch<React.SetStateAction<tag[]>>
}

let colourPalette = ["#f94144","#f3722c","#f8961e","#f9844a","#f9c74f","#90be6d","#43aa8b","#4d908e","#577590","#277da1"]


export const TagListBox: React.FC<Props> = ({tagListState, setTagListState}) => {

    return (
        <div className="tagListBoxOuter">
        <Card style={{display: "block"}} sx={{m:3, p:2}}>Tags!</Card>
            <Card className="tagListBoxInner">
            {
                tagListState.map((indTag: tag, idx) => {
                    return <div key={indTag.name} style={{backgroundColor: colourPalette[idx % 10]}} className="individualTags">{indTag.name}</div>
                    
                })
            }
            </Card>
        </div>
    )
}


