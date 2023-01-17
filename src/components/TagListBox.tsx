import "../firebase"
import React, {useState, useEffect} from 'react';
import './componentsCSS/App.css';
import { collection, addDoc, getDoc, orderBy, query, doc } from 'firebase/firestore';
import { firebaseApp, db } from "../firebase"
import { useAuth } from '../contexts/AuthContext';

import { tag } from "./Tagbar";
import "./componentsCSS/tagListBox.css"
import { Box, Card } from "@mui/material";
import { TagButton } from "./TagButton";

interface Props {
    tagListState: tag[],
    setTagListState: React.Dispatch<React.SetStateAction<tag[]>>
}



export const TagListBox: React.FC<Props> = ({tagListState, setTagListState}) => {

    return (
        <div className="tagListBoxOuter">
        <Card style={{display: "block"}} sx={{m:3, p:2}}>Tags!</Card>
            <Card className="tagListBoxInner">
            {
                tagListState.map((indTag: tag, idx) => {
                    return <TagButton key={indTag.name} indTag={indTag} idx={idx}/>                    
                })
            }
            </Card>
        </div>
    )
}


