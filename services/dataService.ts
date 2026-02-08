
export interface AssortmentItem {
    id: string;
    className: string;
    country: string;
    season: string;
    name: string;
    cost: number;
    sellingPrice: number;
    margin: number;
    marginPercent: string;
    roi: number;
    plannedUnits: number;
    assortedUnits: number;
    status: string;
    lifecycle: string;
    ros: number;
    storeCount: number;
    imageUrl: string;
    region: string;
    material: string;
    fit: string;
    color: string;
    lastYearSales: number;
    lastYearPlan: number;
    lastYearMarginPercent: number;
    lastYearMarginPlan: number;
    lastYearROI: number;
    lastYearROIPlan: number;
    sellThru: number;
    sellThruPlan: number;
    suggested: number;
}

export const fetchAssortmentData = async (): Promise<AssortmentItem[]> => {
    const MOCK_DATA: AssortmentItem[] = [
        {
            id: "1001",
            className: "Shirts",
            country: "USA",
            season: "SS25",
            name: "Oxford Cotton Shirt",
            cost: 15.00,
            sellingPrice: 45.00,
            margin: 30.00,
            marginPercent: "66.67%",
            roi: 3.0,
            plannedUnits: 500,
            assortedUnits: 500,
            status: "Approved",
            lifecycle: "New",
            ros: 2.5,
            storeCount: 140,
            imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
            region: "North",
            material: "Cotton",
            fit: "Regular",
            color: "White",
            lastYearSales: 95000,
            lastYearPlan: 80000,
            lastYearMarginPercent: 45,
            lastYearMarginPlan: 42,
            lastYearROI: 2.5,
            lastYearROIPlan: 2.1,
            sellThru: 88,
            sellThruPlan: 88,
            suggested: 2
        },
        {
            id: "1002",
            className: "Shirts",
            country: "USA",
            season: "SS25",
            name: "Linen Regular Fit",
            cost: 18.00,
            sellingPrice: 55.00,
            margin: 37.00,
            marginPercent: "67.27%",
            roi: 3.05,
            plannedUnits: 450,
            assortedUnits: 0,
            status: "Under Review",
            lifecycle: "Carryover",
            ros: 1.8,
            storeCount: 120,
            imageUrl: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80",
            region: "South",
            material: "Linen",
            fit: "Regular",
            color: "Blue",
            lastYearSales: 72000,
            lastYearPlan: 70000,
            lastYearMarginPercent: 44,
            lastYearMarginPlan: 43,
            lastYearROI: 2.3,
            lastYearROIPlan: 2.2,
            sellThru: 85,
            sellThruPlan: 86,
            suggested: 3
        },
        {
            id: "1003",
            className: "Trousers",
            country: "USA",
            season: "SS25",
            name: "Slim Chino Beige",
            cost: 20.00,
            sellingPrice: 60.00,
            margin: 40.00,
            marginPercent: "66.67%",
            roi: 3.0,
            plannedUnits: 600,
            assortedUnits: 600,
            status: "Approved",
            lifecycle: "New",
            ros: 2.1,
            storeCount: 200,
            imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
            region: "North",
            material: "Cotton Blend",
            fit: "Slim",
            color: "Beige",
            lastYearSales: 110000,
            lastYearPlan: 100000,
            lastYearMarginPercent: 46,
            lastYearMarginPlan: 44,
            lastYearROI: 2.6,
            lastYearROIPlan: 2.4,
            sellThru: 90,
            sellThruPlan: 88,
            suggested: 1
        },
        {
            id: "1004",
            className: "Trousers",
            country: "UK",
            season: "SS25",
            name: "Wool Dress Pant",
            cost: 25.00,
            sellingPrice: 80.00,
            margin: 55.00,
            marginPercent: "68.75%",
            roi: 3.2,
            plannedUnits: 100,
            assortedUnits: 0,
            status: "Dropped",
            lifecycle: "Exit",
            ros: 0.5,
            storeCount: 50,
            imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80",
            region: "East",
            material: "Wool",
            fit: "Classic",
            color: "Navy",
            lastYearSales: 45000,
            lastYearPlan: 50000,
            lastYearMarginPercent: 48,
            lastYearMarginPlan: 50,
            lastYearROI: 2.0,
            lastYearROIPlan: 2.3,
            sellThru: 75,
            sellThruPlan: 82,
            suggested: 0
        },
        {
            id: "1005",
            className: "Jackets",
            country: "USA",
            season: "FW24",
            name: "Denim Jacket Classic",
            cost: 35.00,
            sellingPrice: 90.00,
            margin: 55.00,
            marginPercent: "61.11%",
            roi: 2.57,
            plannedUnits: 300,
            assortedUnits: 300,
            status: "Approved",
            lifecycle: "Carryover",
            ros: 1.2,
            storeCount: 180,
            imageUrl: "https://images.unsplash.com/photo-1551534769-b0de87533df5?auto=format&fit=crop&w=800&q=80",
            region: "North",
            material: "Denim",
            fit: "Regular",
            color: "Blue",
            lastYearSales: 130000,
            lastYearPlan: 110000,
            lastYearMarginPercent: 50,
            lastYearMarginPlan: 48,
            lastYearROI: 2.8,
            lastYearROIPlan: 2.5,
            sellThru: 92,
            sellThruPlan: 90,
            suggested: 2
        },
        {
            id: "1006",
            className: "Shirts",
            country: "UK",
            season: "SS25",
            name: "Floral Print Resort",
            cost: 12.00,
            sellingPrice: 35.00,
            margin: 23.00,
            marginPercent: "65.71%",
            roi: 2.92,
            plannedUnits: 200,
            assortedUnits: 0,
            status: "Under Review",
            lifecycle: "New",
            ros: 3.0,
            storeCount: 80,
            imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
            region: "South",
            material: "Polyester",
            fit: "Relaxed",
            color: "Multi",
            lastYearSales: 55000,
            lastYearPlan: 60000,
            lastYearMarginPercent: 42,
            lastYearMarginPlan: 45,
            lastYearROI: 2.1,
            lastYearROIPlan: 2.4,
            sellThru: 80,
            sellThruPlan: 85,
            suggested: 4
        },
        {
            id: "1007",
            className: "Jackets",
            country: "USA",
            season: "FW24",
            name: "Leather Biker",
            cost: 80.00,
            sellingPrice: 250.00,
            margin: 170.00,
            marginPercent: "68.00%",
            roi: 3.13,
            plannedUnits: 100,
            assortedUnits: 100,
            status: "Approved",
            lifecycle: "New",
            ros: 0.8,
            storeCount: 40,
            imageUrl: "https://images.unsplash.com/photo-1559551409-dadc959f76b8?auto=format&fit=crop&w=800&q=80",
            region: "East",
            material: "Leather",
            fit: "Slim",
            color: "Black",
            lastYearSales: 200000,
            lastYearPlan: 180000,
            lastYearMarginPercent: 52,
            lastYearMarginPlan: 50,
            lastYearROI: 3.0,
            lastYearROIPlan: 2.8,
            sellThru: 95,
            sellThruPlan: 92,
            suggested: 1
        },
        {
            id: "1008",
            className: "Shirts",
            country: "USA",
            season: "SS25",
            name: "Check Flannel",
            cost: 16.00,
            sellingPrice: 40.00,
            margin: 24.00,
            marginPercent: "60.00%",
            roi: 2.5,
            plannedUnits: 500,
            assortedUnits: 0,
            status: "Under Review",
            lifecycle: "Carryover",
            ros: 2.0,
            storeCount: 150,
            imageUrl: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80",
            region: "North",
            material: "Flannel",
            fit: "Regular",
            color: "Red",
            lastYearSales: 85000,
            lastYearPlan: 80000,
            lastYearMarginPercent: 43,
            lastYearMarginPlan: 42,
            lastYearROI: 2.4,
            lastYearROIPlan: 2.3,
            sellThru: 87,
            sellThruPlan: 86,
            suggested: 2
        }
    ];

    return Promise.resolve(MOCK_DATA);
};

