import { QuartzEmitterPlugin } from "@quartz-community/types"
import { write, FullSlug } from "@quartz-community/utils"

export interface RandomNoteOptions {
  targetSlug?: FullSlug
}

export const RandomNote: QuartzEmitterPlugin<RandomNoteOptions> = (opts) => {
  const targetSlug = (opts?.targetSlug ?? "random") as FullSlug

  return {
    name: "RandomNote",

    getQuartzComponents() {
      return []
    },

    async emit(ctx, _content, _resources) {
      const availableSlugs = ctx.allSlugs.filter((slug) => slug !== targetSlug)

      if (availableSlugs.length === 0) {
        return []
      }

      const slugsJson = JSON.stringify(availableSlugs)

      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Redirecting...</title>
  <script>
    const slugs = ${slugsJson};
    if (slugs.length > 0) {
      const randomSlug = slugs[Math.floor(Math.random() * slugs.length)];
      window.location.href = "/" + randomSlug;
    }
  </script>
</head>
<body>
  <p>Redirecting to a random note... <a href="/">Click here if not redirected</a>.</p>
</body>
</html>`

      const fp = await write({
        ctx,
        slug: targetSlug,
        ext: ".html",
        content: htmlContent,
      })

      return [fp]
    },
  }
}
