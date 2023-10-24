import { visit } from 'unist-util-visit'

const wpm = 200

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('content:file:afterParse', (file) => {
    if (file._id.endsWith('.md') && !file.wordCount) {
      file.wordCount = 0
      visit(file.body, (n: any) => n.type === 'text', (node) => {
        file.wordCount += node.value.trim().split(/\s+/).length
      })
      file.minutes = Math.ceil(file.wordCount / wpm)
    }
  })
})
