import axios from 'axios';

/**
 * Module-level store for correlation ID getter function
 * This allows the axios interceptor to access correlation IDs without direct React context access
 */
let correlationIdGetter = null;

/**
 * Sets the correlation ID getter function
 * This should be called from components that have access to the CorrelationIdContext
 * @param {Function} getter - Function that takes operationType and returns correlation ID
 */
export const setCorrelationIdGetter = (getter) => {
    correlationIdGetter = getter;
};

/**
 * Centralized axios instance with request interceptor for X-Correlation-ID header
 * Defaults to withCredentials: true for cookie-based authentication
 */
const apiClient = axios.create({
    withCredentials: true
});

/**
 * Request interceptor that adds X-Correlation-ID header
 * Reads operation type from config.operationType and gets correlation ID from context
 */
apiClient.interceptors.request.use(
    (config) => {
        // Get operation type from config (defaults to GENERAL if not specified)
        const operationType = config.operationType || 'GENERAL';
        
        // Get correlation ID if getter is available
        if (correlationIdGetter) {
            try {
                const correlationId = correlationIdGetter(operationType);
                if (correlationId) {
                    config.headers = config.headers || {};
                    config.headers['X-Correlation-ID'] = correlationId;
                }
            } catch (error) {
                // Silently fail if correlation ID cannot be retrieved
                // This allows the request to proceed without correlation ID
                console.debug('Failed to get correlation ID:', error);
            }
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;

