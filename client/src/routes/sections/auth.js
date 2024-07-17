import { lazy, Suspense } from 'react';

// Layouts
import AuthLayout from 'src/layouts/auth';

// Components
import { SplashScreen } from 'src/components/loading-screen';

// Pages
const Login = lazy(() => import('src/pages/auth/login'));
const Register = lazy(() => import('src/pages/auth/register'));
const ForgotPassword = lazy(() => import('src/pages/auth/forgot-password'));
const ResetPassword = lazy(() => import('src/pages/auth/reset-password'));

const LazyComponent = (Component) => (
    <Suspense fallback={<SplashScreen />}>
        <AuthLayout>
            <Component />
        </AuthLayout>
    </Suspense>
);
export const authRoutes = [
    {
        path: '/login',
        element: LazyComponent(Login),
    },
    {
        path: '/register',
        element: LazyComponent(Register),
    },
    {
        path: '/forgot-password',
        element: LazyComponent(ForgotPassword),
    },
    {
        path: '/reset-password',
        element: LazyComponent(ResetPassword),
    },
];

