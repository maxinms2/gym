// Detectar entorno:
// - En Docker: usa process.env.API_URL (http://host.docker.internal:3000)
// - En Expo Go (celular): detecta automáticamente la IP
import Constants from 'expo-constants';

const getApiUrl = () => {
  // Si está en Docker, usa la variable de entorno
  if (process.env.API_URL) {
    return process.env.API_URL;
  }
  
  // Para Expo Go: detecta automáticamente la IP desde Expo
  const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
  if (debuggerHost) {
    const host = debuggerHost.split(':')[0];
    return `http://${host}:3000`;
  }
  
  return "http://localhost:3000";
};

export const BASE_URL = getApiUrl();
