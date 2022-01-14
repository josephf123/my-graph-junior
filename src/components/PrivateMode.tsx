import React from "react"
import  { Switch, FormControlLabel } from '@mui/material';

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
        <div>
            <FormControlLabel control={<Switch
            onChange={ handleChange }
            checked={privateMode}
            />} label="Private mode" />
        </div>
    )
}

export default PrivateButton