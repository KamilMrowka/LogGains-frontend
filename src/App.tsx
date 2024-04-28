import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from "./pages/HomePage.tsx";
import {Route, Routes} from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";


function App() {
    return (
        <div className={"main-container"}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </div>
    )
}

export default App
