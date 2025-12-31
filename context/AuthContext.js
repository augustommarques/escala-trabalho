
import { createContext, useContext } from 'react';

const mockUser = {
  id: 1,
  name: 'Admin Escala',
  email: 'admin@escala.test',
  is_admin: true,
};

const AuthContext = createContext({
  user: mockUser,
  appName: 'Escala',
});

export function AuthProvider({ children }) {
  return (
    <AuthContext.Provider value={{ user: mockUser, appName: 'Escala' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
