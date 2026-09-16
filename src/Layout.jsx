import Header from "./Components/Header/Header";
import { Outlet } from "react-router-dom";
import PageTracker from "./PageTracker";
import Home from "./Components/Home/Home";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTrack } from "./context/Track/TrackContext";

function TrackRouteSync() {
  const { pathname } = useLocation();
  const { setTrackId } = useTrack();

  useEffect(() => {
    if (pathname === "/system-design") setTrackId("system");
    if (pathname === "/dsa") setTrackId("dsa");
  }, [pathname, setTrackId]);

  return null;
}

function Layout() {
  return (
    <>
      <Home />
      <PageTracker />
      <TrackRouteSync />

      <Header />
      <Outlet />
    </>
  )
}
export default Layout