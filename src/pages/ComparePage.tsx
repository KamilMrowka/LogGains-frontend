import { useState } from "react";
import Navbar from "../components/Navbar";

interface ComparePageResponse {

}

export default function ComparePage() {

    const [firstDate, setFirstDate] = useState<string>("");
    const [secondDate, setSecondDate] = useState<string>("");
    const [response, setResponse] = useState<ComparePageResponse>();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    };


    return (
        <div>
            <Navbar></Navbar>
            <main>
                <div className="d-flex align-items-start justify-content-xxl-between flex-column flex-xxl-row text-white main-container mt-5">
                    <h1 className="compare-heading">Select two days to compare their corresponding weeks and months:</h1>
                    <form onSubmit={handleSubmit} className="d-flex justify-content-between">
                        <input type="date" onChange={(e) => setFirstDate(e.target.value)} value={firstDate} placeholder="First day" className="bg-dark form-control text-white datepicker me-5"></input>
                        <input type="date" onChange={(e) => setSecondDate(e.target.value)} value={secondDate}placeholder="Second day" className="bg-dark form-control text-white datepicker me-5"></input>
                        <button type="submit" className="btn btn-dark border-light">Compare</button>
                    </form>
               </div>
            </main>
        </div>
   )
}