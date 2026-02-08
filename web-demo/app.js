// Global variables
let ITEMS = [];
let currentFilters = {
    class: 'All',
    season: 'All',
    country: 'All'
};
let itemFilters = {
    class: 'All',
    season: 'All',
    country: 'All'
};

// Toggle collapsible sections
function toggleSection(sectionId) {
    const content = document.getElementById(sectionId);
    const icon = document.getElementById(sectionId + '-icon');

    if (content.style.maxHeight && content.style.maxHeight !== '0px') {
        content.style.maxHeight = '0px';
        icon.style.transform = 'rotate(-90deg)';
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.style.transform = 'rotate(0deg)';
    }
}


// CSV Parser Function - Handles URLs and special characters properly
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());

    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue; // Skip empty lines

        // Parse CSV line properly (handles commas in URLs)
        const values = [];
        let currentValue = '';
        let insideQuotes = false;

        for (let j = 0; j < line.length; j++) {
            const char = line[j];

            if (char === '"') {
                insideQuotes = !insideQuotes;
            } else if (char === ',' && !insideQuotes) {
                values.push(currentValue.trim());
                currentValue = '';
            } else {
                currentValue += char;
            }
        }
        values.push(currentValue.trim()); // Push last value

        const item = {};
        headers.forEach((header, index) => {
            let value = values[index] || '';

            // Remove quotes if present
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }

            // Convert numeric fields
            if (['cost', 'sellingPrice', 'margin', 'roi', 'ros', 'lastYearSales', 'lastYearPlan', 'lastYearMarginPercent', 'lastYearMarginPlan', 'lastYearROI', 'lastYearROIPlan', 'sellThru', 'sellThruPlan'].includes(header)) {
                item[header] = parseFloat(value) || 0;
            } else if (['storeCount', 'suggested'].includes(header)) {
                item[header] = parseInt(value) || 0;
            } else {
                item[header] = value;
            }
        });

        data.push(item);
    }

    return data;
}

// Load CSV Data
async function loadData() {
    try {
        const response = await fetch('data.csv');
        const csvText = await response.text();
        ITEMS = parseCSV(csvText);

        // Initialize the app after data is loaded
        initializeApp();
    } catch (error) {
        console.error('Error loading CSV data:', error);
        alert('Failed to load data.csv. Using empty dataset.');
        ITEMS = [];
        initializeApp();
    }
}

// CSV Upload Handler
function handleCSVUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const csvText = e.target.result;
            ITEMS = parseCSV(csvText);

            // Update the dashboard and items
            updateDashboardStats();
            renderItems();

            alert(`Successfully loaded ${ITEMS.length} items from CSV!`);
        } catch (error) {
            console.error('Error parsing CSV:', error);
            alert('Error parsing CSV file. Please check the format.');
        }
    };
    reader.readAsText(file);
}

// Initialize App
function initializeApp() {
    // CSV Upload
    const uploadTrigger = document.getElementById('upload-trigger');
    const csvUpload = document.getElementById('csv-upload');

    if (uploadTrigger && csvUpload) {
        uploadTrigger.addEventListener('click', () => {
            csvUpload.click();
        });

        csvUpload.addEventListener('change', handleCSVUpload);
    }

    // Bottom Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.currentTarget.dataset.view;

            // Hide all views
            document.getElementById('dashboard-view').style.display = 'none';
            document.getElementById('items-view').style.display = 'none';

            // Show selected view
            if (view === 'dashboard') {
                document.getElementById('dashboard-view').style.display = 'block';
                updateDashboardStats();
            } else if (view === 'items') {
                document.getElementById('items-view').style.display = 'block';
                renderItems();
            }

            // Update active state
            document.querySelectorAll('.nav-btn').forEach(n => n.classList.remove('active'));
            e.currentTarget.classList.add('active');
        });
    });

    // Dashboard Filters
    document.getElementById('filter-class').addEventListener('change', (e) => {
        currentFilters.class = e.target.value;
        updateDashboardStats();
    });

    document.getElementById('filter-season').addEventListener('change', (e) => {
        currentFilters.season = e.target.value;
        updateDashboardStats();
    });

    document.getElementById('filter-country').addEventListener('change', (e) => {
        currentFilters.country = e.target.value;
        updateDashboardStats();
    });

    // Item List Filters
    document.getElementById('item-filter-class').addEventListener('change', (e) => {
        itemFilters.class = e.target.value;
        renderItems();
    });

    document.getElementById('item-filter-season').addEventListener('change', (e) => {
        itemFilters.season = e.target.value;
        renderItems();
    });

    document.getElementById('item-filter-country').addEventListener('change', (e) => {
        itemFilters.country = e.target.value;
        renderItems();
    });

    // Modal Close
    document.getElementById('close-modal').addEventListener('click', () => {
        document.getElementById('item-detail-modal').style.display = 'none';
    });

    // Close modal on background click
    document.getElementById('item-detail-modal').addEventListener('click', (e) => {
        if (e.target.id === 'item-detail-modal') {
            document.getElementById('item-detail-modal').style.display = 'none';
        }
    });

    // Initial render
    updateDashboardStats();
    renderItems();
}

