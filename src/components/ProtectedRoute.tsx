import React, {ReactElement} from 'react';
import { Navigate, Route, RouteProps } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';



const ProtectedRoute = ({children}: {children: JSX.Element})  => {

    const { currentUser } = useAuth()
    return currentUser ? children : <Navigate to="/login" />

}
export default ProtectedRoute