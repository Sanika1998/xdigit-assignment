import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type LinksFunction,
} from 'react-router'
import { LocaleProvider } from '~/context/LocaleContext'
import { LOCALE_STORAGE_KEY } from '~/utils/locale.shared'
import '~/App.css'
import '~/i18n'
import '~/index.css'

export const links: LinksFunction = () => [
  { rel: 'icon', type: 'image/svg+xml', href: '/portal-favicon.svg' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600&display=swap',
  },
]

const localeBootstrapScript = `(function(){try{var l=localStorage.getItem(${JSON.stringify(LOCALE_STORAGE_KEY)});if(l==='ar'){document.documentElement.setAttribute('dir','rtl');document.documentElement.setAttribute('lang','ar');}}catch(e){}})();`

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Application Form</title>
        <script dangerouslySetInnerHTML={{ __html: localeBootstrapScript }} />
        <Meta />
        <Links />
      </head>
      <body>
        <LocaleProvider>{children}</LocaleProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function Root() {
  return <Outlet />
}
