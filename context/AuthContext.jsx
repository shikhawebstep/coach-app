import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isFirstTime, setIsFirstTime] = useState(true);
    const [isProfileCompleted, setIsProfileCompleted] = useState(false);
    const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

    const login = () => {
        setIsLoggedIn(true);
    };

    const logout = () => {
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
