//@ts-check
import { ref } from "vue";

import { config, fetchDoc, fetchSheet, replaceYoutube } from "../lib";

export const pages = ref([]);

export const loadPages = () => {
  fetchSheet(config.pagesUrl).then(({ rows }) => {
    const publicRows = rows.filter((row) => row.hidden !== "TRUE");
    pages.value = publicRows;
    // We fetch each Google doc and add them to content collection
    // Docs do not have to arrive in the same time so we do not
    // neet to use Promise.all()
    publicRows
      .filter((row) => row.publicurl)
      .forEach((row, i) => {
        fetchDoc(row.publicurl).then(
          (res) =>
            (pages.value[i].content = replaceYoutube(
              res.content.replace(/style="[^"]*"/g, "")
            ))
        );
      });
  });
};
