import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

// Safely converts a role value to a usable string.
// Never allows an object to be stringified into "[object Object]".
const safeRoleString = (value) => {
    if (typeof value === 'string') {
        if (value === '[object Object]') return '';
        return value;
    }
    if (value && typeof value === 'object') {
        return value.role || value.name || '';
    }
    return '';
};

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
        if (!currentToken || !currentUserId) {
            console.log("🔍 [AuthContext] fetchCoachProfile skipped — missing token or userId");
            return;
        }
        try {
            console.log("🔍 [AuthContext] Fetching coach profile for userId:", currentUserId);
            const myHeaders = new Headers();
            myHeaders.append('Authorization', `Bearer ${currentToken}`);
            const baseUrl = (process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.grabbite.com/').replace(/\/$/, '');
            const response = await fetch(`${baseUrl}/api/coachpro/account-profile/${currentUserId}`, {
                method: 'GET',
                headers: myHeaders,
            });
            const result = await response.json();
            console.log("🔍 [AuthContext] Profile API response status:", result?.status);
            if (result.status && result.data) {
                const d = result.data;
                setCoachProfile(d);

                const roleVal = d.role || d.admin?.role || d.user?.role || d.coach?.role;
                console.log("🔍 [AuthContext] Role found in profile API:", roleVal);
                if (roleVal) {
                    const roleStr = safeRoleString(roleVal);
                    if (roleStr) {
                        setUserRole(roleStr);
                        await AsyncStorage.setItem('userRole', roleStr);
                    }
                }

                const contractDone = d.contract?.status === "signed" || !!d.contract?.signedAt;
                const qualValues = d.qualifications && typeof d.qualifications === 'object' ? Object.values(d.qualifications) : [];
                const isValueFilled = (val) => {
                    if (val === null || val === undefined || val === '') return false;
                    if (Array.isArray(val)) return val.length > 0;
                    if (typeof val === 'object') return Object.keys(val).length > 0;
                    return true;
                };
                const qualificationsDone = qualValues.some(isValueFilled);
                const uniformDone = d.uniformPurchaseStatus === "completed";
                const trainingDone = d.onboardingCourseResult?.status === "pass" || d.onboardingCourseResult?.status === "completed";

                console.log("🔍 [AuthContext] Onboarding Task Status Breakdown:", {
                    contractDone,
                    qualificationsDone,
                    uniformDone,
                    trainingDone,
                });

                const allDone = contractDone && qualificationsDone && uniformDone && trainingDone;
                console.log("🔍 [AuthContext] All Onboarding Tasks Done?:", allDone);

                if (allDone) {
                    setIsOnboardingCompleted(true);
                    await AsyncStorage.setItem('isOnboardingCompleted', 'true');
                } else {
                    setIsOnboardingCompleted(false);
                    await AsyncStorage.removeItem('isOnboardingCompleted');
                }
            } else {
                console.warn("⚠️ [AuthContext] Profile API response status false or no data:", result);
            }
        } catch (err) {
            console.error("💥 [AuthContext] fetchCoachProfile error:", err);
        }
    };

    useEffect(() => {
        const verifySession = async () => {
            console.log("🚀 [AuthContext] verifySession started");
            try {
                const storedToken = await AsyncStorage.getItem('userToken');
                const storedUserId = await AsyncStorage.getItem('userId');
                let storedUserRole = await AsyncStorage.getItem('userRole');
                const storedProfileCompleted = await AsyncStorage.getItem('isProfileCompleted');
                const storedOnboardingCompleted = await AsyncStorage.getItem('isOnboardingCompleted');
                const storedFirstTime = await AsyncStorage.getItem('isFirstTime');

                console.log("🔍 [AuthContext] Stored Session Values:", {
                    storedToken: storedToken ? `${storedToken.substring(0, 10)}...` : null,
                    storedUserId,
                    storedUserRole,
                    storedProfileCompleted,
                    storedOnboardingCompleted,
                    storedFirstTime
                });

                // Purge previously-corrupted role value if present
                if (storedUserRole === '[object Object]') {
                    console.warn("⚠️ [AuthContext] Corrupted stored userRole detected — purging");
                    await AsyncStorage.removeItem('userRole');
                    storedUserRole = null;
                }

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
                    console.log("ℹ️ [AuthContext] No stored session found — user is logged out");
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

                console.log("🔍 [AuthContext] Verify token response ok:", response.ok, resultObj);

                if (response.ok && resultObj.success !== false && resultObj.status !== false) {
                    setIsLoggedIn(true);
                    await fetchCoachProfile(storedToken, storedUserId);
                } else {
                    console.warn("⚠️ [AuthContext] Token rejected by server — logging out");
                    setIsLoggedIn(false);
                    setToken(null);
                    setUserId(null);
                    setUserRole(null);
                    setCoachProfile(null);
                    await AsyncStorage.multiRemove(['userToken', 'userId', 'userRole', 'isOnboardingCompleted']);
                }
            } catch (error) {
                console.error("💥 [AuthContext] Verify API Error:", error);
                setIsLoggedIn(false);
            } finally {
                setIsAuthLoading(false);
                console.log("✅ [AuthContext] verifySession finished");
            }
        };

        verifySession();
    }, []);

    const login = async (newToken, newUserId, newRole = null) => {
        console.log("🔑 [AuthContext] login() called with:", { newUserId, newRole });
        if (newToken) {
            setToken(newToken);
            await AsyncStorage.setItem('userToken', newToken);
        }
        if (newUserId !== undefined && newUserId !== null && newUserId !== '') {
            setUserId(newUserId);
            await AsyncStorage.setItem('userId', String(newUserId));
        } else {
            console.warn('⚠️ [AuthContext] login called without a userId');
        }
        if (newRole !== null && newRole !== undefined) {
            const roleStr = safeRoleString(newRole);
            if (roleStr) {
                setUserRole(roleStr);
                await AsyncStorage.setItem('userRole', roleStr);
            } else {
                console.warn('⚠️ [AuthContext] login received an unusable role value:', newRole);
            }
        }
        if (newToken && newUserId) {
            await fetchCoachProfile(newToken, newUserId);
        }
        setIsLoggedIn(true);
        console.log("✅ [AuthContext] login() completed state update");
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