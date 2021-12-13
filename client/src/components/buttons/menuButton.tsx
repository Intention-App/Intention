import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import { Divider } from "../filler/divider";
import { FaCaretDown } from 'react-icons/fa';
import { colors } from '../../styles/theme';

// Icon button with menu

interface menuButtonProps {
    // Possible actions on clicking the button
    options: [action, ...(action | "divider")[]];

    // Display as dropdown
    dropdown?: boolean;
};

// Name and function of a button function
interface action {
    name: string;
    fn: (...params: any) => any;
}

// Height of each menu item
const ITEM_HEIGHT = 48;

export const MenuButton: React.FC<menuButtonProps> = ({ options, dropdown, children }) => {

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

            {/* Icon button with click interactions, icon is a caret if it menu is a dropdown */}
            {dropdown
                ? <FaCaretDown
                    style={{ color: colors.text.title }}
                    tabIndex={0} onClick={e => { handleClick(e as any) }}
                    onKeyDown={(e) => { if (e.key == "Enter") handleClick(e as any) }}
                />
                : <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    {children}
                </IconButton>
            }

            {/* Menu item that opens and closes */}
            <Menu
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
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
                    ? <Divider key={index} marginY={1} />
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