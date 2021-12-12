import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Image from 'next/image'
import React from "react";
import PlaceholderImage from "../../graphics/Nature.png"

// Wrapper with header & image background for pages

// Styles for the image and its mask
const useStyles = makeStyles({
    image: {
        objectFit: "cover",
        position: "absolute",
        width: "100%",
        height: "100%"
    },
    imageWrapper: {
        width: "100%",
        "& > div": {
            height: "175px !important",
            position: "absolute !important",
            width: "100%",
            "& > div": {
                height: "175px !important"
            }
        }
    },

    // Gradient mask for better text contrast
    imageMask: {
        mask: "linear-gradient(to right, black, black 30%, transparent 100%)",
        backdropFilter: "blur(3px)",
        backgroundColor: "rgba(64, 64, 64, 40%)"
    }
});

interface ImageHeadWrapperProps {

    // Title, subtitle, and helper element of header
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    helper?: React.ReactNode;

    // Source of the image
    src?: string | StaticImageData;
};

export const ImageHeadWrapper: React.FC<ImageHeadWrapperProps> = ({ title, subtitle, helper, src, children }) => {

    // Classes to implement styles
    const styles = useStyles();

    return (

        // Grid for header + content
        <Box display="grid" gridTemplateRows="175px 1fr" height="100%" position="relative">

            {/* Title, subtitle, and helper texts */}
            <Box padding={4}>
                <h1 style={{ color: "white", fontSize: 48 }}>{title}</h1>
                <h2 style={{ color: "white", fontSize: 24 }}>{subtitle}</h2>
                <p style={{ color: "white", fontSize: 16, marginTop: 8 }}>{helper}</p>
            </Box>

            {/* Background image */}
            <Box height={175} className={styles.imageWrapper} position="absolute" zIndex={-1}>

                {typeof src === "string"
                    // Source type link
                    ? <img src={src} className={styles.image} />

                    // Source type image
                    : src
                        ? <Image src={src} className={styles.image} />

                        // Placeholder image otherwise
                        : <Image src={PlaceholderImage} className={styles.image} />
                }
                <Box height={175} width="100%" className={styles.imageMask} zIndex={1} />
            </Box>

            {/* Flex container for children */}
            < Box display="flex" flexDirection="column" position="relative" >
                {children}
            </Box >
        </Box>
    );
};