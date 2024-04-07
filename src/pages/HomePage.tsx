import Navbar from "../components/Navbar.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
export default function HomePage() {
    
    const navigate = useNavigate();

    const [data, setData] = useState(null);

    
    useEffect(() => {
        const getHomePageData =
        async () => {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`
            }
            // axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('token')
            axios.get('http://localhost:8080/api/v1/week' + "?date=2024-01-01", {headers: headers}).then(response => {
                setData(response.data);
            }).catch(error => {
                if (error.response.status === 403) {
                    console.log("from home page")
                    navigate('/login');
                }
            })
        }
        getHomePageData();
    })
    return (
        <div className={"container-fluid flex-column p-0 align-self-start"}>
            <Navbar></Navbar>
            <div className={"d-flex text-white p-5 justify-content-evenly align-items-center"}>
                <div className={"p-1"}>
                    You're logged in!
                </div>
                <div className={"p-1"}>
                    <ul className={"list-group"}>
                        <li className={"list-group-item"}>
                            That's great
                        </li>
                        <li className={"list-group-item"}>
                            But what is your median weight?
                        </li>
                        <li className={"list-group-item"}>
                            I think I know the answer
                        </li>
                        <li className={"list-group-item"}>
                            At least from this week
                        </li>
                        <li className={"list-group-item"}>
                            It's: {data}kg
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}