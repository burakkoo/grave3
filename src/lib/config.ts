interface Config {
  apiBaseUrl: string;
  // ... other config properties ...
}

const config: Config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://grave-green.vercel.app'
      : 'http://localhost:3000'),
  // ... other config properties ...
};

export default config; 