// Filter items based on current filters
function getFilteredItems() {
    return ITEMS.filter(item => {
        const classMatch = currentFilters.class === 'All' || item.className === currentFilters.class;
        const seasonMatch = currentFilters.season === 'All' || item.season === currentFilters.season;
        const countryMatch = currentFilters.country === 'All' || item.country === currentFilters.country;
        return classMatch && seasonMatch && countryMatch;
    });
}

// Filter items for Items tab (separate filters)
function getItemsFiltered() {
    return ITEMS.filter(item => {
        const classMatch = itemFilters.class === 'All' || item.className === itemFilters.class;
        const seasonMatch = itemFilters.season === 'All' || item.season === itemFilters.season;
        const countryMatch = itemFilters.country === 'All' || item.country === itemFilters.country;
        return classMatch && seasonMatch && countryMatch;
    });
}

// Update Dashboard Stats
function updateDashboardStats() {
    const filteredItems = getFilteredItems();
    const assortedItems = filteredItems.filter(i => i.status === 'Approved');

    // Calculate totals - Total Sales = Sum of (Selling Price * ROS)
    const totalSales = assortedItems.reduce((sum, item) => sum + (item.sellingPrice * item.ros), 0);
    const totalMargin = assortedItems.reduce((sum, item) => sum + item.margin, 0);
    const budget = totalSales * 1.47;

    // Update budget
    document.getElementById('total-budget').textContent = `$${(budget / 1000).toFixed(1)}k`;

    // Update Sales Progress (as percentage)
    const salesPercent = budget > 0 ? Math.round((totalSales / budget) * 100) : 0;
    document.getElementById('sales-progress').textContent = `${salesPercent}%`;
    document.getElementById('sales-fill').style.width = `${salesPercent}%`;

    // Update Margin Progress (as percentage) - (Margin * ROS) / (ASP * ROS)
    const totalMarginTimesROS = assortedItems.reduce((sum, item) => sum + (item.margin * item.ros), 0);
    const totalASPTimesROS = assortedItems.reduce((sum, item) => sum + (item.storeCount * item.ros), 0);
    const marginPercent = totalASPTimesROS > 0 ? Math.round((totalMarginTimesROS / totalASPTimesROS) * 100) : 0;
    document.getElementById('margin-progress').textContent = `${marginPercent}%`;
    document.getElementById('margin-fill').style.width = `${marginPercent}%`;

    // Calculate vs LY (Last Year) percentage
    const totalLastYearSalesForVsLY = assortedItems.reduce((sum, item) => sum + (item.lastYearSales || 0), 0);
    const vsLYPercent = totalLastYearSalesForVsLY > 0
        ? Math.round(((totalSales - totalLastYearSalesForVsLY) / totalLastYearSalesForVsLY) * 100)
        : 0;

    // Update vs LY badge
    const vsLYBadge = document.getElementById('vs-ly-badge');
    if (vsLYBadge) {
        vsLYBadge.className = `badge ${vsLYPercent >= 0 ? 'badge-success' : 'badge-danger'}`;
        vsLYBadge.textContent = `${vsLYPercent >= 0 ? '+' : ''}${vsLYPercent}% vs LY`;
    }

    // Update Last Season Performance from CSV data
    const totalLastYearSales = assortedItems.reduce((sum, item) => sum + (item.lastYearSales || 0), 0);
    const totalLastYearPlan = assortedItems.reduce((sum, item) => sum + (item.lastYearPlan || 0), 0);
    const avgLastYearMargin = assortedItems.length > 0
        ? assortedItems.reduce((sum, item) => sum + (item.lastYearMarginPercent || 0), 0) / assortedItems.length
        : 0;
    const avgLastYearMarginPlan = assortedItems.length > 0
        ? assortedItems.reduce((sum, item) => sum + (item.lastYearMarginPlan || 0), 0) / assortedItems.length
        : 0;
    const avgLastYearROI = assortedItems.length > 0
        ? assortedItems.reduce((sum, item) => sum + (item.lastYearROI || 0), 0) / assortedItems.length
        : 0;
    const avgLastYearROIPlan = assortedItems.length > 0
        ? assortedItems.reduce((sum, item) => sum + (item.lastYearROIPlan || 0), 0) / assortedItems.length
        : 0;
    const avgSellThru = assortedItems.length > 0
        ? assortedItems.reduce((sum, item) => sum + (item.sellThru || 0), 0) / assortedItems.length
        : 0;
    const avgSellThruPlan = assortedItems.length > 0
        ? assortedItems.reduce((sum, item) => sum + (item.sellThruPlan || 0), 0) / assortedItems.length
        : 0;

    // Calculate vs Plan percentages
    const salesVsPlan = totalLastYearPlan > 0
        ? Math.round(((totalLastYearSales - totalLastYearPlan) / totalLastYearPlan) * 100)
        : 0;
    const marginVsPlan = avgLastYearMarginPlan > 0
        ? Math.round(avgLastYearMargin - avgLastYearMarginPlan)
        : 0;
    const roiVsPlan = avgLastYearROIPlan > 0
        ? Math.round(((avgLastYearROI - avgLastYearROIPlan) / avgLastYearROIPlan) * 100)
        : 0;
    const sellThruVsPlan = avgSellThruPlan > 0
        ? Math.round(avgSellThru - avgSellThruPlan)
        : 0;

    // Update Last Season values
    document.getElementById('last-sales').textContent = `$${(totalLastYearSales / 1000).toFixed(1)}M`;
    document.getElementById('last-margin').textContent = `${Math.round(avgLastYearMargin)}%`;
    document.getElementById('last-roi').textContent = avgLastYearROI.toFixed(1);

    // Update vs Plan indicators
    const salesChange = document.querySelector('.metric-card:nth-child(1) .metric-change');
    const marginChange = document.querySelector('.metric-card:nth-child(2) .metric-change');
    const roiChange = document.querySelector('.metric-card:nth-child(3) .metric-change');
    const sellThruChange = document.querySelector('.metric-card:nth-child(4) .metric-change');

    if (salesChange) {
        salesChange.className = `metric-change ${salesVsPlan >= 0 ? 'positive' : 'negative'}`;
        salesChange.textContent = `${salesVsPlan >= 0 ? '▲' : '▼'} ${Math.abs(salesVsPlan)}% vs Plan`;
    }
    if (marginChange) {
        marginChange.className = `metric-change ${marginVsPlan >= 0 ? 'positive' : 'negative'}`;
        marginChange.textContent = `${marginVsPlan >= 0 ? '▲' : '▼'} ${Math.abs(marginVsPlan)}% vs Plan`;
    }
    if (roiChange) {
        roiChange.className = `metric-change ${roiVsPlan >= 0 ? 'positive' : 'negative'}`;
        roiChange.textContent = `${roiVsPlan >= 0 ? '▲' : '▼'} ${Math.abs(roiVsPlan)}% vs Plan`;
    }
    if (sellThruChange) {
        const sellThruValue = document.querySelector('.metric-card:nth-child(4) .metric-value');
        if (sellThruValue) sellThruValue.textContent = `${Math.round(avgSellThru)}%`;

        sellThruChange.className = `metric-change ${sellThruVsPlan >= 0 ? 'positive' : sellThruVsPlan === 0 ? 'neutral' : 'negative'}`;
        if (sellThruVsPlan === 0) {
            sellThruChange.textContent = 'Flat';
        } else {
            sellThruChange.textContent = `${sellThruVsPlan >= 0 ? '▲' : '▼'} ${Math.abs(sellThruVsPlan)}% vs Plan`;
        }
    }

    // Update Class Performance
    updateClassPerformance(assortedItems);

    // Update Regional Heatmap
    updateHeatmap(assortedItems);
}

