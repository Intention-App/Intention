import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../../generated/graphql";

export const useIsAuth = () => {

    const router = useRouter();

    // Paths related to login, if authorized, redirect away
    const signInPaths = ["login", "register"];

    // Router redirects to login if user is not logged in
    const [{ data, fetching }] = useMeQuery();
    useEffect(() => {
        if (!data?.me && !fetching && router.pathname !== "/login") {
            router.replace("/login?next=" + router.pathname);
        }
        else if (data?.me && signInPaths.includes(router.pathname.split("/")[1])) {
            router.replace("/dashboard");
        }
    }, [data, fetching, router])

    return data?.me;
}