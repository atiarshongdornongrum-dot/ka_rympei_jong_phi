// Example gallery data (owner controls this)
const gallery = [
  { 
    id: 1,
    photo: "house1.jpg", 
    description: "Beautiful modern villa with stunning views. Perfect for families."
  },
  { 
    id: 2,
    photo: "house2.jpg", 
    description: "Luxurious contemporary home with premium finishes."
  },
  { 
    id: 3,
    photo: "house3.jpg", 
    description: "Cozy apartment in a prime location. Great investment opportunity."
  },
  { 
    id: 4,
    photo: "house4.jpg", 
    description: "Spacious family home with excellent natural lighting."
  }
];

// Load properties from localStorage
function loadStoredProperties() {
  const stored = localStorage.getItem('properties');
  if (stored) {
    try {
      const storedProps = JSON.parse(stored);
      // Add stored properties to gallery (avoid duplicates)
      storedProps.forEach(prop => {
        if (!gallery.some(p => p.id === prop.id)) {
          gallery.push(prop);
        }
      });
    } catch (e) {
      console.log('Could not load stored properties');
    }
  }
}

// Load stored properties on page load
loadStoredProperties();

// Display gallery
function displayGallery(items) {
  const galleryDiv = document.getElementById("gallery-items");
  galleryDiv.innerHTML = "";
  if (items.length === 0) {
    galleryDiv.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">No properties found matching your criteria.</p>';
    return;
  }
  items.forEach(item => {
    const imageHtml = typeof item.photo === 'string' && item.photo.startsWith('data:') 
      ? `<img src="${item.photo}" alt="Property" style="width: 100%; height: 100%; object-fit: cover;">`
      : '🏠';
    galleryDiv.innerHTML += `
      <div class="gallery-item">
        <div class="property-image">${imageHtml}</div>
        <div class="gallery-item-content">
          <p style="font-size: 0.95em; color: #333; margin: 0;">${item.description}</p>
        </div>
      </div>
    `;
  });
}
displayGallery(gallery);

// Filter function
function applyFilters() {
  const searchText = document.getElementById("filter-place").value.toLowerCase();

  const filtered = gallery.filter(item =>
    !searchText || item.description.toLowerCase().includes(searchText)
  );
  displayGallery(filtered);
}

// Reset filters
function resetFilters() {
  document.getElementById("filter-price").value = "";
  document.getElementById("filter-place").value = "";
  document.getElementById("filter-measurement").value = "";
  displayGallery(gallery);
}

// Booking system (private per customer)
document.getElementById("booking-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("customer-name").value;
  const email = document.getElementById("customer-email").value;
  const phone = document.getElementById("customer-phone").value;
  const date = document.getElementById("booking-date").value;
  const bookingDate = new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  document.getElementById("customer-schedule").innerHTML = `
    <div style="animation: slideInUp 0.5s ease;">
      <p><i class="fas fa-check-circle" style="color: #10b981; margin-right: 8px;"></i><strong>✓ Booking Confirmed!</strong></p>
      <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
      <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
      <p style="margin: 10px 0;"><strong>Phone:</strong> ${phone}</p>
      <p style="margin: 10px 0;"><strong>Visit Date:</strong> ${bookingDate}</p>
      <p style="margin: 10px 0; color: #666; font-size: 0.9em;">Our team will contact you soon to confirm the details and arrange a convenient time.</p>
    </div>
  `;
  this.reset();
});

// ============= ADMIN PANEL PASSWORD =============
const ADMIN_PASSCODE = 'B3o^UF63rtd@%';

function promptAdminPassword() {
  document.getElementById('password-modal').classList.add('open');
  document.getElementById('password-input').value = '';
  document.getElementById('password-error').textContent = '';
  document.getElementById('password-input').focus();
}

function closePasswordModal() {
  document.getElementById('password-modal').classList.remove('open');
  document.getElementById('password-input').value = '';
  document.getElementById('password-error').textContent = '';
}

function verifyPassword(event) {
  event.preventDefault();
  const enteredPassword = document.getElementById('password-input').value;
  
  if (enteredPassword === ADMIN_PASSCODE) {
    closePasswordModal();
    openAdminPanel();
  } else {
    document.getElementById('password-error').textContent = '❌ Incorrect passcode. Try again.';
    document.getElementById('password-input').value = '';
    document.getElementById('password-input').focus();
  }
}

