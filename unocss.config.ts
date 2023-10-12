import type { Preset, SourceCodeTransformer } from 'unocss'
import { defineConfig } from 'unocss'

import {
    presetApplet,
    presetRemRpx,
    transformerApplet,
    transformerAttributify,
} from 'unocss-applet'

// taro
const isApplet = process.env.TARO_ENV !== 'h5' ?? false
const presets: Preset[] = []
const transformers: SourceCodeTransformer[] = []

if (isApplet) {
    presets.push(presetApplet())
    presets.push(presetRemRpx())
    transformers.push(transformerAttributify({ ignoreAttributes: ['block'] }))
    transformers.push(transformerApplet())
}
else {
    presets.push(presetApplet())
    // presets.push(presetAttributify())
    presets.push(presetRemRpx({ mode: 'rpx2rem' }))
}

export default defineConfig({
    presets: [
        // ...
        ...presets,
    ],
    transformers: [
        // ...
        ...transformers,
    ],
})
