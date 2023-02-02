import { SentimentSatisfiedSharp } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import {v4 as uuid} from "uuid"
import { entity, IState as Props } from "./App";
import { useAuth } from "../contexts/AuthContext"
import { writeBatch, collection, addDoc, setDoc, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { tag } from "./Tagbar"
import { db } from "../firebase"


interface IProps {
  entities: Props["entities"],
  setEntities: React.Dispatch<React.SetStateAction<Props["entities"]>>,
  tagListState: tag[],
  setTagListState: React.Dispatch<React.SetStateAction<tag[]>>
}

export const ImportButton: React.FC<IProps> = ({entities, setEntities, tagListState, setTagListState}) => {
    
    const {currentUser} = useAuth()
    const handleImport = async (event: any) => {

        console.log("Importing...")
        console.log(event.target.files[0])
        let tagList: tag[] = tagListState

        // maybe later I can check if the entities being added are identical (same content, same timestamp)
        // and I won't add these ones
            for (const file of event.target.files) {
              
                  const fileReader = new FileReader();
                  fileReader.readAsText(file, "UTF-8");
                  fileReader.onload = async e => {
                    let fileReaderString: string = fileReader.result as string;
                    let fileJSON = JSON.parse(fileReaderString)
                    console.log(fileJSON.content)
                    const randomId = uuid().slice(0,8)
                    let newTagArray: tag[] = []
                    for (const importTag of fileJSON.tags) {
                      // checks if importTag is in tagList
                      let tagMatch: tag | undefined = Object.values(tagList).find((k) => k.name == importTag)
                      if (tagMatch) {
                        newTagArray.push(tagMatch)
                      } else {
                        const randomTagId = uuid().slice(0,8)
                        let newTag: tag = {
                          name: importTag,
                          dateCreated: new Date(),
                          tagId: randomTagId
                        }
                        console.log("new tag is being added")
                        tagList.push(newTag)
                        newTagArray.push(newTag)
                      }
                    }
                    let newEntity: entity = {
                        id: randomId,
                        title: fileJSON.title ,
                        description: fileJSON.content,
                        private: false,
                        tags: newTagArray,
                        dateCreated: fileJSON.timeAdded,
                        dateModified: fileJSON.timeLastModified
                    }
                    
                    try {
                      if (currentUser){
                          let entitySubmit: entity = newEntity
                          // change this to batched (for some reason it didn't work last time tho)
                          console.log(entitySubmit, "this is entitySubmit")
                          await setDoc(doc(db, "users", currentUser.uid, "entities", randomId), entitySubmit)
                          console.log("this happens before commit")
                      }
                    } catch (e) {
                        console.error("Error adding document: ", e);
                    }
                    console.log(newEntity)
                    let currentEntities: entity[] = entities
                    currentEntities.unshift(newEntity)
                    setEntities(currentEntities)
                    console.log(entities.length)
    
                  }
            }

        // add all the tags into a taglist (this is also stored on firebase)
        if (currentUser) {
          const docRef = doc(db, "users", currentUser.uid)
          const docSnap = await getDoc(docRef)
          if (docSnap) {
            await setDoc(docRef, {
                tagList: tagList
            })
          }
          setTagListState(tagList)
      }
      }
    
    return <Button variant="contained" component="label" > Import <input type="file" hidden directory="" webkitdirectory="" onChange={handleImport}  /> </Button>
    
}

declare module 'react' {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      // extends React's HTMLAttributes
      directory?: string;
      webkitdirectory?:string;
    }
  }