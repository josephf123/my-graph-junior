import React from "react"
import {IState as Props} from "../App"
import {Box, Card, CardActions, CardContent, Button, Typography, TextField, Switch, FormControlLabel} from '@mui/material'
import "./componentsCSS/AddEntries.css"
interface IProps {
    entries: Props["entries"],
    setEntries: React.Dispatch<React.SetStateAction<Props["entries"]>>
}


const AddEntries: React.FC<IProps> = ({entries, setEntries}) => {
    
    const [input, setInput] = React.useState({
        title: "",
        description: "",
        private: false
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {checked, name, value, type} = e.target
        // Allows for checkbox to be updated
        const assigningVal = type === "checkbox" ? checked : value
        setInput({
            ...input,
            [name]: assigningVal
        })
    }

    const handleClick = () => {
        // Add input field as most recent entry
        setEntries([
            ...entries,
            {
                title: input.title,
                description: input.description,
                private: input.private
            }
            
        ])
        // Resets input after entry has been added
        setInput({
            title: "",
            description: "",
            // this means if someone presses the button, it will stay on until turned off
            private: input.private
        })
    }


    return (
        <Card sx={{display: "block", m: 3, width: 500}}>
            <CardContent className="inputHolder">
                <Box className="entryInput">
                    <TextField 
                    onChange={handleChange}
                    value={input.title}
                    label="Title" variant="standard"
                    sx={{m: 3, mb:0}}
                    name="title"
                    />
                </Box>
                <Box className="entryInput">
                    <TextField 
                    onChange={handleChange}
                    value={input.description}
                    label="Description" 
                    variant="standard" 
                    sx={{m: 3, mb: 0}}
                    name="description"
                    />
                </Box>
                <FormControlLabel control={<Switch
                onChange={ handleChange }
                checked={input.private}
                name="private"
                sx={{margin: "auto"}}
                />} label="Private mode" />
                <Button variant="contained" onClick={ handleClick }>Contained</Button>
            </CardContent>
        </Card>
    )
}

export default AddEntries