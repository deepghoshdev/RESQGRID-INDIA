import {useState} from 'react'; import {getCurrentLocation} from '../utils/geoUtils.js';
<<<<<<< HEAD
export function useGeolocation(){const [location,setLocation]=useState(null);const [loading,setLoading]=useState(false);const [error,setError]=useState('');const detect=async()=>{setLoading(true);setError('');try{setLocation(await getCurrentLocation())}catch(e){setError('Location access was unavailable. Demo coordinates retained.')}finally{setLoading(false)}};return {location,loading,error,detect};}
=======
export function useGeolocation(){const [location,setLocation]=useState(null);const [loading,setLoading]=useState(false);const [error,setError]=useState('');const detect=async()=>{setLoading(true);setError('');try{setLocation(await getCurrentLocation())}catch(e){setError('Location access was unavailable. Demo coordinates retained.')}finally{setLoading(false)}};return {location,loading,error,detect};}
>>>>>>> origin/main
