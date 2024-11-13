import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedLayout = () => {
    const token = localStorage.getItem('token');

    const isAuthenticated = token && isTokenVaild(token);
    if (!isAuthenticated) {
        return <Navigate to='/auth' />;
    }
  return <Outlet />
};

function isTokenVaild(token) {
    try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = decoded.exp * 1000;
        return Date.now() < expirationTime;
    } catch (error) {
        return false;
    }
}

export default ProtectedLayout;