// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.body.setAttribute('data-theme', newTheme);
    themeIcon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    localStorage.setItem('campusTheme', newTheme);
});

// Load saved theme
const savedTheme = localStorage.getItem('campusTheme') || 'light';
document.body.setAttribute('data-theme', savedTheme);
themeIcon.className = savedTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';

// Sample Data (Local Storage)
let lostItems = JSON.parse(localStorage.getItem('lostItems')) || [
    {
        id: 1,
        itemName: "Physics Textbook",
        description: "University Physics with Modern Physics, 14th edition. Has my name 'John Smith' on the inside cover.",
        category: "Books",
        location: "Library - 2nd Floor",
        date: new Date().toISOString().split('T')[0],
        contact: "john.smith@uni.edu",
        status: "lost",
        image: ""
    },
    {
        id: 2,
        itemName: "Apple AirPods Pro",
        description: "White AirPods Pro with black case. Case has a small scratch on the bottom.",
        category: "Electronics",
        location: "Computer Lab - Room 304",
        date: new Date().toISOString().split('T')[0],
        contact: "sara.j@uni.edu",
        status: "lost",
        image: ""
    }
];

let foundItems = JSON.parse(localStorage.getItem('foundItems')) || [
    {
        id: 1,
        itemName: "Water Bottle",
        description: "Blue Hydro Flask with university logo sticker. Found near the water fountain.",
        category: "Accessories",
        location: "Science Building - Ground Floor",
        date: new Date().toISOString().split('T')[0],
        contact: "mike.t@uni.edu",
        status: "found",
        image: ""
    },
    {
        id: 2,
        itemName: "Calculator",
        description: "TI-84 Plus graphing calculator. Has math formulas written on the cover.",
        category: "Electronics",
        location: "Math Department",
        date: new Date().toISOString().split('T')[0],
        contact: "admin@math.uni.edu",
        status: "found",
        image: ""
    }
];

// Auto Delete Old Items (3 days)
function checkAndDeleteOldItems() {
    const currentDate = new Date();
    const threeDaysAgo = new Date(currentDate);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    lostItems = lostItems.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= threeDaysAgo;
    });

    foundItems = foundItems.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= threeDaysAgo;
    });

    localStorage.setItem('lostItems', JSON.stringify(lostItems));
    localStorage.setItem('foundItems', JSON.stringify(foundItems));
}

// Calculate remaining time
function getRemainingTime(itemDate) {
    const itemDateTime = new Date(itemDate);
    const deleteTime = new Date(itemDateTime);
    deleteTime.setDate(deleteTime.getDate() + 3);

    const now = new Date();
    const timeDiff = deleteTime - now;

    if (timeDiff <= 0) {
        return "Expired";
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
        return `${days}d ${hours}h`;
    } else {
        return `${hours}h`;
    }
}

// Get timer class based on remaining time
function getTimerClass(remainingTime) {
    if (remainingTime === "Expired") {
        return "danger";
    } else if (remainingTime.includes("h") && !remainingTime.includes("d")) {
        return "warning";
    }
    return "";
}


// Initialize Items
function initializeItems() {
    checkAndDeleteOldItems();
    displayLostItems();
    displayFoundItems();
}

// Category Icons
function getCategoryIcon(category) {
    const icons = {
        'Books': 'fa-book',
        'Electronics': 'fa-laptop',
        'Accessories': 'fa-key',
        'ID Cards': 'fa-id-card',
        'Bags': 'fa-briefcase',
        'Others': 'fa-cube'
    };
    return icons[category] || 'fa-cube';
}

// Format Date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Display Lost Items
function displayLostItems(filterCategory = 'all') {
    const lostItemsGrid = document.getElementById('lostItemsGrid');
    lostItemsGrid.innerHTML = '';

    const filteredItems = filterCategory === 'all'
        ? lostItems
        : lostItems.filter(item => item.category === filterCategory);

    if (filteredItems.length === 0) {
        lostItemsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-color); opacity: 0.7;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px;"></i>
                <h3>No lost items found</h3>
                <p>Be the first to report a lost item!</p>
            </div>
        `;
        return;
    }

    filteredItems.forEach(item => {
        const remainingTime = getRemainingTime(item.date);
        const timerClass = getTimerClass(remainingTime);

        const itemCard = document.createElement('div');
        itemCard.className = 'item-card lost';
        itemCard.innerHTML = `
            <div class="item-image">
                ${item.image ?
                `<img src="${item.image}" alt="${item.itemName}" style="width:100%; height:100%; object-fit:cover;">` :
                `<i class="fas ${getCategoryIcon(item.category)}"></i>`
            }
                <div class="item-status status-lost">LOST</div>
            </div>
            <div class="item-content">
                <span class="item-category">${item.category}</span>
                <h3 class="item-title">${item.itemName}</h3>
                <p class="item-description">${item.description}</p>
                
                <div class="delete-timer ${timerClass}">
                    <i class="fas fa-clock"></i>
                    <span>Auto delete in: <strong>${remainingTime}</strong></span>
                </div>
                
                <div class="item-meta">
                    <div class="item-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${item.location}
                    </div>
                    <span>${formatDate(item.date)}</span>
                </div>
            </div>
        `;
        lostItemsGrid.appendChild(itemCard);
    });
}
// Display Found Items
function displayFoundItems() {
    const foundItemsGrid = document.getElementById('foundItemsGrid');
    foundItemsGrid.innerHTML = '';

    if (foundItems.length === 0) {
        foundItemsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-color); opacity: 0.7;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px;"></i>
                <h3>No found items yet</h3>
                <p>Found something? Report it to help others!</p>
            </div>
        `;
        return;
    }

    foundItems.forEach(item => {
        const remainingTime = getRemainingTime(item.date);
        const timerClass = getTimerClass(remainingTime);

        const itemCard = document.createElement('div');
        itemCard.className = 'item-card found';
        itemCard.innerHTML = `
            <div class="item-image">
                ${item.image ?
                `<img src="${item.image}" alt="${item.itemName}" style="width:100%; height:100%; object-fit:cover;">` :
                `<i class="fas ${getCategoryIcon(item.category)}"></i>`
            }
                <div class="item-status status-found">FOUND</div>
            </div>
            <div class="item-content">
                <span class="item-category">${item.category}</span>
                <h3 class="item-title">${item.itemName}</h3>
                <p class="item-description">${item.description}</p>
                
                <div class="delete-timer ${timerClass}">
                    <i class="fas fa-clock"></i>
                    <span>Auto delete in: <strong>${remainingTime}</strong></span>
                </div>
                
                <div class="item-meta">
                    <div class="item-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${item.location}
                    </div>
                    <span>${formatDate(item.date)}</span>
                </div>
            </div>
        `;
        foundItemsGrid.appendChild(itemCard);
    });
}



