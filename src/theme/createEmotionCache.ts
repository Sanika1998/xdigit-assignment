// Separate LTR/RTL Emotion caches. The different `key`s keep their class names
// and <style> tags in distinct namespaces so they don't clash on language switch.
import createCache from '@emotion/cache'
import rtlPlugin from '@mui/stylis-plugin-rtl'
// Must be the same stylis major/minor as @emotion/cache (4.2.x), not a separate 4.4 bundle.
import { prefixer } from 'stylis'

// Custom stylisPlugins replace Emotion's defaults, so we keep the prefixer and add RTL.
const rtlStylisPlugins = [prefixer, rtlPlugin] as const

export const emotionCacheLtr = createCache({ key: 'mui' })

export const emotionCacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [...rtlStylisPlugins],
})
