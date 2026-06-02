import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

export default [
  index('./routes/_index.tsx'),
  layout('./routes/application-layout.tsx', [
    route('application/success', './routes/application.success.tsx'),
    route('application/:step', './routes/application.$step.tsx'),
  ]),
] satisfies RouteConfig
