// Replace with your Airtable API key & base ID
const API_KEY = "keyYOURKEY";
const BASE_ID = "appYOURBASEID";
const TABLE_NAME = "Products";

fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`, {
  headers: { Authorization: `Bearer ${API_KEY}` }
})
.then(res => res.json())
.then(data => {
  const products = data.records;
  let html = "";
  
  products.forEach(product => {
    html += `
      <div class="product">
        <img src="${product.fields.Image_URL}" />
        <h3>${product.fields.Name}</h3>
        <p>$${product.fields.Price}</p>
        <a href="https://paypal.me/yourusername/${product.fields.Price}" class="buy-btn">Buy Now</a>
      </div>
    `;
  });
  
  document.getElementById("products").innerHTML = html;
});