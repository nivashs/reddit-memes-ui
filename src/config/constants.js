export const API_URL = import.meta.env.VITE_API_URL;
export const ENDPOINTS = {
    topMemes: `${API_URL}/memes/top`,
    allMemes: (limit, sortBy, order, cursor) => 
      `${API_URL}/memes/allmemes?limit=${limit}&sort_by=${sortBy}&order=${order}${cursor}`,
    sendReport: `${API_URL}/memes/send-report`
  };