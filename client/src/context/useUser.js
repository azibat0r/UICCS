import { useContext } from 'react';
import { UserContext } from './UserContextObject.js';

export function useUser() {
  return useContext(UserContext);
}