/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AboutImport } from './routes/about'
import { Route as AuthenticatedImport } from './routes/_authenticated'
import { Route as IndexImport } from './routes/index'
import { Route as AuthenticatedProfileImport } from './routes/_authenticated/profile'
import { Route as AuthenticatedacademyDashboardImport } from './routes/_authenticated/(academy)/dashboard'
import { Route as AuthenticatedacademyCurriculumImport } from './routes/_authenticated/(academy)/curriculum'

// Create/Update Routes

const AboutRoute = AboutImport.update({
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedRoute = AuthenticatedImport.update({
  id: '/_authenticated',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedProfileRoute = AuthenticatedProfileImport.update({
  path: '/profile',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedacademyDashboardRoute =
  AuthenticatedacademyDashboardImport.update({
    path: '/dashboard',
    getParentRoute: () => AuthenticatedRoute,
  } as any)

const AuthenticatedacademyCurriculumRoute =
  AuthenticatedacademyCurriculumImport.update({
    path: '/curriculum',
    getParentRoute: () => AuthenticatedRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated': {
      id: '/_authenticated'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated/profile': {
      id: '/_authenticated/profile'
      path: '/profile'
      fullPath: '/profile'
      preLoaderRoute: typeof AuthenticatedProfileImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/(academy)/curriculum': {
      id: '/_authenticated/curriculum'
      path: '/curriculum'
      fullPath: '/curriculum'
      preLoaderRoute: typeof AuthenticatedacademyCurriculumImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/(academy)/dashboard': {
      id: '/_authenticated/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof AuthenticatedacademyDashboardImport
      parentRoute: typeof AuthenticatedImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexRoute,
  AuthenticatedRoute: AuthenticatedRoute.addChildren({
    AuthenticatedProfileRoute,
    AuthenticatedacademyCurriculumRoute,
    AuthenticatedacademyDashboardRoute,
  }),
  AboutRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/_authenticated",
        "/about"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/_authenticated": {
      "filePath": "_authenticated.tsx",
      "children": [
        "/_authenticated/profile",
        "/_authenticated/curriculum",
        "/_authenticated/dashboard"
      ]
    },
    "/about": {
      "filePath": "about.tsx"
    },
    "/_authenticated/profile": {
      "filePath": "_authenticated/profile.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/curriculum": {
      "filePath": "_authenticated/(academy)/curriculum.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/dashboard": {
      "filePath": "_authenticated/(academy)/dashboard.tsx",
      "parent": "/_authenticated"
    }
  }
}
ROUTE_MANIFEST_END */
