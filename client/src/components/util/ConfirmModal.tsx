import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import React from "react";
import { colors } from "../../styles/theme";

// Modal to confirm deletions etc.

interface ConfirmModalProps {
    // Whether modal is open
    open: boolean;

    // Function to close modal
    closeModal: () => void;

    // Function to run if confirmed
    fn?: (...params: any) => any;
};

// Display and effect of modal type for other components
export interface ModalState {
    // Message of modal
    message: string;

    // Function to run if confirmed
    fn?: (...params: any) => any;
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ children, open, closeModal, fn }) => {

    return (
        // Modal for text and buttons
        <Modal
            open={open}
            onClose={closeModal}
        >

            {/* Container for Box */}
            <Box width="100%" height="100%" display="flex" alignItems="center" justifyContent="center">

                {/* Box for alignment */}
                <Box display="flex" flexDirection="column" bgcolor={colors.background.primary}
                    padding={4} borderRadius={8} fontSize={18}>

                    {children}

                    {/* Flexbox for buttins */}
                    <Box display="flex" alignItems="center" justifyContent="space-around" marginTop={2}>

                        {/* Cancel button */}
                        <Button onClick={closeModal}>
                            Cancel
                        </Button>

                        {/* Confirm button that runs function */}
                        <Button variant="contained" color="primary" onClick={() => {
                            if (fn) fn();
                            closeModal();
                        }}>
                            Confirm
                        </Button>
                    </Box>
                </Box>

            </Box>
        </Modal>
    );
};