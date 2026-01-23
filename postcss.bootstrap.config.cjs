const prefixer = require("postcss-prefix-selector");
const autoprefixer = require("autoprefixer");

module.exports = {
  plugins: [
    prefixer({
      prefix: ".bs",
      transform(prefix, selector, prefixedSelector) {
        // Replace global selectors so Bootstrap doesn't touch the whole page
        // html -> .bs, body -> .bs, html body -> .bs
        if (selector === "body" || selector.startsWith("body ")) {
          return selector.replace(/^body/, prefix);
        }
        if (selector === "html" || selector.startsWith("html ")) {
          return selector.replace(/^html/, prefix);
        }
        if (selector.startsWith("html body")) {
          return selector.replace(/^html body/, prefix);
        }

        // Keep CSS variables global (optional). If you want FULL isolation, replace :root too.
        if (selector === ":root" || selector.startsWith(":root ")) {
          return selector; // keep vars global
          // return selector.replace(/^:root/, prefix); // full isolation option
        }

        return prefixedSelector;
      },
    }),
    autoprefixer(),
  ],
};
