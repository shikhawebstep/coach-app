import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [isFirstTime, setIsFirstTime] = useState(true);
    const [isProfileCompleted, setIsProfileCompleted] = useState(false);
    const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
    const [coachProfile, setCoachProfile] = useState(null);

    const fetchCoachProfile = async (currentToken = token, currentUserId = userId) => {
        if (!currentToken || !currentUserId) return;
        try {
            const myHeaders = new Headers();
            myHeaders.append('Authorization', `Bearer ${currentToken}`);
            const baseUrl = (process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.grabbite.com/').replace(/\/$/, '');
            const response = await fetch(`${baseUrl}/api/coachpro/account-profile/${currentUserId}`, {
                method: 'GET',
                headers: myHeaders,
            });
            const result = await response.json();
            if (result.status && result.data) {
                setCoachProfile(result.data);
                if (result.data.role) {
                    const roleStr = typeof result.data.role === 'string' ? result.data.role : String(result.data.role);
                    setUserRole(roleStr);
                    await AsyncStorage.setItem('userRole', roleStr);
                }
            }
        } catch (err) {
            console.error("fetchCoachProfile error:", err);
        }
    };

    useEffect(() => {
        const verifySession = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('userToken');
                const storedUserId = await AsyncStorage.getItem('userId');
                const storedUserRole = await AsyncStorage.getItem('userRole');
                const storedProfileCompleted = await AsyncStorage.getItem('isProfileCompleted');
                const storedOnboardingCompleted = await AsyncStorage.getItem('isOnboardingCompleted');
                const storedFirstTime = await AsyncStorage.getItem('isFirstTime');

                // isFirstTime is read regardless of login state — it should
                // only ever be true until the user has seen onboarding once.
                if (storedFirstTime === 'false') {
                    setIsFirstTime(false);
                }

                if (storedUserRole) {
                    setUserRole(storedUserRole);
                }

                if (storedToken && storedUserId) {
                    setToken(storedToken);
                    setUserId(storedUserId);
                } else {
                    setIsLoggedIn(false);
                    setIsAuthLoading(false);
                    return;
                }

                if (storedProfileCompleted === 'true') {
                    setIsProfileCompleted(true);
                }
                if (storedOnboardingCompleted === 'true') {
                    setIsOnboardingCompleted(true);
                }

                const myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${storedToken}`);

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                const requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                    redirect: "follow",
                    signal: controller.signal
                };

                let response;
                try {
                    response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/auth/login/verify`, requestOptions);
                } finally {
                    clearTimeout(timeoutId);
                }

                const resultText = await response.text();

                let resultObj = {};
                try {
                    resultObj = JSON.parse(resultText);
                } catch (e) { }

                if (response.ok && resultObj.success !== false && resultObj.status !== false) {
                    setIsLoggedIn(true);
                    fetchCoachProfile(storedToken, storedUserId);
                } else {
                    // Token was actively rejected by the server (expired/invalid) —
                    // clear it so we don't keep re-verifying a dead token on every
                    // app open.
                    setIsLoggedIn(false);
                    setToken(null);
                    setUserId(null);
                    setUserRole(null);
                    setCoachProfile(null);
                    await AsyncStorage.multiRemove(['userToken', 'userId', 'userRole']);
                }
            } catch (error) {
                // Network/timeout error — we don't know if the token is actually
                // invalid, so don't clear it. Just treat this session as logged
                // out for now; verifySession will retry on next app open.
                console.error("Verify API Error:", error);
                setIsLoggedIn(false);
            } finally {
                setIsAuthLoading(false);
            }
        };

        verifySession();
    }, []);

    const login = async (newToken, newUserId, newRole = null) => {
        if (newToken) {
            setToken(newToken);
            await AsyncStorage.setItem('userToken', newToken);
        }
        if (newUserId !== undefined && newUserId !== null && newUserId !== '') {
            setUserId(newUserId);
            await AsyncStorage.setItem('userId', String(newUserId));
        } else {
            console.warn('AuthContext.login called without a userId — userId state may be stale.');
        }
        if (newRole !== null && newRole !== undefined) {
            const roleStr = typeof newRole === 'string' ? newRole : String(newRole);
            setUserRole(roleStr);
            await AsyncStorage.setItem('userRole', roleStr);
        }
        setIsLoggedIn(true);
        if (newToken && newUserId) {
            fetchCoachProfile(newToken, newUserId);
        }
    };

    const logout = async () => {
        setToken(null);
        setUserId(null);
        setUserRole(null);
        setCoachProfile(null);
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('userRole');
        await AsyncStorage.removeItem('isProfileCompleted');
        await AsyncStorage.removeItem('isOnboardingCompleted');
        setIsLoggedIn(false);
        setIsProfileCompleted(false);
        setIsOnboardingCompleted(false);
    };

    const completeFirstTimeOnboarding = async () => {
        setIsFirstTime(false);
        await AsyncStorage.setItem('isFirstTime', 'false');
    };

    const completeProfile = async () => {
        setIsProfileCompleted(true);
        await AsyncStorage.setItem('isProfileCompleted', 'true');
    };

    const completeOnboarding = async () => {
        setIsOnboardingCompleted(true);
        await AsyncStorage.setItem('isOnboardingCompleted', 'true');
    };

    // Full reset — logs the user out AND clears the stored session token, so
    // a subsequent app restart doesn't silently re-authenticate the old
    // session. Also resets first-time / onboarding / profile flags.
    const resetAll = async () => {
        await AsyncStorage.multiRemove([
            'userToken',
            'userId',
            'userRole',
            'isProfileCompleted',
            'isOnboardingCompleted',
            'isFirstTime',
        ]);
        setToken(null);
        setUserId(null);
        setUserRole(null);
        setCoachProfile(null);
        setIsLoggedIn(false);
        setIsFirstTime(true);
        setIsProfileCompleted(false);
        setIsOnboardingCompleted(false);
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                token,
                userId,
                userRole,
                setUserRole,
                isAuthLoading,
                isFirstTime,
                isProfileCompleted,
                isOnboardingCompleted,
                coachProfile,
                setCoachProfile,
                fetchCoachProfile,
                login,
                logout,
                completeFirstTimeOnboarding,
                completeProfile,
                completeOnboarding,
                resetAll,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}