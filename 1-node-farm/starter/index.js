const fs = require('fs');
const http = require('http');
const url = require('url');



// Read data from data.json synchronously (or use fs.promises.readFile for async)
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
    return output;
    }

    
const data = fs.readFileSync("./dev-data/data.json", "utf-8");
const dataObj = JSON.parse(data);
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");
// Create an HTTP server
const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW PAGE
if(pathname === "/overview" || pathname === "/") {
   res.writeHead(200, { "Content-type": "text/html" });
     const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join("");
    console.log(cardsHtml)
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
     res.end(output);
  } 
  //PRODUCT PAGE
  else if (pathname === "/product") {
    console.log(query);
    const product = dataObj[query.id];
    res.writeHead(200, { "Content-type": "text/html" });
const out = replaceTemplate(tempProduct,product)
res.end(out);
  } 
  
  //API
  else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } 
  
  //NOT FOUND
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found error 404</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
