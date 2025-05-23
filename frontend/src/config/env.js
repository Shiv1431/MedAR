// Environment variables configuration
const env = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:8000/api',
  
  // Frontend Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'MedAR',
  APP_URL: import.meta.env.VITE_APP_URL?.replace(/\/$/, '') || 'http://localhost:5173',
  
  // Feature Flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_LOGGING: import.meta.env.VITE_ENABLE_LOGGING !== 'false',
};

// Validate required environment variables
const requiredEnvVars = ['VITE_API_BASE_URL'];
const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !import.meta.env[envVar]
);

if (missingEnvVars.length > 0) {
  console.error(
    'Missing required environment variables:',
    missingEnvVars.join(', ')
  );
}

// Log the API URL in development
if (import.meta.env.DEV) {
  console.log('API URL:', env.API_BASE_URL);
}

export default env; 