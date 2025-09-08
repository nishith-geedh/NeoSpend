const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const apiCall = async (path, options = {}, session = null) => {
  const url = `${API_BASE_URL}${path}`;
  
  // Debug logging
  console.log('API Call Debug:', {
    path,
    session: session ? 'present' : 'missing',
    accessToken: session?.accessToken ? 'present' : 'missing',
    idToken: session?.idToken ? 'present' : 'missing'
  });

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add authorization header if session is available
  // Use ID token for API Gateway JWT authorization
  if (session?.idToken) {
    headers.Authorization = `Bearer ${session.idToken}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error calling ${path}:`, error);
    throw error;
  }
};
