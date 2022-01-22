import React, {useEffect, useRef, useState} from 'react';

import {Card, CardContent, Typography, TextField, Button, Alert } from "@mui/material"

import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';



const Login: React.FC = () => {
    
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    
    const navigate = useNavigate()
   
    const { login } = useAuth()
    

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {

        e.preventDefault()
        
        if ( emailRef.current && passwordRef.current 
            && emailRef.current.value && passwordRef.current.value) {
                
            if (login) {
                setLoading(true)
                login(emailRef.current.value, passwordRef.current.value)
                .then(() => {
                    setError("")
                    setLoading(false)
                    navigate("/")
                })
                .catch((err) => {
                    setLoading(false)
                    switch (err.code){
                        case "auth/invalid-email":
                            setError("Invalid email")
                            break;
                        case "auth/user-not-found":
                            setError("User not found")
                            break;
                        case "auth/wrong-password":
                            setError("Incorrect password")
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
        <div style={{display: "flex", justifyContent: "center", alignItems: "center",minHeight: "100vh", flexDirection: "column"}}>
            <Card sx={{m: 3, width: 500, height: "auto"}}>
                <CardContent>
                    {error && <Alert severity='error'>{error}</Alert>}
                    <h2>Login</h2>
                    <TextField inputRef={emailRef} type="email" label="Email" variant="outlined" sx={{display: "flex", m: 2}} />
                    <TextField inputRef={passwordRef} type="password" label="Password" variant="outlined" sx={{display: "flex", m: 2}}/>

                    <Button disabled={loading} variant="contained" onClick={handleSubmit}>Login</Button>
                    <Typography sx={{mt: 2}}>
                        <Link to="/forgot-password">Forgot password?</Link> 
                    </Typography>
                </CardContent>
            </Card>
            <div style={{marginTop: 2}}>
                Need an account? <Link to="/signup">Sign up here</Link> 
            </div>
        </div>

    )
}
export default Login