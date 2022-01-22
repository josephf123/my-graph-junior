import React, {useEffect, useRef, useState} from 'react';

import {Card, CardContent, Typography, TextField, Button, Alert } from "@mui/material"

import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {

    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const passwordConfirmRef = useRef<HTMLInputElement>(null)

   
    const { signup } = useAuth()
    
    const navigate = useNavigate()

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {


        e.preventDefault()
        
        if ( emailRef.current && passwordRef.current 
            && emailRef.current.value && passwordRef.current.value
            && passwordConfirmRef.current && passwordConfirmRef.current.value) {
                
                if (passwordRef.current.value != passwordConfirmRef.current.value) {
                    return setError("passwords do not match")
                }
            if (signup) {
                setLoading(true)
                signup(emailRef.current.value, passwordRef.current.value)
                .then(() => {
                    setError("")
                    setLoading(false)
                    navigate("/")

                })
                .catch((err) => {
                    setLoading(false)
                    switch (err.code){
                        case "auth/weak-password":
                            setError("Password is too weak, must be at least 6 characters")
                            break;
                        case "auth/invalid-email":
                            setError("Invalid email")
                            break;
                        case "auth/email-already-in-use":
                            setError("This email is already in use")
                            break;
                        default:
                            setError(err.code)

                    return;
                    }
                })

            }

        }
    }

    return (
        <div style={{display: "flex", justifyContent: "center", alignItems: "center",minHeight: "100vh"}}>
            <Card sx={{m: 3, width: 500, height: "auto"}}>
                <CardContent>
                    {error && <Alert severity='error'>{error}</Alert>}
                    <h2>Sign up</h2>
                    <TextField inputRef={emailRef} type="email" label="Email" variant="outlined" sx={{display: "flex", m: 2}} />
                    <TextField inputRef={passwordRef} type="password" label="Password" variant="outlined" sx={{display: "flex", m: 2}}/>
                    <TextField inputRef={passwordConfirmRef} type="password" label="Confirm password" variant="outlined" sx={{display: "flex", m: 2}}/>

                    <Button disabled={loading} variant="contained" onClick={handleSubmit}>Sign up</Button>
                    <Typography sx={{mt: 2}}>
                        Already have an account? <Link to="/signup">Log in here</Link> 
                    </Typography>
                </CardContent>
            </Card>
        </div>

    )
}

export default Signup