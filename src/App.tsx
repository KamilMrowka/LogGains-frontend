import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from "./pages/HomePage.tsx";
import {Route, Routes} from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import ComparePage from './pages/ComparePage.tsx';
import CalendarPage from './pages/CalendarPage.tsx';


function App() {
    return (
        <Routes>
            <Route path="/" element={ <HomePage /> } />
            <Route path="/login" element={ <LoginPage /> } />
            <Route path="/compare" element={ <ComparePage /> } />
            <Route path='/calendar' element={ <CalendarPage></CalendarPage> } />
        </Routes>
  )
}

export default App
