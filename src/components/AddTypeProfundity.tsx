import { Box, TextField, Typography } from '@mui/material'
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

export const AddTypeProfundity = ({entityDataType, setEntityDataType, handleChange, input, setInput}: Props) => {
  return (
    <>
      <Box sx={{display:"flex", flexDirection: "row", float: "right",
         justifyContent: "space-between", width: {xs: "300px", sm: "350px", md: "500px"}}}>
            <Box sx={{display: "flex"}}>
            </Box>
            <ChangeDataTypeEntries entityDataType={entityDataType} setEntityDataType={setEntityDataType}/>
        </Box>
            <Box sx={{display: "flex", mr: 2, pr: 2}}>
                <TextField 
                onChange={handleChange}
                value={input.description}
                label="Profundity" 
                variant="standard" 
                rows={5}
                sx={{ display: "flex", width: "100%", mb: 3}}
                multiline
                name="description"
                />
            </Box>
            <Box>
              <Typography>Possible source bar</Typography>
            </Box>
    </>
  )
}