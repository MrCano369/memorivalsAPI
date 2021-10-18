const get = (url) => {
  return fetch(url).then((r) => r.text());
};

const post = (url, obj) => {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  }).then((r) => r.json());
};

export { get, post };
