// Upload the site-wide og:image (1200x630 JPEG) to the Wix Media Manager via the
// proven seed helpers (generate-upload-url + PUT), then print the wixstatic URL.
import { makeCtx } from "../.agents/skills/wix-headless-kit/templates/blog/seed/seed-blog.mjs";
import { uploadImage } from "../.agents/skills/wix-headless-kit/templates/shared/seed/images.mjs";

const ctx = makeCtx();
const up = await uploadImage(ctx, "C:/Users/amoil/AppData/Local/Temp/opencode/og-default.jpg", "og-default.jpg");
console.log(JSON.stringify(up, null, 2));
