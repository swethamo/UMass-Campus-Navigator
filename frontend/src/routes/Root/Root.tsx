import Navbar from "../../components/Navbar";
import "./Root.css";
import { Outlet, useLocation } from "react-router-dom";

function Root() {
  const location = useLocation();

  return (
    <>
      {!["/login"].includes(location.pathname) && <Navbar />}
      <Outlet />
    </>
  );
}

export default Root;
