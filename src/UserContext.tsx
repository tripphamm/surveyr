import { createContext } from 'react';
import { User } from './entities';

export interface UserContext {
  user?: User;
}

export default createContext<UserContext>({
  user: undefined,
});
