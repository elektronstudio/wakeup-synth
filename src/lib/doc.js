//@ts-check
import { ref } from "vue";
import { config, replace } from "../lib";

export const fetchDoc = (url) => {
  const fetchUrl = `${replace(config.corsUrl, { url })}?${Math.random()}`;

  return fetch(fetchUrl)
    .then((res) => res.text())
    .then((res) => {
      const dom = new DOMParser().parseFromString(res, "text/html");
      const title = dom.getElementById("title").innerText;
      const content = dom.getElementById("contents").children[1].innerHTML;
      return { title, content };
    });
};

export const useDoc = (url) => {
  const title = ref("");
  const content = ref("");
  fetchDoc(url).then((doc) => {
    console.log(doc);
    title.value = doc.title;
    content.value = doc.content;
  });
  return { title, content };
};
