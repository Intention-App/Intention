import { Box, withStyles, Menu, MenuItem } from "@material-ui/core";
import React from "react";
import { FaPlus } from "react-icons/fa";
import theme from "../styles/theme";

interface action {
    name: string;
    func: (...params: any) => any;
}

interface AddNewProps {
    buttonFunctions: action[];
};
const ITEM_HEIGHT = 48;

const StyledBox = withStyles({
    root: {
        marginTop: 8,
        border: "2px dashed var(--border)",
        borderRadius: 8,
        cursor: "pointer",
        transition: "background 250ms",
        backgroundColor: "var(--bg-primary)",
        "&:focus": {
            backgroundColor: "var(--bg-hover)",
            outline: "none"
        },
        "&:hover": {
            backgroundColor: "var(--bg-hover)"
        },
    }
})(Box);


export const AddNew: React.FC<AddNewProps> = ({ buttonFunctions }) => {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <StyledBox display="flex" justifyContent="center" alignItems="center" paddingY={1.5}
                tabIndex={0} onClick={handleClick}
                onKeyDown={(e) => { if (e.key == "Enter") handleClick(e) }}
            >
                <FaPlus color={theme.palette.primary.main} style={{ marginRight: 8 }} />
                Add New File
            </StyledBox>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch',
                    },
                }}
            >
                {buttonFunctions.map((option) => (
                    <MenuItem key={option.name} onClick={() => {
                        handleClose();
                        option.func();
                    }}>
                        {option.name}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
};