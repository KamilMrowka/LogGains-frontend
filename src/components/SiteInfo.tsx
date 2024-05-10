export default function SiteInfo() {
    return (
        <div className={"text-white"}>
            <h1 className="site-info-title mb-4">LOGgains helps you:</h1>
            <ul className="site-info-list ms-4 ms-md-0">
                <li className="d-flex">
                    <i className="bi bi-circle-fill text-log-green me-2"></i>
                    <p>Save your measurements</p>
                </li>
                <li className="d-flex">
                    <i className="bi bi-circle-fill text-log-green me-2"></i>
                    <p>Make your fitness data clear and readable</p>
                </li>
                <li className="d-flex">
                    <i className="bi bi-circle-fill text-log-green me-2"></i>
                    <p>Get accurate calculations</p>
                </li>
                <li className="d-flex">
                    <i className="bi bi-circle-fill text-log-green me-2"></i>
                    <p>Stay motivated by visualising your progress</p>
                </li>
            </ul>
        </div>
    )
}