// Calculate and update attribute distribution (top 3 for each attribute)
function updateAttributeDistribution() {
    const filteredItems = getItemsFiltered(); // Use Items tab filters
    const assortedItems = filteredItems.filter(i => i.status === 'Approved');

    if (assortedItems.length === 0) {
        ['material', 'fit', 'color'].forEach(attr => {
            for (let i = 1; i <= 3; i++) {
                const elem = document.getElementById(`${attr}-${i}`);
                if (elem) {
                    elem.querySelector('.attr-name').textContent = '-';
                    elem.querySelector('.attr-percent').textContent = '0%';
                }
            }
        });
        return;
    }

    const calculateTop3 = (attributeName) => {
        const counts = {};
        assortedItems.forEach(item => {
            const value = item[attributeName];
            if (value) counts[value] = (counts[value] || 0) + 1;
        });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([name, count]) => ({
                name,
                percent: Math.round((count / assortedItems.length) * 100)
            }));
    };

    ['material', 'fit', 'color'].forEach(attr => {
        const top3 = calculateTop3(attr);
        top3.forEach((item, index) => {
            const elem = document.getElementById(`${attr}-${index + 1}`);
            if (elem) {
                elem.querySelector('.attr-name').textContent = item.name;
                elem.querySelector('.attr-percent').textContent = `${item.percent}%`;
            }
        });
        for (let i = top3.length + 1; i <= 3; i++) {
            const elem = document.getElementById(`${attr}-${i}`);
            if (elem) {
                elem.querySelector('.attr-name').textContent = '-';
                elem.querySelector('.attr-percent').textContent = '0%';
            }
        }
    });
}

