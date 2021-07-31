import { Box, makeStyles } from "@material-ui/core";
import Image from 'next/image'
import React from "react";
import PlaceholderImage from "../../graphics/Nature.png"

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
    imageMask: {
        mask: "linear-gradient(to right, black, black 30%, transparent 100%)",
        backdropFilter: "blur(3px)",
        backgroundColor: "rgba(64, 64, 64, 40%)"
    }
});

interface ImageHeadWrapperProps {
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    helper?: React.ReactNode;
    src?: string | StaticImageData;
};

export const ImageHeadWrapper: React.FC<ImageHeadWrapperProps> = ({ title, subtitle, helper, src }) => {
    const classes = useStyles();

    return (
        <Box display="grid" gridTemplateRows="175px 1fr" height="100%" position="relative">
            <Box padding={4}>
                <h1 style={{ color: "white", fontSize: 48 }}>{title}</h1>
                <h2 style={{ color: "white", fontSize: 24 }}>{subtitle}</h2>
                <p style={{ color: "white", fontSize: 16, marginTop: 8 }}>{helper}</p>
            </Box>
            <Box height={175} className={classes.imageWrapper} position="absolute" zIndex={-1}>
                {typeof src === "string"
                    ? <img src={src} className={classes.image} />
                    : src
                        ? <Image src={src} className={classes.image} />
                        : <Image src={PlaceholderImage} className={classes.image} />
                }
                <Box height={175} width="100%" className={classes.imageMask} zIndex={1} />
            </Box>
        </Box>
    );
};