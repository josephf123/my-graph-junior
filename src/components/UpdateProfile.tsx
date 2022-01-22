import React, {useEffect, useRef, useState} from 'react';

import {Card, CardContent, Typography, TextField, Button, Alert, Modal, Box } from "@mui/material"

import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const UpdateProfile = () => {

    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const passwordConfirmRef = useRef<HTMLInputElement>(null)

   
    const { currentUser, emailUpdate, passwordUpdate } = useAuth()
    
    const navigate = useNavigate()

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)

    const modalStyle = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        // border: '2px solid #000',
        // boxShadow: 24,
        p: 4,
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        console.log("nope")
        let promiseArr: Promise<void>[] = []
        
        if ( emailRef.current && emailRef.current.value) {
            if (emailRef.current.value != currentUser!.email) {
                setLoading(true)
                promiseArr.push(emailUpdate(emailRef.current.value))
            }
        }


        // if ( passwordRef.current && passwordRef.current.value
        //     && passwordConfirmRef.current && passwordConfirmRef.current.value) {
        //         if (passwordRef.current.value != passwordConfirmRef.current.value) {
        //             return setError("passwords do not match")
        //         }
        //         setLoading(true)
        //         promiseArr.push(passwordUpdate(passwordRef.current.value))

        // }

        Promise.all(promiseArr).then(() => {
            setError("")
            navigate("/")
        }).catch((err) => {
            switch (err.code) {
                case "auth/weak-password":
                    return setError("Password is too weak, must be at least 6 characters")
                case "auth/invalid-email":
                    return setError("Invalid email")
                case "auth/requires-recent-login":
                    return setError("Must have logged in recently to update profile")
                default:
                    return setError(err.code)
                
            }
        }).finally(() => {
            setLoading(false)
        })
        
        
    }

    return (
        <div style={{display: "flex", justifyContent: "center", alignItems: "center" ,minHeight: "100vh"}}>
            <Card sx={{m: 3, width: 500, height: "auto"}}>
                <CardContent sx={{flexDirection: "column"}}>
                    {error && <Alert severity='error'>{error}</Alert>}
                    <h2>Update profile</h2>
                    <TextField inputRef={emailRef} type="email" label="Email" variant="outlined" sx={{display: "flex", m: 2}} defaultValue={currentUser ? currentUser.email : ""}/>
                    <Button disabled={loading} variant="contained" onClick={handleSubmit}>Update email</Button>
                    <Typography sx={{mt: 2}}>
                        <Link to="/">Cancel</Link> 
                    </Typography>
                </CardContent>
            </Card>
            
        </div>

    )
}

export default UpdateProfile