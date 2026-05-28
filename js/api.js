// API Helper Functions

async function fetchAllTours() {
  try {
    const response = await fetch('/api/tours');
    if (!response.ok) throw new Error('Failed to fetch tours');
    return await response.json();
  } catch (error) {
    console.error('Error fetching tours:', error);
    return [];
  }
}

async function fetchToursByRegion(region) {
  try {
    const response = await fetch(`/api/tours/region/${region}`);
    if (!response.ok) throw new Error('Failed to fetch tours for region');
    return await response.json();
  } catch (error) {
    console.error('Error fetching tours by region:', error);
    return [];
  }
}

async function fetchTourById(id) {
  try {
    const response = await fetch(`/api/tours/${id}`);
    if (!response.ok) throw new Error('Tour not found');
    return await response.json();
  } catch (error) {
    console.error('Error fetching tour:', error);
    return null;
  }
}

// Render tour cards
function renderTourCard(tour) {
  const finalPrice = tour.price - (tour.price * tour.discount / 100);
  return `
    <div class="place-card">
      <div class="place-img">
        <img src="${tour.image}" alt="${tour.name}" loading="lazy" />
        <span class="place-category">${tour.category}</span>
        <span class="place-rating">⭐ ${tour.rating}</span>
      </div>
      <div class="place-body">
        <h3>${tour.name}</h3>
        <p>${tour.description}</p>
        <ul class="place-detail-list">
          <li>📍 ${tour.location}</li>
          <li>🕐 ${tour.duration}</li>
          ${tour.price > 0 ? `<li>💰 ₹${finalPrice.toFixed(0)}${tour.discount > 0 ? ` <span style="text-decoration:line-through;color:#999;">₹${tour.price}</span> <span style="color:#d4862a;font-weight:700;">-${tour.discount}%</span>` : ''}</li>` : '<li>🆓 Free Entry</li>'}
        </ul>
      </div>
    </div>
  `;
}
