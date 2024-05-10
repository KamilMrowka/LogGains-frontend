import React, {ChangeEvent, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
interface loginRequest {
    username: string,
    password: string,
}

interface Props {
    setForm: React.Dispatch<React.SetStateAction<string>>;
}

export default function LoginForm ({ setForm }: Props) {
    const passwordRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [usernameWarning, setUsernameWarning] = useState("");
    const [passwordWarning, setPasswordWarning] = useState("");
    const usernameNotRegisteredMessage = "Username not registered";
    const wrongPasswordMessage = "Password Incorrect";

    const handleClick = () => {
        setPasswordVisible(!passwordVisible);
    }

    const handlePasswordAndUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        const id = event.target.id;
        if (id === "username" && usernameWarning != "") {
            setUsernameWarning("");
        } else if (id === "password" && passwordWarning != "") {
            setPasswordWarning("");
        }
    };

    const clearWarningsSetWarning = (warningName: string, warningMessage: string) => {
        if (warningName === "password") {
            setPasswordWarning(warningMessage);
            setUsernameWarning("");
        } else {
            setUsernameWarning(warningMessage);
            setPasswordWarning("");
        }
    }
    const navigate = useNavigate();

    const handleSignInButton = () => {
        setForm("register");
    }

    const formLoginRequest = () => {
        if (usernameRef.current != null && passwordRef.current != null) {
            const loginRequest: loginRequest = {
                username: usernameRef.current.value,
                password: passwordRef.current.value,
            };
            return loginRequest;
        } else {
            const emptyLoginRequest: loginRequest = {
                username: "",
                password: "",
            }
            return emptyLoginRequest;
        }
    }

    const hasValidInputFields = (inputs: loginRequest) => {
        if (inputs.username.length < 1) {
            clearWarningsSetWarning("username", "Input your username");
            return false;
        }
        if (inputs.password.length < 1) {
            clearWarningsSetWarning("password", "Password required");
            return false;
        }
        return true;
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const request = formLoginRequest();
        if (!hasValidInputFields(request)) {
            return;
        }

        const axiosRequest = async () => {
            await axios.post('http://localhost:8080/api/v1/auth/login', request)
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data['token']);
                    localStorage.setItem('420token', response.data['token']);
                    navigate('/');
                }
            })
            .catch(error => {
                if (error.response) {
                    if (error.response.status === 404) {
                        clearWarningsSetWarning("username", usernameNotRegisteredMessage);
                    } else if (error.response.status === 403) {
                        clearWarningsSetWarning("password", wrongPasswordMessage);
                    }
                }
            });
        }
        axiosRequest();
    }
    return (
        <form onSubmit={handleSubmit} className={"flex-column"}>
            <div className={"input-group mb-2"}>
                    <input  
                        ref={usernameRef}
                        type={"text"}
                        id={"username"}
                        className={"form-control text-light bg-dark placeholder-light " + (usernameWarning != "" && "is-invalid")}
                        placeholder={"Username"}
                        autoComplete={"off"}
                        onChange={handlePasswordAndUsernameChange}
                    />
            </div>
            <div className={"text-danger ps-2" + (usernameWarning === "" && "d-none")}>{usernameWarning}</div>
            <div className={"input-group mb-2"}>
                <input
                    ref={passwordRef}
                    type={passwordVisible ? "text" : "password"}
                    id={"password"}
                    className={"form-control text-light bg-dark placeholder-light " + (passwordWarning != "" && "is-invalid")}
                    placeholder={"Password"}
                    aria-label={"Password"}
                    onChange={handlePasswordAndUsernameChange}
                />
                <button onClick={handleClick} className="btn btn-outline-light" type="button" id="button-addon1">
                    <i className={passwordVisible ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"}></i>
                </button>
            </div>
            <div className={"text-danger ps-2 " + (passwordWarning === "" && "d-none")}>{passwordWarning}</div>
            <div className={"d-grid mb-3"}>
                <button type={"submit"} name={"signIn"} className={"btn btn-dark border-light"}>Log In
                </button>
            </div>
            <div className={"row justify-content-center"}>
                <p className={"small-font text-white text-center"}>Don't have an account yet? <span className={"text-btn"} onClick={handleSignInButton}>Sign up</span></p>
            </div>
        </form>
    );
}