// ============= ADMIN PANEL =============
let adminPhotoBase64 = null;

function openAdminPanel() {
  document.getElementById('admin-modal').classList.add('open');
  loadAdminProperties();
}

function closeAdminPanel() {
  document.getElementById('admin-modal').classList.remove('open');
}

function switchAdminTab(tabName) {
  document.querySelectorAll('.admin-tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.admin-tab-btn').forEach(btn => btn.classList.remove('active'));
  
  document.getElementById(tabName).classList.add('active');
  event.target.closest('.admin-tab-btn').classList.add('active');
  
  if (tabName === 'manage-prop') {
    displayAdminProperties();
  }
}

// File upload handler
document.addEventListener('DOMContentLoaded', function() {
  const photoInput = document.getElementById('admin-photo');
  if (photoInput) {
    photoInput.addEventListener('change', function() {
      const file = this.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
          adminPhotoBase64 = e.target.result;
          const preview = document.getElementById('admin-preview');
          preview.innerHTML = `<img src="${adminPhotoBase64}" alt="Preview" style="max-width: 150px; max-height: 150px; border-radius: 8px;">`;
        };
        reader.readAsDataURL(file);
      }
    });
  }
});

function submitAdminProperty(event) {
  event.preventDefault();
  
  const property = {
    id: Date.now(),
    photo: adminPhotoBase64 || '🏠',
    description: document.getElementById('admin-description').value
  };
  
  // Add to gallery
  gallery.push(property);
  
  // Save to localStorage
  const stored = JSON.parse(localStorage.getItem('admin-properties') || '[]');
  stored.push(property);
  localStorage.setItem('admin-properties', JSON.stringify(stored));
  
  // Reset form
  document.getElementById('admin-form').reset();
  document.getElementById('admin-preview').innerHTML = '';
  adminPhotoBase64 = null;
  
  alert('✅ Property added successfully!');
  displayGallery(gallery);
}

function loadAdminProperties() {
  const stored = localStorage.getItem('admin-properties');
  if (stored) {
    try {
      const props = JSON.parse(stored);
      props.forEach(prop => {
        if (!gallery.some(p => p.id === prop.id)) {
          gallery.push(prop);
        }
      });
    } catch (e) {
      console.log('Could not load stored properties');
    }
  }
}

function displayAdminProperties() {
  const stored = JSON.parse(localStorage.getItem('admin-properties') || '[]');
  const list = document.getElementById('admin-properties-list');
  
  if (stored.length === 0) {
    list.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 20px; color: #999;">No properties added yet</p>';
    return;
  }
  
  list.innerHTML = stored.map(prop => `
    <div class="property-card">
      <div style="width: 100%; height: 120px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; overflow: hidden;">
        ${typeof prop.photo === 'string' && prop.photo.startsWith('data:') 
          ? `<img src="${prop.photo}" alt="Property" style="width: 100%; height: 100%; object-fit: cover;">` 
          : `<span style="font-size: 2em; color: white;">${prop.photo}</span>`}
      </div>
      <div class="property-info">
        <p style="font-size: 0.9em; color: #333; margin: 0;">${prop.description}</p>
      </div>
      <div class="property-actions">
        <button class="edit-btn" onclick="editProperty(${prop.id})"><i class="fas fa-edit"></i> Edit</button>
        <button class="delete-btn" onclick="deleteAdminProperty(${prop.id})"><i class="fas fa-trash"></i> Delete</button>
      </div>
    </div>
  `).join('');
}

function editProperty(id) {
  alert('Edit feature coming soon! Property ID: ' + id);
}

function deleteAdminProperty(id) {
  if (!confirm('Delete this property?')) return;
  
  let stored = JSON.parse(localStorage.getItem('admin-properties') || '[]');
  stored = stored.filter(p => p.id !== id);
  localStorage.setItem('admin-properties', JSON.stringify(stored));
  
  gallery = gallery.filter(p => p.id !== id);
  
  displayAdminProperties();
  displayGallery(gallery);
  alert('✅ Property deleted!');
}

// Load admin properties on page load
loadAdminProperties();