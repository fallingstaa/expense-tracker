import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useRequestResetCodeMutation,
  useVerifyResetCodeMutation,
  useResetPasswordMutation,
} from '../redux/feature/auth/authAPI';
import { logout, clearError, initializeAuth } from '../redux/feature/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
  const [forgotPassword] = useForgotPasswordMutation();
  const [requestResetCode] = useRequestResetCodeMutation();
  const [verifyResetCode] = useVerifyResetCodeMutation();
  const [resetPassword] = useResetPasswordMutation();

  const handleLogin = async (credentials) => {
    try {
      const result = await login(credentials).unwrap();
      navigate('/dashboard');
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (userData) => {
    try {
      const result = await register(userData).unwrap();
      navigate('/verify-email', { state: { email: userData.email } });
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleForgotPassword = async (emailData) => {
    try {
      const result = await requestResetCode(emailData).unwrap();
      navigate('/reset-password', { state: { email: emailData.email } });
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleRequestResetCode = async (emailData) => {
    try {
      const result = await requestResetCode(emailData).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleVerifyResetCode = async (codeData) => {
    try {
      const result = await verifyResetCode(codeData).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleResetPassword = async (resetData) => {
    try {
      const result = await resetPassword(resetData).unwrap();
      navigate('/login');
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const handleInitializeAuth = () => {
    dispatch(initializeAuth());
  };

  return {
    // State
    user,
    token,
    isAuthenticated,
    loading,
    error,

    // Actions
    login: handleLogin,
    register: handleRegister,
    forgotPassword: handleForgotPassword,
    requestResetCode: handleRequestResetCode,
    verifyResetCode: handleVerifyResetCode,
    resetPassword: handleResetPassword,
    logout: handleLogout,
    clearError: handleClearError,
    initializeAuth: handleInitializeAuth,
  };
};