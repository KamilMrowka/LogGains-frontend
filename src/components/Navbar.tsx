import {useNavigate} from "react-router-dom";

export default function Navbar() {
    
    const navigate = useNavigate();

    const handleClick = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }
    
    return (
        <>
            <nav className={"nav container-fluid bg-black text-center justify-content-center"}>
                <div className="row container-fluid p-1">
                    <div className="col-1 p-1 d-flex justify-content-start">
                        <img src="/src/assets/bars-graph-svgrepo-com.svg" alt="LOGgains logo" width="50"
                             height="50"></img>
                    </div>
                    <div className="col d-flex align-self-center justify-content-center text-white">
                        Gains Center
                    </div>
                    <div className="col d-flex align-self-center justify-content-center text-white">
                        Data Center
                    </div>
                    <div className="col d-flex align-self-center justify-content-center text-white">
                        <button onClick={handleClick} className={"btn btn-outline-light text-white"}>Log out</button>
                    </div>
                </div>
            </nav>
        </>
    );
}