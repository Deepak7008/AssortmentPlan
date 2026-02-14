
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
            className: "Dress",
            country: "USA",
            season: "SS26",
            name: "Floral Midi Dress",
            cost: 22.00,
            sellingPrice: 68.00,
            margin: 46.00,
            marginPercent: "67.65%",
            roi: 3.09,
            plannedUnits: 500,
            assortedUnits: 500,
            status: "Approved",
            lifecycle: "New",
            ros: 2.5,
            storeCount: 140,
            imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
            region: "North",
            material: "Cotton",
            fit: "Regular",
            color: "Floral",
            lastYearSales: 95000,
            lastYearPlan: 80000,
            lastYearMarginPercent: 45,
            lastYearMarginPlan: 42,
            lastYearROI: 2.5,
            lastYearROIPlan: 2.1,
            sellThru: 88,
            sellThruPlan: 88,
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
