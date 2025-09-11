import Header from "./Components/Header/Header";
import { Outlet } from "react-router-dom";
import PageTracker from "./PageTracker";
import Home from "./Components/Home/Home";

function Layout() {
  return (
    <>
      <Home />
      <PageTracker />

      <Header />
      <Outlet />
    </>
  )
}
export default Layout