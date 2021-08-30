import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import React from "react";

interface RegisterButtonProps {
    disabled?: boolean;
}

const StyledButton = withStyles({
    root: {
        padding: 12,
        minWidth: 128,
        borderRadius: 16,
        marginTop: 24
    }
})(Button)

export const RegisterButton: React.FC<RegisterButtonProps> = ({ children, disabled }) => {
    return (
        <StyledButton
            type="submit"
            color="primary"
            variant="contained"
            disabled={disabled}
        >
            {children}
        </StyledButton>
    );
};