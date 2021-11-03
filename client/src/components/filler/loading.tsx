import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { colors } from "../../styles/theme";

interface LoadingProps {
    disp?: number;
    speed?: number;
}

export const Loading: React.FC<LoadingProps> = ({ disp = 15, speed = 1 }) => {

    // Animations and assignig them to classes
    const useStyles = makeStyles({
        "@keyframes 1-1-shift": {
            "0%": {
                transform: "translate(0, 0)"
            },
            "25%": {
                transform: `translate(-${disp}px, -${disp}px)`,
                borderRadius: "8px"
            },
            "50%": {
                transform: "translate(0, 0)",
                borderRadius: "8px 0 0 0"
            }
        },
        "@keyframes 1-2-shift": {
            "0%": {
                transform: "translate(0, 0)"
            },
            "25%": {
                transform: `translate(0, -${disp}px)`,
                borderRadius: "8px"
            },
            "50%": {
                transform: "translate(0, 0)",
                borderRadius: "0 0 0 0"
            }
        },
        "@keyframes 1-3-shift": {
            "0%": {
                transform: "translate(0, 0)"
            },
            "25%": {
                transform: `translate(${disp}px, -${disp}px)`,
                borderRadius: "8px"
            },
            "50%": {
                transform: "translate(0, 0)",
                borderRadius: "0 8px 0 0"
            }
        },
        "@keyframes 2-1-shift": {
            "0%": {
                transform: "translate(0, 0)"
            },
            "25%": {
                transform: `translate(-${disp}px, 0)`,
                borderRadius: "8px"
            },
            "50%": {
                transform: "translate(0, 0)",
                borderRadius: "0 0 0 0"
            }
        },
        "@keyframes 2-3-shift": {
            "0%": {
                transform: "translate(0, 0)"
            },
            "25%": {
                transform: `translate(${disp}px, 0)`,
                borderRadius: "8px"
            },
            "50%": {
                transform: "translate(0, 0)",
                borderRadius: "0 0 0 0"
            }
        },
        "@keyframes 3-1-shift": {
            "0%": {
                transform: "translate(0, 0)"
            },
            "25%": {
                transform: `translate(-${disp}px, ${disp}px)`,
                borderRadius: "8px"
            },
            "50%": {
                transform: "translate(0, 0)",
                borderRadius: "0 0 0 8px"
            }
        },
        "@keyframes 3-2-shift": {
            "0%": {
                transform: "translate(0, 0)"
            },
            "25%": {
                transform: `translate(0, ${disp}px)`,
                borderRadius: "8px"
            },
            "50%": {
                transform: "translate(0, 0)",
                borderRadius: "0 0 0 0"
            }
        },
        "@keyframes 3-3-shift": {
            "0%": {
                transform: "translate(0, 0)"
            },
            "25%": {
                transform: `translate(${disp}px, ${disp}px)`,
                borderRadius: "8px"
            },
            "50%": {
                transform: "translate(0, 0)",
                borderRadius: "0 0 8px 0"
            }
        },
        "block-1-1": {
            animation: `$1-1-shift ${2 / speed}s infinite ${0.75 / speed}s ease-in-out`,
            borderRadius: "8px 0 0 0"
        },
        "block-2-1": {
            animation: `$2-1-shift ${2 / speed}s infinite ${1 / speed}s ease-in-out`
        },
        "block-3-1": {
            animation: `$3-1-shift ${2 / speed}s infinite ${1.25 / speed}s ease-in-out`,
            borderRadius: "0 0 0 8px"
        },
        "block-3-2": {
            animation: `$3-2-shift ${2 / speed}s infinite ${1.5 / speed}s ease-in-out`
        },
        "block-3-3": {
            animation: `$3-3-shift ${2 / speed}s infinite ${1.75 / speed}s ease-in-out`,
            borderRadius: "0 0 8px 0"
        },
        "block-2-3": {
            animation: `$2-3-shift ${2 / speed}s infinite 0s ease-in-out`
        },
        "block-1-3": {
            animation: `$1-3-shift ${2 / speed}s infinite ${0.25 / speed}s ease-in-out`,
            borderRadius: "0 8px 0 0"
        },
        "block-1-2": {
            animation: `$1-2-shift ${2 / speed}s infinite ${0.5 / speed}s ease-in-out`
        },
        "block": {
            height: 30,
            width: 30,
            backgroundColor: colors.action.primary
        },
    })

    const styles = useStyles();

    return (
        // Grid to center the loading animation
        <Box width="100%" height="100%" display="flex" alignItems="center" justifyContent="center">

            {/* Intention loading screen */}
            <Box display="grid" gridTemplateColumns="repeat(3, 30px)" gridTemplateRows="repeat(3, 30px)">
                <Box className={styles["block-1-1"].concat(" ", styles["block"])}></Box>
                <Box className={styles["block-1-2"].concat(" ", styles["block"])}></Box>
                <Box className={styles["block-1-3"].concat(" ", styles["block"])}></Box>
                <Box className={styles["block-2-1"].concat(" ", styles["block"])}></Box>
                <Box className={styles["block"]}></Box>
                <Box className={styles["block-2-3"].concat(" ", styles["block"])}></Box>
                <Box className={styles["block-3-1"].concat(" ", styles["block"])}></Box>
                <Box className={styles["block-3-2"].concat(" ", styles["block"])}></Box>
                <Box className={styles["block-3-3"].concat(" ", styles["block"])}></Box>
            </Box>

        </Box>
    );
};