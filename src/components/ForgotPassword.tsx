import React, { useState, useRef } from "react";
import {Card, TextField, CardContent, Typography, Button, Alert,  } from "@mui/material"
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
const ForgotPassword = () => {
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const emailRef = useRef<HTMLInputElement>(null)

    const { sendPasswordReset } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {

        e.preventDefault()
        
        if ( emailRef.current && emailRef.current.value ) {
                
            if (sendPasswordReset) {
                setLoading(true)
                sendPasswordReset(emailRef.current.value)
                .then(() => {
                    setError("")
                    setLoading(false)
                    setMessage("Check email for further instructions")
                    if ( emailRef.current && emailRef.current.value ) {
                        emailRef.current.value = ""
                    }
                })
                .catch((err) => {
                    setLoading(false)
                    switch (err.code){
                        case "auth/invalid-email":
                            setError("Invalid email")
                            break;
                        // case "auth/user-not-found":
                        //     setError("User not found")
                        //     break;
                        // case "auth/wrong-password":
                        //     setError("Incorrect password")
                        //     break;
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
                {message && <Alert severity='success'>{message}</Alert>}
                <h2>Reset password</h2>
                <TextField inputRef={emailRef} type="email" label="Email" variant="outlined" sx={{display: "flex", m: 2}} />

                <Button disabled={loading} variant="contained" onClick={handleSubmit}>Reset password</Button>
                <Typography sx={{mt: 2}}>
                    <Link to="/login">Login</Link> 
                </Typography>
            </CardContent>
        </Card>
        <div style={{marginTop: 2}}>
            Need an account? <Link to="/signup">Sign up here</Link> 
        </div>
        </div>
    )
}

export default ForgotPassword