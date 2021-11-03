import React from "react";
import Link from "next/link";

// Homepage of site
// #WIP

const index: React.FC = ({}) => {
    return(
        // Placeholder for actual page
        <h1>
            Hello! This page has not yet been built. Please Visit{" "}
            <Link href="/dashboard"><a>/dashboard</a></Link>{" "}
            instead.
        </h1>
    );
};

export default index;