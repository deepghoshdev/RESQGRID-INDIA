import React from 'react';
import { AuthProvider } from '../context/AuthContext.jsx';
import { SocketProvider } from '../context/SocketContext.jsx';
export function Providers({children}){return <AuthProvider><SocketProvider>{children}</SocketProvider></AuthProvider>}
