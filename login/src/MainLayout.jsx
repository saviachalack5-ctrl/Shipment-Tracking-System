import React, { useState } from "react";
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const MainLayout = ({ children, userSettings}) => {
  const location = useLocation();
  const path = location.pathname;
  const { auth } = useAuth();

  const current =
    path.includes("shipments") ? "shipments" :
    path.includes("report") ? "report" :
    path.includes("news") ? "news" :
    "";

  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <Navbar
        current={current}
        onUserClick={() => setShowSidebar(true)}
        user={auth?.user}
        userSettings={userSettings}
      />


      <div
        onClick={() => setShowSidebar(false)}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: showSidebar ? 1 : 0,
          pointerEvents: showSidebar ? "auto" : "none",
          transition: "opacity 0.3s ease",
          zIndex: 9998,
          backgroundColor: showSidebar ? "rgba(0, 0, 0, 0.4)" : "transparent",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "250px",
            height: "100vh",
            backgroundColor: "#1e1e2f",
            transform: showSidebar ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.3s ease",
            zIndex: 9999,
          }}
        >
          <SideBar onClose={() => setShowSidebar(false)} userSettings={userSettings}  />
          

        </div>
      </div>

      <main>
        {children}
      </main>
    </>
  );
};

export default MainLayout;
