import {useNavigate} from "react-router-dom";

export default function Navbar() {
    
    const navigate = useNavigate();

    const handleClick = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }
    
    return (
        <>
            <header className={"nav bg-black container-fluid"}>
                <nav className="main-container d-flex align-self-start justify-content-between align-items-center text-white">
                    <div className="nav-logo my-2">
                        <img src="/src/assets/bars-graph-svgrepo-com.svg" alt="LOGgains logo" width="50"
                             height="50"></img>
                    </div>
                    <div className="">
                        Gains Center
                    </div>
                    <div className="">
                        Data Center
                    </div>
                    <div className="">
                        <button onClick={handleClick} className={"btn btn-outline-light text-white"}>Log out</button>
                    </div>
                </nav>
            </header>
        </>
    );
}