import Drawer from "@material-ui/core/Drawer";
import React from "react";
import { EditorItem } from "../../pages/checklist/board/[boardId]";

export interface SideModalProps {
    // Is the modal open?
    open: boolean;

    // Toggles modal
    toggleModal: (item: EditorItem | undefined) => (e: any) => any;

    // Pass closemodal function to children
    children: (closeModal: (e: any) => any) => React.ReactNode;
};

export const SideModal: React.FC<SideModalProps> = ({ children, toggleModal, open }) => {
    return (

        // Modal for editors etc.
        <Drawer anchor="right" style={{ zIndex: 1000 }} open={open} onClose={toggleModal(undefined)} >
            {children(toggleModal(undefined))}
        </Drawer>
    );
};