export function parseCSV(csvText: string): AssortmentItem[] {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());

    const data: AssortmentItem[] = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        const values: string[] = [];
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
        values.push(currentValue.trim());

        const item: any = {
            id: String(Math.random()),
            name: 'Unknown Item',
            className: 'Uncategorized',
            country: 'Unknown',
            season: 'Season',
            status: 'Draft',
            sellingPrice: 0,
            cost: 0,
            margin: 0,
            marginPercent: '0%',
            roi: 0,
            plannedUnits: 0,
            assortedUnits: 0,
            lifecycle: 'New',
            ros: 0,
            storeCount: 0,
            imageUrl: 'https://placehold.co/400',
            region: 'North',
            material: 'N/A',
            fit: 'Regular',
            color: 'N/A',
            lastYearSales: 0,
            lastYearPlan: 0,
            lastYearMarginPercent: 0,
            lastYearMarginPlan: 0,
            lastYearROI: 0,
            lastYearROIPlan: 0,
            sellThru: 0,
            sellThruPlan: 0,
            suggested: 0
        };
        headers.forEach((header, index) => {
            let value = values[index] || '';
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }

            const numericFields = ['cost', 'sellingPrice', 'margin', 'roi', 'ros', 'lastYearSales', 'lastYearPlan', 'lastYearMarginPercent', 'lastYearMarginPlan', 'lastYearROI', 'lastYearROIPlan', 'sellThru', 'sellThruPlan'];
            const intFields = ['storeCount', 'suggested', 'plannedUnits', 'assortedUnits'];

            if (numericFields.includes(header)) {
                item[header] = parseFloat(value) || 0;
            } else if (intFields.includes(header)) {
                item[header] = parseInt(value) || 0;
            } else {
                item[header] = value;
            }
        });

        data.push(item as AssortmentItem);
    }

    return data;
}
