import { Box, makeStyles, TextField } from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'
import { EntityData, inputInterface } from './AddEntities'
import { ChangeDataTypeEntries } from './ChangeDataTypeEntries'

type Props = {
  entityDataType: EntityData,
  setEntityDataType: React.Dispatch<React.SetStateAction<EntityData>>,
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  input: inputInterface,
  setInput: Dispatch<SetStateAction<inputInterface>>,
}


export const AddTypeJournal = ({entityDataType, setEntityDataType, handleChange, input, setInput}: Props) => {
  // document.getElementsByClassName("entityHolder")[0].classList.add("")
  // const {width, height} = useWindowDimensions()

  return (
    <>
       <Box sx={{display:"flex", flexDirection: "row", float: "right",
        justifyContent: "space-between", width: {xs: "300px", sm: "500px", md: "800px"}}}>
          <Box sx={{display: "flex"}}>
              <TextField 
              onChange={handleChange}
              value={input.title}
              label="Title" variant="standard"
              sx={{mr: "auto", mb: 1}}
              name="title"
              />
          </Box>
          <ChangeDataTypeEntries entityDataType={entityDataType} setEntityDataType={setEntityDataType}/>
        </Box>
          <Box sx={{display: "flex", mr: 2, pr: 2}}>
              <TextField 
              onChange={handleChange}
              value={input.description}
              label="Journal Entry" 
              variant="standard" 
              rows={8}
              sx={{ display: "flex", width: "100%", mb: 3}}
              multiline

              name="description"
              
              />
          </Box>
    </>
  )
}