import { Button } from "@mui/material";
import React from "react";
import {v4 as uuid} from "uuid"

export const ImportButton = () => {
    
    const handleImport = (event: any) => {

        console.log("Importing...")
        console.log(event.target.files[0])
        // console.log(fileReader.result)
        for (const file of event.target.files) {
            const fileReader = new FileReader();
            fileReader.readAsText(file, "UTF-8");
            fileReader.onload = e => {
                let fileReaderString: string = fileReader.result as string;
                let fileJSON = JSON.parse(fileReaderString)
                console.log(fileJSON.content)
                const randomId = uuid().slice(0,8)
                // let newDataStruct: entity = {
                //     id: randomId,
                //     title: fileJSON.title ,
                //     description: fileJSON.content,
                //     private: false,
                //     tags: fileJSON.tags,
                //     dateCreated: fileJSON.timeAdded,
                //     dateModified: fileJSON.timeLastModified
                // }



            }
            


            // console.log(file);
        }
        // fileReader.onload = e => {
        //     console.log("e.target.result", event.target.result);
        //     let fileReaderString: string = fileReader.result as string;
        //     console.log(fileReader.result)
        //     let fileJSON = JSON.parse(fileReaderString)
        //     console.log(fileJSON.content)



        // };
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