import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

/**
 * Operation types for correlation ID tracking
 */
export const OPERATION_TYPES = {
    SHUFFLE: 'SHUFFLE',
    ANALYSIS: 'ANALYSIS',
    SHARE: 'SHARE',
    DELETE: 'DELETE',
    GENERAL: 'GENERAL'
};

/**
 * Generates a UUID v4
 * Uses crypto.randomUUID() if available, otherwise falls back to uuid package
 */
const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback to uuid package if crypto.randomUUID is not available
    const { v4: uuidv4 } = require('uuid');
    return uuidv4();
};

const CorrelationIdContext = createContext(null);

/**
 * Provider component for correlation ID management
 * Manages correlation IDs per operation type
 */
export const CorrelationIdProvider = ({ children }) => {
    const [correlationIds, setCorrelationIds] = useState({});
    // Use ref to store current IDs for synchronous access
    const correlationIdsRef = useRef({});

    /**
     * Gets or generates a correlation ID for the specified operation type
     * Uses ref for synchronous access and state for React reactivity
     * @param {string} operationType - The operation type (from OPERATION_TYPES)
     * @returns {string} The correlation ID (UUID v4)
     */
    const getCorrelationId = useCallback((operationType) => {
        // Check ref first for synchronous access
        if (correlationIdsRef.current[operationType]) {
            return correlationIdsRef.current[operationType];
        }
        
        // Generate new ID
        const newId = generateUUID();
        
        // Update both ref and state
        correlationIdsRef.current[operationType] = newId;
        setCorrelationIds(prev => ({
            ...prev,
            [operationType]: newId
        }));
        
        return newId;
    }, []);

    /**
     * Resets the correlation ID for a specific operation type
     * @param {string} operationType - The operation type to reset
     */
    const resetCorrelationId = useCallback((operationType) => {
        delete correlationIdsRef.current[operationType];
        setCorrelationIds(prev => {
            const updated = { ...prev };
            delete updated[operationType];
            return updated;
        });
    }, []);

    /**
     * Resets all correlation IDs
     */
    const resetAll = useCallback(() => {
        correlationIdsRef.current = {};
        setCorrelationIds({});
    }, []);

    const value = {
        getCorrelationId,
        resetCorrelationId,
        resetAll,
        correlationIds
    };

    return (
        <CorrelationIdContext.Provider value={value}>
            {children}
        </CorrelationIdContext.Provider>
    );
};

/**
 * Hook to access correlation ID context
 * @returns {Object} Context value with getCorrelationId, resetCorrelationId, resetAll, and correlationIds
 */
export const useCorrelationId = () => {
    const context = useContext(CorrelationIdContext);
    if (!context) {
        throw new Error('useCorrelationId must be used within a CorrelationIdProvider');
    }
    return context;
};
