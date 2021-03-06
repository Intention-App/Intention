import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import React from "react";
import { useLogoutMutation, User } from "../../generated/graphql";
import { NavButton } from "./NavButton";
import { FaBook, FaCheckCircle, FaCube, FaHome, FaProjectDiagram, FaTrash } from "react-icons/fa";
import { IoSettingsOutline, IoSearchOutline, IoPersonOutline } from "react-icons/io5";
import { Divider } from "../filler/divider";
import { colors } from "../../styles/theme";

interface SidebarProps {
    user: Pick<User, "firstName" | "lastName">;
}

export const Sidebar: React.FC<SidebarProps> = ({ user }) => {

    // Log out function
    const [, logout] = useLogoutMutation();

    return (
        // Sidebar with styles
        <Paper elevation={4} square style={{
            width: "100%",
            height: "100vh",
            padding: "16px 0",
            display: "flex",
            flexDirection: "column",
        }}>
            {/* User logged in */}
            <Box display="flex" alignItems="center" marginBottom={2} paddingLeft={2}>
                <img src="https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars.png" style={{ height: 36, width: 36, marginRight: 8, borderRadius: "50%" }} />
                <h3>{`${user.firstName} ${user.lastName}`}</h3>
            </Box>

            <Divider />

            {/* Utility and settings */}
            <Box  marginY={2} paddingLeft={2}>
                <NavButton href="/search" icon={IoSearchOutline}>Quick Search</NavButton>
                <NavButton href="/profile" icon={IoPersonOutline}>Profile</NavButton>
                <NavButton href="/settings" icon={IoSettingsOutline}>Settings</NavButton>
            </Box>

            <Divider />

            {/* Main application functions */}
            <Box marginY={2} paddingLeft={2}>
                <NavButton href="/dashboard" icon={FaHome}>Dashboard</NavButton>
                {/* <NavButton href="/schedule" icon={FaCalendar}>Schedule</NavButton> */}
                <NavButton href="/checklist" icon={FaCheckCircle}>Checklist</NavButton>
                <NavButton href="/journal" icon={FaBook}>Journal</NavButton>
                <NavButton href="/modules" icon={FaCube}>Modules</NavButton>
                {/* <NavButton href="/goals" Icon={FaFlag}>Goal Setting</NavButton> */}
            </Box>

            <Divider />

            {/* Trash bin */}
            <Box  marginY={2} paddingLeft={2}>
                <NavButton href="bin" icon={FaTrash}>Bin</NavButton>
            </Box>

            {/* Blank space */}
            <Box marginY={2} paddingLeft={2} flex="100px 1 1" flexDirection="column" />

            {/* Trademark */}
            <Box marginTop={2} paddingLeft={2}>
                <p style={{ color: colors.text.secondary, fontSize: 12 }}>Intention &copy; 2021</p>
            </Box>
        </Paper>
    );
};