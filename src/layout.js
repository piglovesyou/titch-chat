export default ([data, contentHTML]) => {
  return `<!DOCTYPE html>
<html>
  <head>
    <title>${data.title}</title>
    <link rel='stylesheet' href='/stylesheets/main.css' />
    <link rel="icon" href="data:;base64,iVBORw0KGgo=" />
  </head>
  <body>
    <div id="application-container">${contentHTML}</div>
    <script>window.__initialData = ${JSON.stringify(data)};</script>
    <script src="/javascripts/main.js"></script>
  </body>
</html>`;
}
