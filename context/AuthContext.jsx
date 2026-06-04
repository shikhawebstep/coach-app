import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [isFirstTime, setIsFirstTime] = useState(true);
    const [isProfileCompleted, setIsProfileCompleted] = useState(false);
    const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

    useEffect(() => {
        const verifySession = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('userToken');

                console.log('storedToken',storedToken);
                const storedUserId = await AsyncStorage.getItem('userId');
                console.log('storedUserId',storedUserId);
                
                if (storedToken && storedUserId) {
                    setToken(storedToken);
                    setUserId(storedUserId);
                }

                const myHeaders = new Headers();
                if (storedToken) {
                    myHeaders.append("Authorization", `Bearer ${storedToken}`);
                }

                const requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                    redirect: "follow"
                };

                const response = await fetch("https://api.grabbite.com/api/coachpro/auth/login/verify", requestOptions);
                const resultText = await response.text();
                console.log("Verify session result:", resultText);
                
                let resultObj = {};
                try {
                    resultObj = JSON.parse(resultText);
                } catch (e) {}

                if (response.ok && resultObj.success !== false && resultObj.status !== false) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Verify API Error:", error);
                setIsLoggedIn(false);
            } finally {
                setIsAuthLoading(false);
            }
        };

        verifySession();
    }, []);

    const login = async (newToken, newUserId) => {
        if (newToken) {
            setToken(newToken);
            await AsyncStorage.setItem('userToken', newToken);
        }
        if (newUserId !== undefined && newUserId !== null && newUserId !== '') {
            setUserId(newUserId);
            await AsyncStorage.setItem('userId', String(newUserId));
        }
        setIsLoggedIn(true);
    };

    const logout = async () => {
        setToken(null);
        setUserId(null);
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userId');
        setIsLoggedIn(false);
        setIsProfileCompleted(false);
        setIsOnboardingCompleted(false);
    };

    const completeFirstTimeOnboarding = () => {
        setIsFirstTime(false);
    };

    const completeProfile = () => {
        setIsProfileCompleted(true);
    };

    const completeOnboarding = () => {
        setIsOnboardingCompleted(true);
    };

    const resetAll = () => {
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
                isAuthLoading,
                isFirstTime,
                isProfileCompleted,
                isOnboardingCompleted,
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
