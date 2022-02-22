self.onmessage = function (e) {
  const mjml = e.data;
  mjmlToHtml(mjml);
};

function mjmlToHtml(mjml) {
  fetch("/api/mjml", { method: "POST", body: mjml })
    .then((response) => response.text())
    .then((html) => self.postMessage(html));
}
