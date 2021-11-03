import Box from "@material-ui/core/Box";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import { FaPlus } from "react-icons/fa";
import { colors } from "../../styles/theme";

// Button to add new files or tasks

interface AddNewProps {

    // Possible actions on clicking the button
    buttonFunctions: action[];
};

// Name and function of a button function
interface action {
    name: string;
    fn: (...params: any) => any;
}

// Height of each menu item
const ITEM_HEIGHT = 48;

// Styles for add new button
const StyledBox = withStyles({
    root: {
        marginTop: 8,
        cursor: "pointer",
        transition: "background 250ms",
        backgroundColor: colors.background.primary,
        "&:focus": {
            backgroundColor: colors.background.hover,
            color: colors.action.primary,
            outline: "none"
        },
        "&:hover": {
            backgroundColor: colors.background.hover,
            color: colors.action.primary
        },
    }
})(Box);


export const AddNew: React.FC<AddNewProps> = ({ buttonFunctions, children }) => {

    // Anchor element decides whether menu is open
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    // Anchors to icon button element to show menu, or runs function if there is only one
    const handleClick = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
        if (buttonFunctions.length > 1) {
            setAnchorEl(event.currentTarget);
        }
        else {
            if (buttonFunctions.length) {
                buttonFunctions[0].fn();
            }
        }
    };

    // Clears Anchor
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box>

            {/* Button with click interactions */}
            <StyledBox display="flex" justifyContent="center" alignItems="center" paddingY={1.5}
                tabIndex={0} onClick={handleClick}
                onKeyDown={(e) => { if (e.key == "Enter") handleClick(e) }}
            >
                <FaPlus color={colors.action.primary} style={{ marginRight: 8 }} />
                {children}
            </StyledBox>

            {/* Menu item that opens and closes, if there is more than 1 function */}
            {buttonFunctions.length > 1 &&
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

                    {/* Options */}
                    {buttonFunctions.map((option) => (
                        <MenuItem key={option.name} onClick={() => {
                            handleClose();
                            option.fn();
                        }}>
                            {option.name}
                        </MenuItem>
                    ))}
                </Menu>
            }
        </Box>
    );
};