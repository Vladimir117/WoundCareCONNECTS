import { Navigate, useRoutes } from 'react-router-dom'

// Layouts
import MainLayout from 'src/layouts/main';

import { HomePage } from './main';
import { authRoutes } from './auth'
import { userRoutes } from './user';
import { agencyRoutes } from './agency';
import Page404 from 'src/pages/404.js';

export default function Router() {
    return useRoutes([
        // Set Index Page With Home Page
        {
            path: '/home',
            element: (
                <MainLayout>
                    <HomePage />
                </MainLayout>
            ),
        },

        // Auth routes
        ...authRoutes,

        // User routes
        ...userRoutes,

         // Agency routes
         ...agencyRoutes,

        {
            path: '*',
            element: <Navigate to="/404" />
        },
        { path: '404', element: <Page404 /> },
    ]);
}