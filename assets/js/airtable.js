document.addEventListener('DOMContentLoaded', function() {
  fetch('https://api.airtable.com/v0/YOUR_BASE_ID/Products', {
    headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
  })
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('products-container');
    data.records.forEach(item => {
      container.innerHTML += `
        <div class="product">
          <img src="${item.fields.Image}" alt="${item.fields.Name}">
          <h3>${item.fields.Name}</h3>
          <p>$${item.fields.Price}</p>
          <a href="${item.fields.Link}" class="button">Buy Now</a>
        </div>
      `;
    });
  });
});