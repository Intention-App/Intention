import React from "react";
import Image from 'next/image';
import Box from "@material-ui/core/Box";
import { colors } from "../../styles/theme";

export const BrandingHeader: React.FC = ({ children }) => {
    return (
        <Box height={80} display="flex" alignItems="center" justifyContent="space-between" paddingX={8} bgcolor={colors.background.primary}>
            <Box display="flex" alignItems="center">
                <Image src="/images/IntentionLogo.png" width={40} height={40} quality={100} />
                <h2 style={{ color: colors.text.title, marginLeft: "1rem" }}>Intention</h2>
            </Box>
            <Box display="flex" alignItems="center">
                {children}
            </Box>
        </Box>
    );
};