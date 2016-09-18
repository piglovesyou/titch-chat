export default ([data, contentHTML]) => {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Titch Chat</title>
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
