import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import { Divider } from "./divider";

// Icon button with menu

interface menuButtonProps {
    // Possible actions on clicking the button
    options: [action, ...(action | "divider")[]];
};

// Name and function of a button function
interface action {
    name: string;
    fn: (...params: any) => any;
}

// Height of each menu item
const ITEM_HEIGHT = 48;

export const MenuButton: React.FC<menuButtonProps> = ({ options, children }) => {

    // Anchor element decides whether menu is open
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    // Anchors to icon button element
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    // Clears Anchor
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box>

            {/* Icon button with click interactions */}
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
            >
                {children}
            </IconButton>

            {/* Menu item that opens and closes */}
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

                {/* Options or division */}
                {options.map((option, index) => (option === "divider"
                        ? <Divider key={index} marginY={1}/>
                        : <MenuItem key={option.name} onClick={() => {
                            handleClose();
                            option.fn();
                        }}>
                            {option.name}
                        </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};