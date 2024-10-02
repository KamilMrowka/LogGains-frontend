import Navbar from "../components/Navbar";

export default function ComparePage() {

    return (
        <div>
            <Navbar></Navbar>
            <main>
                <div className="d-flex align-items-start justify-content-xxl-between flex-column flex-xxl-row text-white main-container mt-5">
                    <h1 className="compare-heading">Select two days to compare their corresponding weeks or months:</h1>
                    <form className="d-flex justify-content-between">
                        <input type="date" placeholder="First day" className="bg-dark form-control text-white datepicker me-5"></input>
                        <input type="date" placeholder="Second day" className="bg-dark form-control text-white datepicker me-5"></input>
                        <button type="submit" className="btn btn-dark border-light">Compare</button>
                    </form>
               </div>
            </main>
        </div>
   )
}