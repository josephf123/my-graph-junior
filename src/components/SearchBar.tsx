import { Input, TextField } from "@mui/material"
import React from "react"

interface Props {
    searchQuery: string,
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>
}

export const SearchBar: React.FC<Props> = ({searchQuery, setSearchQuery}) => {

    return (
        <div style={{margin: "15px", display: "flex"}} >
            <TextField label="Search" variant="outlined" 
            onChange={(e) => {setSearchQuery(e.target.value)}} 
            value={searchQuery}
            autoComplete="off"
            />
        </div>
    )
}