/* eslint-disable react-refresh/only-export-components -- Bu dosya bilinçli olarak rota yapılandırmasıdır. */
import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
// ErrorPage hata sınırı tarafından da kullanıldığı için statik kalır;
// dinamik import etmek onu ayrı bir chunk'a taşımaz, yalnızca uyarı üretir.
import ErrorPage from '@/pages/ErrorPage'

// Yasal sayfalar ve 404 ilk açılışta gerekmez → ayrı chunk.
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'))
const CookiePage = lazy(() => import('@/pages/CookiePage'))
const KvkkPage = lazy(() => import('@/pages/KvkkPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

export const routes: RouteObject[] = [
  { index: true, element: <HomePage /> },
  { path: 'gizlilik-politikasi', element: <PrivacyPage /> },
  { path: 'cerez-politikasi', element: <CookiePage /> },
  { path: 'kvkk-aydinlatma-metni', element: <KvkkPage /> },
  { path: '500', element: <ErrorPage /> },
  { path: '*', element: <NotFoundPage /> },
]