function updateClassPerformance(assortedItems) {
    const classes = ['Shirts', 'Trousers', 'Jackets'];
    const classData = classes.map(className => {
        const classItems = assortedItems.filter(item => item.className === className);
        // Sales = Sum of (Selling Price * ROS)
        const sales = classItems.reduce((sum, item) => sum + (item.sellingPrice * item.ros), 0);
        const avgMargin = classItems.length > 0
            ? Math.round(classItems.reduce((sum, item) => sum + parseFloat(item.marginPercent), 0) / classItems.length)
            : 0;
        const avgROI = classItems.length > 0
            ? (classItems.reduce((sum, item) => sum + item.roi, 0) / classItems.length).toFixed(1)
            : 0;

        return { className, sales, avgMargin, avgROI, count: classItems.length };
    });

    // Update table rows
    const rows = document.querySelectorAll('.class-row');
    classData.forEach((data, index) => {
        if (rows[index]) {
            rows[index].querySelector('.class-sales').textContent = `$${(data.sales / 1000).toFixed(0)}k`;
            rows[index].querySelector('.class-margin').textContent = `${data.avgMargin}%`;
            rows[index].querySelector('.class-roi').textContent = data.avgROI;
            rows[index].style.display = data.count > 0 ? 'grid' : 'none';
        }
    });
}

function updateHeatmap(filteredItems) {
    const regions = ['North', 'South', 'East'];
    const classes = ['Shirts', 'Trousers', 'Jackets'];

    // Calculate all sales values first to find the max (for dynamic scaling)
    const allSalesValues = [];
    regions.forEach(region => {
        classes.forEach(className => {
            const regionClassItems = filteredItems.filter(item =>
                item.region === region && item.className === className
            );
            // Sales = Sum of (Selling Price * ROS) for the region
            const sales = regionClassItems.reduce((sum, item) => sum + (item.sellingPrice * item.ros), 0);
            allSalesValues.push(sales);
        });
    });

    // Dynamic max sales for opacity scaling
    const maxSales = Math.max(...allSalesValues, 1); // Ensure at least 1 to avoid division by zero

    // Get all heatmap cells (skip header row)
    const heatmapRows = document.querySelectorAll('.heatmap-row');

    regions.forEach((region, regionIndex) => {
        const row = heatmapRows[regionIndex + 1]; // +1 to skip header row
        if (!row) return;

        const cells = row.querySelectorAll('.heatmap-cell');

        classes.forEach((className, classIndex) => {
            const cell = cells[classIndex];
            if (!cell) return;

            // Calculate sales for this region-class combination
            const regionClassItems = filteredItems.filter(item =>
                item.region === region && item.className === className
            );
            // Sales = Sum of (Selling Price * ROS) for the region
            const sales = regionClassItems.reduce((sum, item) => sum + (item.sellingPrice * item.ros), 0);

            // Update cell value
            const valueSpan = cell.querySelector('.heatmap-value');
            if (valueSpan) {
                valueSpan.textContent = `$${(sales / 1000).toFixed(0)}k`;
            }

            // Update opacity based on sales (dynamic scaling)
            const opacity = sales > 0 ? Math.min(0.95, Math.max(0.1, sales / maxSales)) : 0.1;
            cell.style.opacity = opacity;
        });
    });
}