// Filter Items
function filterItems(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    displayLostItems(category);
}

// Show/Hide Sections
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.items-section, .form-section').forEach(section => {
        section.classList.add('hidden');
    });

    // Show selected section
    document.getElementById(sectionId).classList.remove('hidden');

    // 👇 YEH NAYA PART ADD KARO
    // Sections change hote hi items refresh karo
    if (sectionId === 'home') {
        setTimeout(() => {
            displayLostItems();
            displayFoundItems();
        }, 50);
    } else if (sectionId === 'lost-items') {
        setTimeout(() => {
            displayLostItems();
        }, 50);
    } else if (sectionId === 'found-items') {
        setTimeout(() => {
            displayFoundItems();
        }, 50);
    }

    // Update navigation
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
    });
}

// Image Preview
function previewImage(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="width:100%; height:100%; object-fit:cover;">`;
        }
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '<i class="fas fa-camera"></i> No image selected';
    }
}

// Report Lost Item
document.getElementById('lostForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const imageInput = document.getElementById('lostImage');
    const imagePreview = document.getElementById('lostImagePreview');

    // Image read karo agar hai toh
    if (imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageData = e.target.result;
            saveLostItem(imageData);
        }
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        saveLostItem('');
    }

    function saveLostItem(imageData) {
        const newItem = {
            id: Date.now(),
            itemName: document.getElementById('lostItemName').value,
            category: document.getElementById('lostCategory').value,
            description: document.getElementById('lostDescription').value,
            location: document.getElementById('lostLocation').value,
            date: document.getElementById('lostDate').value,
            contact: document.getElementById('lostContact').value,
            status: 'lost',
            image: imageData  // 👈 Yahan actual image save hogi
        };

        lostItems.unshift(newItem);
        localStorage.setItem('lostItems', JSON.stringify(lostItems));

        alert('Lost item reported successfully! We hope you find it soon.');
        document.getElementById('lostForm').reset();
        imagePreview.innerHTML = '<i class="fas fa-camera"></i> No image selected';

        displayLostItems();
        showSection('lost-items');
    }
});

// Report Found Item
document.getElementById('foundForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const imageInput = document.getElementById('foundImage');
    const imagePreview = document.getElementById('foundImagePreview');

    // Image read karo agar hai toh
    if (imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageData = e.target.result;
            saveFoundItem(imageData);
        }
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        saveFoundItem('');
    }

    function saveFoundItem(imageData) {
        const newItem = {
            id: Date.now(),
            itemName: document.getElementById('foundItemName').value,
            category: document.getElementById('foundCategory').value,
            description: document.getElementById('foundDescription').value,
            location: document.getElementById('foundLocation').value,
            date: document.getElementById('foundDate').value,
            contact: document.getElementById('foundContact').value,
            status: 'found',
            image: imageData  // 👈 Yahan actual image save hogi
        };

        foundItems.unshift(newItem);
        localStorage.setItem('foundItems', JSON.stringify(foundItems));

        alert('Found item reported successfully! Thank you for helping.');
        document.getElementById('foundForm').reset();
        imagePreview.innerHTML = '<i class="fas fa-camera"></i> No image selected';

        displayFoundItems();
        showSection('found-items');
    }
});

// Navigation click handlers
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const sectionId = this.getAttribute('href').substring(1);

        // Hide all sections
        document.querySelectorAll('.items-section, .form-section').forEach(section => {
            section.classList.add('hidden');
        });

        // Show selected section
        document.getElementById(sectionId).classList.remove('hidden');

        // 👇 FORCE REFRESH ITEMS - DIRECT CALL
        if (sectionId === 'home') {
            displayLostItems();
            displayFoundItems();
        } else if (sectionId === 'lost-items') {
            displayLostItems();
        } else if (sectionId === 'found-items') {
            displayFoundItems();
        }

        // Update navigation
        document.querySelectorAll('.nav-menu a').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});
// Set today's date as default for date inputs
document.getElementById('lostDate').valueAsDate = new Date();
document.getElementById('foundDate').valueAsDate = new Date();

// Initialize on load
document.addEventListener('DOMContentLoaded', function () {
    initializeItems();
});

