import config from './config';

export async function fetchApi(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = path.startsWith('http') 
    ? path 
    : `${config.apiBaseUrl}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response;
} 