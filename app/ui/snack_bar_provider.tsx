import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface SnackbarMessage {
  key: number;
  message: string;
  severity: AlertColor;
}

interface SnackbarContextType {
  showSnackbar: (message: string, severity?: AlertColor) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [snackbars, setSnackbars] = useState<SnackbarMessage[]>([]);

  const showSnackbar = (message: string, severity: AlertColor = 'error') => {
    const newSnackbar = {
      key: new Date().getTime(),
      message,
      severity,
    };
    setSnackbars((prev) => [...prev, newSnackbar]);
  };

  const handleClose = (key: number) => {
    setSnackbars((prev) => prev.filter((snackbar) => snackbar.key !== key));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {snackbars.map((snackbar) => (
        <Snackbar
          key={snackbar.key}
          open={true}
          autoHideDuration={3000}
          onClose={() => handleClose(snackbar.key)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => handleClose(snackbar.key)}
            severity={snackbar.severity}
            sx={{ width: '100%'}}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      ))}
    </SnackbarContext.Provider>
  );
};

