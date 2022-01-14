import React from "react"
import  { Switch, FormControlLabel, Box, AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

// import {IState as Props} from "../App"

interface IProps {
    privateMode: boolean
    setPrivateMode: React.Dispatch<React.SetStateAction<boolean>>
}

const PrivateButton: React.FC<IProps> = ({privateMode, setPrivateMode}) => {
    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setPrivateMode(e.target.checked)
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" >
                <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{flexGrow: 1,align: "center", left: "4%", position: "relative"}}>
                    My Graph Junior
                </Typography>
                <div>
                    <FormControlLabel control={<Switch
                    onChange={ handleChange }
                    checked={privateMode}
                    color="default"
                    />} label="Private mode" />
                </div>
                {/* <Button color="inherit">Login</Button> */}
                </Toolbar>
            </AppBar>
        </Box>
        
    )
}

export default PrivateButton