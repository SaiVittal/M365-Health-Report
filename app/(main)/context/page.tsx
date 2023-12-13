import React, { createContext, useState, useContext, ReactNode } from 'react';

interface TenantContextProps {
    myselectedTenantName: string | null;
    myselectedTenantId: string | null;
    setSelectedTenantNameAv: React.Dispatch<React.SetStateAction<string | null>>;
    setSelectedTenantIdAv: React.Dispatch<React.SetStateAction<string | null>>;
}

const TenantContext = createContext<TenantContextProps | undefined>(undefined);

interface TenantProviderProps {
    children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
    const [myselectedTenantName, setSelectedTenantNameAv] = useState<string | null>(null);
    const [myselectedTenantId, setSelectedTenantIdAv] = useState<string | null>(null);

    return <TenantContext.Provider value={{ myselectedTenantName, myselectedTenantId, setSelectedTenantNameAv, setSelectedTenantIdAv }}>{children}</TenantContext.Provider>;
};

export const useTenantContext = () => {
    const context = useContext(TenantContext);
    if (!context) {
        throw new Error('useTenantContext must be used within a TenantProvider');
    }
    return context;
};
