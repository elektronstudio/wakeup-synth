import "@justinribeiro/lite-youtube";
import marked from "marked";

export const replaceYoutube = (str = "") => {
  const pattern =
    /\s*[a-zA-Z\/\/:\.]*youtu(?:be.com\/watch\?v=|.be\/)([a-zA-Z0-9\-_]+)(?:[a-zA-Z0-9\/\*\-\_\?\&\;\%\=\.]*)/gim;
  return str.replace(pattern, `\n\n<lite-youtube videoid="$1" />\n\n`);
};

export const formatMarkdown = (text = "") =>
  marked(replaceYoutube(text), {
    breaks: true,
  });
