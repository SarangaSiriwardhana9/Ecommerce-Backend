let BASE_URL = 'http://localhost:3000/api';

export function setBaseUrl(url: string) {
  BASE_URL = url.replace(/\/$/, '');
}

export function getBaseUrl() {
  return BASE_URL;
}


