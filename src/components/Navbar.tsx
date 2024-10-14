import {useNavigate} from "react-router-dom";

export default function Navbar() {
    
    const navigate = useNavigate();

    const handleLogOut = () => {
        localStorage.clear();
        sessionStorage.clear();
        navigate('/login');
    }

    const handleToCalendar = () => {
        navigate("/calendar");
    }

    const handleToComparator = () => {
        navigate("/compare");
    }

    const handleToHome = () => {
        navigate("/");
    }

   
    return (
        <>
            <header className={"bg-black d-flex"}>
                <nav className="main-container d-flex align-self-start justify-content-between align-items-center text-white">
                    <div onClick={handleToHome} className="nav-logo navbar-img my-4">
                        <img src="src\assets\LOG.png">
                        </img>
                    </div>
                    <div onClick={handleToCalendar} className="text-btn">
                        Gains Calendar
                    </div>
                    <div onClick={handleToComparator} className="text-btn">
                        Comparator
                    </div>
                    <div className="">
                        <button onClick={handleLogOut} className={"btn btn-outline-light text-white"}>Log out</button>
                    </div>
                </nav>
            </header>
        </>
    );
}