import { Outlet } from "react-router-dom"
import { Link } from "react-router-dom";

export default function Layout() {
    return (
        <>
            <div className="font-mono text-sm opacity-80">
                <Link to={"/"} className="mr-4">The Terminal</Link>
                <span>Finest news source powered by New York Times</span>
            </div>
            <Outlet />
        </>
    )
}