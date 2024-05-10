import React, {ChangeEvent, useRef, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

interface registerRequest {
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string
}

interface Props {
    setForm: React.Dispatch<React.SetStateAction<string>>;
}
export default function RegisteringForm ({ setForm }: Props) {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordsWarning, setPasswordsWarning] = useState("");
    const [namesWarning, setNamesWarning] = useState("");
    const [emailWarning, setEmailWarning] = useState("");
    const [usernameWarning, setUsernameWarning] = useState("");
    const [isPasswordInputFocused, setIsPasswordInputFocusesd] = useState(false);
    const navigate = useNavigate();
    const emailAlreadyRegisteredResponseMessage = "Account with such email is already registered";
    const passwordsDontMatchMessage = "Passwords don't match";
    const [hasSixChar, setHasSixChar] = useState(false);
    const [hasOneCapital, setHasOneCapital] = useState(false);
    const [hasOneLowercase, setHasOneLowercase] = useState(false);
    const [hasOneNumber, setHasOneNumber] = useState(false);
    const validPassword = (hasSixChar && hasOneCapital && hasOneLowercase && hasOneNumber);
    const passwordNotValidResponseMessage = "Not a valid password";
    const clearWarningsSetWarning = (setWarning: React.Dispatch<React.SetStateAction<string>>, warning: string) => {
        setEmailWarning("");
        setPasswordsWarning("");
        setUsernameWarning("");
        setNamesWarning("");
        setWarning(warning);
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const request = formRegisterRequest();

        if(!hasValidRequiredInputs(request)) {
            return;
        }

        if (passwordRef.current != null && passwordConfirmRef.current != null) {
            if (passwordRef.current.value != passwordConfirmRef.current.value) {
                clearWarningsSetWarning(setPasswordsWarning, passwordsDontMatchMessage);
                return;
            }
        }

        const axiosRequest = async () => {
            await axios.post('http://localhost:8080/api/v1/auth/register', request)
            .then(response => {
                if (response.status === 200) {
                    localStorage.setItem('420token', response.data['token']);
                    navigate('/');
                }
            })
            .catch(error => {
                if (error.response) {
                    if (error.response.data === "Not a valid email") {
                        clearWarningsSetWarning(setEmailWarning, "Not a valid email");
                    }
                    if (error.response.data === emailAlreadyRegisteredResponseMessage) {
                        clearWarningsSetWarning(setEmailWarning, emailAlreadyRegisteredResponseMessage)
                    }
                    if (error.response.data === "Username is already taken") {
                        clearWarningsSetWarning(setUsernameWarning, "Username is already taken");
                    }
                    if (error.response.data === passwordNotValidResponseMessage) {
                        clearWarningsSetWarning(setPasswordsWarning, passwordNotValidResponseMessage);
                    }
                }
            })
        }
        axiosRequest();
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const id = event.target.id;
        if ((id === "firstName" || id === "lastName") && namesWarning != "") {
            setNamesWarning("");
        } else if (id === "email" && emailWarning != "") {
            setEmailWarning("");
        } else if (id === "username" && usernameWarning != "") {
            setUsernameWarning("");
        } else if ((id === "password" || id === "passwordConfirmation")) {
            checkEachPasswordRequirement();
            if (passwordsWarning != "") {
                setPasswordsWarning("");
            }
        }
    }
    const handleClick = () => {
        setPasswordVisible(!passwordVisible);
    }

    const handleFormChange = () => {
        setForm("logging");
    }

    const checkEachPasswordRequirement = () => {
        if (passwordRef.current != null) {
            const password = passwordRef.current.value;
            if (password.length < 6) {
                setHasSixChar(false);
            } else {
                setHasSixChar(true);
            }

            const containsCapitalRegEx = /.*[A-Z].*/
            if (!containsCapitalRegEx.test(password)) {
                setHasOneCapital(false);
            } else {
                setHasOneCapital(true);
            }

            const containsLowercaseRegEx = /.*[a-z].*/
            if (!containsLowercaseRegEx.test(password)) {
                setHasOneLowercase(false);
            } else {
                setHasOneLowercase(true);
            }

            const containsNumberRegEx = /.*\d.*/
            if (!containsNumberRegEx.test(password)) {
                setHasOneNumber(false);
            } else {
                setHasOneNumber(true);
            }

        }
    }
    const formRegisterRequest = () => {
        if (
            usernameRef.current != null && firstNameRef.current != null &&
            lastNameRef.current != null && emailRef.current != null && passwordRef.current != null
        ) {
            const firstName = firstNameRef.current.value;
            const lastName = lastNameRef.current.value;
            const email = emailRef.current.value;
            const username = usernameRef.current.value;
            const password = passwordRef.current.value;

            const request: registerRequest = {
                firstName,
                lastName,
                email,
                username,
                password
            }

            return request;
        } else {
            const emptyRequest: registerRequest = {
                firstName: "",
                email: "",
                username: "",
                password: "",
                lastName: ""
            }
            return emptyRequest;
        }


    }

    const hasValidRequiredInputs = (inputs: registerRequest) => {
        if (inputs.firstName.length < 1) {
            clearWarningsSetWarning(setNamesWarning, "Please provide your name");
            return false;
        }
        if (inputs.lastName.length < 1) {
            clearWarningsSetWarning(setNamesWarning, "Please provide your name");
            return false;
        }
        if (inputs.email.length < 1) {
            clearWarningsSetWarning(setEmailWarning, "Please provide your email adress");
            return false;
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(inputs.email)) {
            clearWarningsSetWarning(setEmailWarning, "Please provide a valid email adress");
            return false;
        }
        if (inputs.username.length < 1) {
            clearWarningsSetWarning(setUsernameWarning, "Please choose your username");
            return false;
        }
        if (inputs.password.length < 1) {
            clearWarningsSetWarning(setPasswordsWarning, "Please choose a password")
            return false;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(inputs.password)) {
            clearWarningsSetWarning(setPasswordsWarning, "Please choose a correct password")
            return false;
        }
        return true;
    }
    return (
        <form onSubmit={handleSubmit} className={"flex-column"}>
            <div className={"input-group mb-2"}>
                <input
                    ref={firstNameRef}
                    type={"text"}
                    id={"firstName"}
                    placeholder={"First Name"}
                    autoComplete={"off"}
                    className={"form-control placeholder-light text-light bg-dark " + (namesWarning != "" && "is-invalid")}
                    onChange={handleChange}
                    onFocus={() => {
                        setIsPasswordInputFocusesd(false)
                    }}
                />
            </div>
            <div className="input-group mb-2">
                <input
                    className={"form-control placeholder-light text-light bg-dark " + (namesWarning != "" && "is-invalid")}
                    ref={lastNameRef}
                    id={"lastName"}
                    placeholder={"Last Name"}
                    type={"text"}
                    autoComplete={"off"}
                    onChange={handleChange}
                    onFocus={() => {
                        setIsPasswordInputFocusesd(false)
                    }}
                />
            </div>

            <div className={"text-danger ps-2 " + (namesWarning === "" && "d-none")}>{namesWarning}</div>
            <div className={"input-group mb-2"}>
                <input
                    ref={emailRef}
                    onChange={handleChange}
                    type={"text"}
                    id={"email"}
                    className={"form-control placeholder-light text-light bg-dark " + (emailWarning != "" && "is-invalid")}
                    placeholder={"Email"}
                    autoComplete={"off"}
                    onFocus={() => {
                        setIsPasswordInputFocusesd(false)
                    }}
                />
            </div>
            <div className={"text-danger ps-2 " + (emailWarning === "" && "d-none")}>{emailWarning}</div>
            <div className={"input-group mb-2"}>
                <input
                    ref={usernameRef}
                    type={"text"}
                    id={"username"}
                    className={"form-control placeholder-light text-light bg-dark " + (usernameWarning != "" && "is-invalid")}
                    placeholder={"Username"}
                    autoComplete={"off"}
                    onChange={handleChange}
                    onFocus={() => {
                        setIsPasswordInputFocusesd(false)
                    }}
                />
            </div>
            <div className={"text-danger p-2 " + (usernameWarning === "" && "d-none")}>{usernameWarning}</div>
            <div className={"input-group mb-2"}>
                <input
                    ref={passwordRef}
                    type={passwordVisible ? "text" : "password"}
                    id={"password"}
                    className={"form-control placeholder-light text-light bg-dark " + (passwordsWarning != "" && "is-invalid")}
                    placeholder={"Password"}
                    aria-label={"Password"}
                    autoComplete={"off"}
                    onChange={handleChange}
                    onFocus={() => {
                        setIsPasswordInputFocusesd(true)
                    }}
                />
                <button onClick={handleClick} className="btn btn-outline-light" type="button" id="button-addon1">
                    <i className={passwordVisible ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"}></i>
                </button>
            </div>
            <div className={"input-group mb-2"}>
                <input
                    ref={passwordConfirmRef}
                    type={passwordVisible ? "text" : "password"}
                    id={"passwordConfirmation"}
                    className={"form-control placeholder-light text-light bg-dark " + (passwordsWarning != "" && "is-invalid")}
                    placeholder={"Confirm password"}
                    aria-label={"Password confirmation"}
                    autoComplete={"off"}
                    onChange={handleChange}
                    onFocus={() => {
                        setIsPasswordInputFocusesd(true)
                    }}
                />
            </div>
            <div className={"" + ((!isPasswordInputFocused || validPassword) && "d-none")}>
                <ul>
                    <li id={"sixChar"} className={hasSixChar ? "text-success" : "text-danger"}>
                        At least 6 characters long
                        <i className={"bi ps-2 " + (hasSixChar ? "bi-check-circle" : "bi-x-circle")}></i>
                    </li>
                    <li id={"oneCapital"} className={hasOneCapital ? "text-success" : "text-danger"}>
                        At least one capital letter
                        <i className={"bi ps-2 " + (hasOneCapital ? "bi-check-circle" : "bi-x-circle")}></i>
                    </li>
                    <li id={"oneLowercase"} className={hasOneLowercase ? "text-success" : "text-danger"}>
                        At least 1 lowercase letter
                        <i className={"bi ps-2 " + (hasOneLowercase ? "bi-check-circle" : "bi-x-circle")}></i>
                    </li>
                    <li id={"oneNumber"} className={hasOneNumber ? "text-success" : "text-danger"}>
                        At least one number
                        <i className={"bi ps-2 " + (hasOneNumber ? "bi-check-circle" : "bi-x-circle")}></i>
                    </li>
                </ul>
            </div>
            <div className={"text-danger ps-2 " + (passwordsWarning === "" && "d-none")}>{passwordsWarning}</div>
            <div className={"d-grid mb-3 mb-md-1"}>
                <button type={"submit"} name={"signIn"} className={"btn btn-dark btn-outline-light"}>Register
                </button>
            </div>
            <div className={""}>
                <div className={"text-white text-center"}>
                    <p>Already have an account? <span onClick={handleFormChange} className="text-btn">Sign in</span></p>
                </div>
            </div>
        </form>
    );
}