import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    getCurrentUser,
    loginUser,
    registerUser
} from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        async function restoreAuthentication() {
            const token = sessionStorage.getItem(
                "premierZoneToken"
            );

            if (!token) {
                setAuthLoading(false);
                return;
            }

            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error(
                    "Could not restore authentication:",
                    error
                );

                sessionStorage.removeItem(
                    "premierZoneToken"
                );

                setUser(null);
            } finally {
                setAuthLoading(false);
            }
        }

        restoreAuthentication();
    }, []);

    async function login(credentials) {
        const response = await loginUser(credentials);

        sessionStorage.setItem(
            "premierZoneToken",
            response.token
        );

        setUser(response.user);

        return response.user;
    }

    async function register(accountData) {
        const response = await registerUser(accountData);

        sessionStorage.setItem(
            "premierZoneToken",
            response.token
        );

        setUser(response.user);

        return response.user;
    }

    function logout() {
        sessionStorage.removeItem("premierZoneToken");
        setUser(null);
    }

    const value = useMemo(
        () => ({
            user,
            authLoading,
            isAuthenticated: Boolean(user),
            login,
            register,
            logout
        }),
        [user, authLoading]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider."
        );
    }

    return context;
}