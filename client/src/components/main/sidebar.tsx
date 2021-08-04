import { Box, Paper } from "@material-ui/core";
import { useRouter } from "next/router";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../../generated/graphql";
import { NavButton } from "./NavButton";
import { FaBook, FaCalendar, FaCheckCircle, FaCog, FaFlag, FaHome, FaProjectDiagram, FaSearch, FaTrash, FaUser } from "react-icons/fa";

export const Sidebar: React.FC = ({ }) => {

    const router = useRouter();
    const [, logout] = useLogoutMutation();
    const [{ data, fetching }, me] = useMeQuery();

    if (!data?.me && !fetching) {
        router.push("/login");
    }

    return (
        <Paper elevation={4} square style={{
            width: "100%",
            height: "100vh",
            padding: 16,
            paddingRight: 0,
            display: "flex",
            flexDirection: "column",
            zIndex: 1300
        }}>
            <Box display="flex" alignItems="center" marginBottom={1}>
                {/* <img src="" style={{ height: 48, width: 48, borderRadius: "50%" }} /> */}
                <h3>{data?.me?.username}</h3>
            </Box>

            <Box marginY={1}>
                <NavButton href="/search" small Icon={FaSearch}>Quick Search</NavButton>
                <NavButton href="/profile" small Icon={FaUser}>Profile</NavButton>
                <NavButton href="/settings" small Icon={FaCog}>Settings</NavButton>
            </Box>

            <Box marginY={1}>
                <NavButton href="dashboard" Icon={FaHome}>Dashboard</NavButton>
                {/* <NavButton href="schedule" Icon={FaCalendar}>Schedule</NavButton> */}
                <NavButton href="checklist" Icon={FaCheckCircle}>Checklist</NavButton>
                <NavButton href="journal" Icon={FaBook}>Journal</NavButton>
                <NavButton href="modules" Icon={FaProjectDiagram}>Modules</NavButton>
                {/* <NavButton href="goals" Icon={FaFlag}>Goal Setting</NavButton> */}
            </Box>

            <Box marginY={1} flex="100px 1 1" flexDirection="column">
                <p style={{ fontSize: 14 }}>Quick Access</p>
            </Box>

            <Box marginY={1}>
                <NavButton href="bin" Icon={FaTrash}>Bin</NavButton>
            </Box>

            <Box marginTop={1}>
                <p style={{ color: "var(--secondary)", fontSize: 12 }}>Intention 2021</p>
            </Box>
        </Paper>
    );
};