// Render Items
function renderItems() {
    const container = document.getElementById('items-container');
    const filteredItems = getItemsFiltered(); // Use separate item filters

    const approvedCount = filteredItems.filter(i => i.status === 'Approved').length;
    const underReviewCount = filteredItems.filter(i => i.status === 'Under Review').length;
    const totalCount = approvedCount + underReviewCount;
    const suggestedCount = filteredItems.reduce((sum, item) => sum + (item.suggested || 0), 0);

    // Update summary with new structure
    const assortedTotal = document.getElementById('assorted-total');
    const assortedCountEl = document.getElementById('assorted-count');
    const underReviewCountEl = document.getElementById('under-review-count');
    const suggestedTotal = document.getElementById('suggested-total');

    if (assortedTotal) assortedTotal.textContent = totalCount;
    if (assortedCountEl) assortedCountEl.textContent = approvedCount;
    if (underReviewCountEl) underReviewCountEl.textContent = underReviewCount;
    if (suggestedTotal) suggestedTotal.textContent = suggestedCount;

    if (filteredItems.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 2rem; color: #64748b;">No items found. Upload a CSV file to get started.</div>';
        return;
    }


    container.innerHTML = filteredItems.map(item => `
        <div class="item-card" data-id="${item.id}">
            <div class="item-image-container">
                <img src="${item.imageUrl}" alt="${item.name}" class="item-image">
                <div class="badge-scrim"></div>
                <div class="status-badge status-${item.status.toLowerCase().replace(' ', '-')}">${item.status}</div>
            </div>
            <div class="item-footer">
                <div class="item-name">${item.name}</div>
                <div class="item-details">
                    <div class="item-meta">${item.className} • ${item.country}</div>
                    <div class="item-price">$${item.sellingPrice.toFixed(0)}</div>
                </div>
            </div>
        </div>
    `).join('');

    // Add click handlers
    document.querySelectorAll('.item-card').forEach(card => {
        card.addEventListener('click', () => {
            const itemId = card.dataset.id;
            showItemDetail(itemId);
        });
    });

    // Update Attribute Distribution
    updateAttributeDistribution();
}

// Show Item Detail
function showItemDetail(itemId) {
    const item = ITEMS.find(i => i.id === itemId);
    if (!item) return;

    const modal = document.getElementById('item-detail-modal');
    const content = document.getElementById('item-detail-content');

    content.innerHTML = `
        <div class="detail-hero">
            <img src="${item.imageUrl}" alt="${item.name}" class="detail-image">
            <div class="detail-overlay">
                <div class="detail-category">${item.className}</div>
                <div class="detail-name">${item.name}</div>
                <div class="detail-sku">SKU: ${item.id} • ${item.country} • ${item.season}</div>
            </div>
        </div>
        
        <div class="detail-body">
            <div class="detail-status">
                <div class="status-icon status-${item.status.toLowerCase()}">
                    ${item.status === 'Assorted' ? '✓' : '○'}
                </div>
                <div>
                    <div class="status-label">ASSORTMENT STATUS</div>
                    <div class="status-value">${item.status} (${item.lifecycle})</div>
                </div>
            </div>
            
            <h3 class="detail-section-title">Economics</h3>
            <div class="detail-metrics">
                <div class="detail-metric">
                    <div class="metric-label">Selling Price</div>
                    <div class="metric-value">$${item.sellingPrice.toFixed(2)}</div>
                </div>
                <div class="detail-metric">
                    <div class="metric-label">Cost</div>
                    <div class="metric-value">$${item.cost.toFixed(2)}</div>
                </div>
                <div class="detail-metric">
                    <div class="metric-label">Margin</div>
                    <div class="metric-value">$${item.margin.toFixed(2)}</div>
                    <div class="metric-sub">${item.marginPercent}</div>
                </div>
                <div class="detail-metric">
                    <div class="metric-label">Rate of Sale</div>
                    <div class="metric-value">${item.ros}</div>
                    <div class="metric-sub">${item.ros > 2 ? 'High Vel' : 'Slow'}</div>
                </div>
            </div>
            
            <div class="detail-stores">
                <div>
                    <div class="stores-label">STORE COUNT</div>
                    <div class="stores-value">${item.storeCount} Stores</div>
                </div>
                <div class="stores-chart">
                    <div class="bar" style="height: 40%"></div>
                    <div class="bar" style="height: 60%"></div>
                    <div class="bar" style="height: 80%"></div>
                    <div class="bar" style="height: 50%"></div>
                </div>
            </div>
    `;

    // Show modal with flex to trigger CSS centering
    modal.style.display = 'flex';

    // Scroll modal itself to top
    setTimeout(() => {
        modal.scrollTop = 0;
    }, 0);

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

// Load data when page loads
loadData();
