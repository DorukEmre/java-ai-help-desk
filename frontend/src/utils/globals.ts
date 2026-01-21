function getBaseUrl() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("VITE_API_BASE_URL is not defined");
  }

  return baseUrl;
}

// Base URL for images
const imageBaseUrl = getBaseUrl() + "/images/";

// Add base URL to given path (for api requests)
function addBaseUrl(path: string): string {
  const baseURL = getBaseUrl();

  return `${baseURL}${path}`;
}


export { getBaseUrl, imageBaseUrl, addBaseUrl };