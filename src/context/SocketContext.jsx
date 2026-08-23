import React,{createContext,useContext,useEffect,useState} from 'react';
const Ctx=createContext(null);
export function SocketProvider({children}){const [live,setLive]=useState(true); const [lastPing,setLastPing]=useState(Date.now()); useEffect(()=>{const id=setInterval(()=>setLastPing(Date.now()),4000);return()=>clearInterval(id)},[]);return <Ctx.Provider value={{live,lastPing}}>{children}</Ctx.Provider>}
export const useSocket=()=>useContext(Ctx);
