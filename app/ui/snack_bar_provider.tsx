import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { AlertColor } from "@mui/material";

interface SnackbarMessage {
  autoHideDuration: number | undefined;
  key: number;
  message: string;
  severity: AlertColor;
}

interface SnackbarContextType {
  showSnackbar: (
    message: string,
    severity?: AlertColor,
    autoHideDuration?: number
  ) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};

interface SnackbarProviderProps {
  children: ReactNode;
}

interface GradientSnackbarProps {
  message: string;
  severity: AlertColor;
  onClose: () => void;
  autoHideDuration?: number;
}

const GradientSnackbar: React.FC<GradientSnackbarProps> = ({
  message,
  severity,
  onClose,
  autoHideDuration = 3000,
}) => {
  const gradientColors = {
    success: "from-green-400 to-green-600",
    error: "from-red-400 to-red-600",
    warning: "from-yellow-400 to-yellow-600",
    info: "from-blue-400 to-blue-600",
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, autoHideDuration);

    return () => clearTimeout(timer);
  }, [onClose, autoHideDuration]);

  return (
    <div
      className={`fixed right-12  top-20 max-w-xs overflow-hidden rounded-lg bg-gradient-to-r ${gradientColors[severity]} shadow-lg`}
    >
      <div className="px-4 py-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 pt-0.5">
            {severity === "success" && (
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            {severity === "error" && (
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            {severity === "warning" && (
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            )}
            {severity === "info" && (
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>
          <div className="ml-3 flex-1 pt-0.5">
            <p className="text-base font-medium text-white break-words">
              {message}
            </p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              onClick={onClose}
              className="inline-flex text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({
  children,
}) => {
  const [snackbars, setSnackbars] = useState<SnackbarMessage[]>([]);

  const showSnackbar = (
    message: string,
    severity: AlertColor = "info",
    autoHideDuration: number = 3000
  ) => {
    const newSnackbar = {
      key: new Date().getTime(),
      message,
      severity,
      autoHideDuration,
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
        <GradientSnackbar
          key={snackbar.key}
          autoHideDuration={snackbar.autoHideDuration}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => handleClose(snackbar.key)}
        />
      ))}
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
