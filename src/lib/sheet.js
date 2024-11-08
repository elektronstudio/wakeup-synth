import { replace, config } from ".";

//@ts-check
const parseSheet = (data) => {
  const title = data.feed.title.$t;
  const rows = data.feed.entry.map((entry) => {
    return Object.keys(entry)
      .map((field) => {
        if (field.startsWith("gsx$")) {
          return [field.split("$")[1], entry[field].$t];
        }
      })
      .filter((field) => field)
      .reduce((field, item) => {
        field[item[0]] = item[1];
        return field;
      }, {});
  });
  return { title, rows };
};

export const fetchSheet = (sheetUrl) => {
  const sheetId = sheetUrl.match(/[-\w]{25,}/)?.[0];
  const url = `https://spreadsheets.google.com/feeds/list/${sheetId}/od6/public/values?alt=json&${Math.random()}`;
  const fetchUrl = replace(config.corsUrl, { url });

  return fetch(fetchUrl)
    .then((res) => res.json())
    .then((res) => parseSheet(res));
};
