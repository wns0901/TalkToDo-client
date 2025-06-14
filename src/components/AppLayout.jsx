import React, { useState } from "react";
import SideBar from "./SideBar";
import { Outlet, useLocation } from "react-router-dom";
import { Fab, Box } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import ChatModal from "./ChatModal";

const AppLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const handleOpenChatModal = () => {
    setIsChatModalOpen(true);
  };

  const handleCloseChatModal = () => {
    setIsChatModalOpen(false);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ minWidth: 240, maxWidth: 320, width: 280 }}>
        <SideBar />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Outlet />
      </div>
      {!isLoginPage && (
        <>
          <Box
            sx={{
              position: "fixed",
              bottom: 20,
              right: 20,
              zIndex: 1000,
            }}
          >
            <Fab
              color="primary"
              aria-label="chat"
              onClick={handleOpenChatModal}
              sx={{
                bgcolor: "#3E1A11",
                "&:hover": {
                  bgcolor: "#2A120B",
                },
              }}
            >
              <ChatIcon />
            </Fab>
          </Box>
          <ChatModal open={isChatModalOpen} onClose={handleCloseChatModal} />
        </>
      )}
    </div>
  );
};

export default AppLayout;
