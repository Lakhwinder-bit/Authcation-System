import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import RegestionPage from '../pages/regester';
import OtpVerify from '../pages/VerifyOtpPage';
import Dashboard from '../pages/dashboard';

export default function AppRoutes(){
    return(
        <>
          
    <Routes>
        <Route path ="/logIn" element={<RegestionPage/>}/>
        <Route path ="/" element={<Dashboard/>}/>
        <Route path ="/OtpVerify" element={<OtpVerify/>}/>
       
    </Routes>
   
    </>
  
)}

//  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');