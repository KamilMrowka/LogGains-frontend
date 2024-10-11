// import React, {useRef, useState} from 'react';
// import axios from 'axios';
// import {useNavigate} from "react-router-dom";
import LoginForm from "../components/LoginForm.tsx";
import {useState} from "react";
import RegisteringForm from "../components/RegisteringForm.tsx";
import SiteInfo from "../components/SiteInfo.tsx";

export default function LoginPage() {
    const [whichForm, setWhichForm]  = useState("logging");
    return (
        <div className={"main-container login-page-main main-container-centered d-flex flex-column justify-content-evenly mt-5 mt-md-0 flex-md-row"}>
            <div className="even-bottom d-flex flex-column justify-content-evenly flex-md-row">
                <div className={"welcome-text"}>    
                    <img className={"main-logo"} alt="LOGgains" src="src\assets\LOG.png"></img>
                    <div className="d-none d-md-block">
                        <SiteInfo></SiteInfo>
                    </div>
                </div>
                <div className="credentials-form my-5 my-md-0">
                    {whichForm === "logging" ?
                        <LoginForm setForm={setWhichForm}></LoginForm> :
                        <RegisteringForm setForm={setWhichForm}></RegisteringForm>
                    }
                </div>
                <div className="d-md-none">
                    <SiteInfo></SiteInfo>
                </div>
            </div>
        </div>
    );
}
