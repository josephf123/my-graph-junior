import React, { useContext, useState, useEffect } from "react"

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, UserCredential, signOut, sendPasswordResetEmail, updateEmail, User, updatePassword } from "firebase/auth"

import { User as FirebaseUser } from "firebase/auth";

interface IAuthContext {
    currentUser: FirebaseUser | null,
    signup: (email: string, password: string) => Promise<UserCredential>,
    login: (email: string, password: string) => Promise<UserCredential>,
    signout: () => Promise<void>,
    sendPasswordReset: (email: string) => Promise<void>,
    emailUpdate: (email: string) => Promise<void>,
    passwordUpdate: (password: string) => Promise<void>
}

const AuthContext = React.createContext<IAuthContext>({} as IAuthContext)

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider: React.FC = ( {children}) => {
    const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null)
    
    const [loading, setLoading] = useState(true)

    const auth = getAuth();
    const signup = (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const login = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const signout = () => {
        return signOut(auth)
    }

    const sendPasswordReset = (email: string) => {
        return sendPasswordResetEmail(auth, email)
    }

    const emailUpdate = (email: string) => {
        return updateEmail(auth.currentUser as User, email)
    }

    const passwordUpdate = (password: string) => {
        return updatePassword(auth.currentUser as User, password)
    }
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
            setLoading(false)
        })
        return unsubscribe
    }, [])

    const value: IAuthContext = {
        currentUser,
        signup,
        login,
        signout,
        sendPasswordReset,
        emailUpdate,
        passwordUpdate
    }
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}