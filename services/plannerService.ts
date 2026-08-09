import Papa from 'papaparse';

export interface PlannerRow {
    plannerName: string;
    class: string;
    country: string;
    season: string;
    progress: number;
    optionPlanDate: string;
    linePlanDate: string;
    buyPlanDate: string;
    category: string;
    businessLocation: string;
}

export type DeadlineStatus = 'green' | 'orange' | 'red' | 'na';

export function normalizePlannerDate(raw: string): string {
    const value = String(raw ?? '').trim();
    if (!value) return '';

    // ISO: 2026-02-10 or 2026-02-10 00:00:00
    const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
        return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
    }

    // Excel serial number (days since 1899-12-30): e.g. 46063
    if (/^\d+(\.\d+)?$/.test(value)) {
        const serial = parseFloat(value);
        if (serial > 0 && serial < 100000) {
            const date = new Date(Math.round((serial - 25569) * 86400 * 1000));
            if (!isNaN(date.getTime())) {
                const y = date.getUTCFullYear();
                const m = String(date.getUTCMonth() + 1).padStart(2, '0');
                const d = String(date.getUTCDate()).padStart(2, '0');
                return `${y}-${m}-${d}`;
            }
        }
        return '';
    }

    // Slash / dash / dot separated: DD/MM/YYYY (preferred), MM/DD/YYYY, DD-MM-YYYY
    const parts = value.split(/[/\-.]/).map(p => p.trim());
    if (parts.length !== 3) return '';

    let a = parseInt(parts[0], 10);
    let b = parseInt(parts[1], 10);
    let c = parseInt(parts[2], 10);
    if (isNaN(a) || isNaN(b) || isNaN(c)) return '';

    let year = c < 100 ? (c > 69 ? 1900 + c : 2000 + c) : c;
    if (year < 1900 || year > 2100) return '';

    let day = a;
    let month = b;
    if (a > 12 && b <= 12) {
        // first token must be the day (DD/MM/YYYY)
        day = a;
        month = b;
    } else if (b > 12 && a <= 12) {
        // second token must be the day (MM/DD/YYYY)
        day = b;
        month = a;
    }
    // both <= 12: ambiguous -> default to DD/MM/YYYY

    if (day < 1 || day > 31 || month < 1 || month > 12) return '';

    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
        return '';
    }

    return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function getDeadlineStatus(deadline: string, currentDate: Date): DeadlineStatus {
    if (!deadline) return 'na';
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) return 'na';

    const diffMs = deadlineDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'red';
    if (diffDays <= 7) return 'orange';
    return 'green';
}

const PLANNER_FIELDS: Record<string, number> = {
    'planner name': 0,
    'class': 1,
    'country': 2,
    'season': 3,
    'progress': 4,
    'option plan date': 5,
    'line plan date': 6,
    'buy plan date': 7,
    'category': 8,
    'business location': 9,
};

export function parsePlannerCSV(csvText: string): PlannerRow[] {
    const parsed = Papa.parse<Record<string, string>>(csvText, { header: true, skipEmptyLines: true });
    const rows = parsed.data;
    if (!rows.length) return [];

    const fields = parsed.meta.fields ?? [];
    const lowerFields = fields.map(f => f.trim().toLowerCase());
    const useHeaderMapping = lowerFields.includes('planner name');

    const getCell = (row: Record<string, string>, name: string, pos: number): string => {
        if (useHeaderMapping) {
            const idx = lowerFields.indexOf(name.toLowerCase());
            return idx >= 0 ? (row[fields[idx]] ?? '').trim() : '';
        }
        return (Object.values(row)[pos] ?? '').trim();
    };

    return rows.map(row => ({
        plannerName: getCell(row, 'Planner Name', PLANNER_FIELDS['planner name']),
        class: getCell(row, 'Class', PLANNER_FIELDS['class']),
        country: getCell(row, 'Country', PLANNER_FIELDS['country']),
        season: getCell(row, 'Season', PLANNER_FIELDS['season']),
        progress: parseInt(getCell(row, 'Progress', PLANNER_FIELDS['progress']), 10) || 0,
        optionPlanDate: normalizePlannerDate(getCell(row, 'Option Plan Date', PLANNER_FIELDS['option plan date'])),
        linePlanDate: normalizePlannerDate(getCell(row, 'Line Plan Date', PLANNER_FIELDS['line plan date'])),
        buyPlanDate: normalizePlannerDate(getCell(row, 'Buy Plan Date', PLANNER_FIELDS['buy plan date'])),
        category: getCell(row, 'Category', PLANNER_FIELDS['category']),
        businessLocation: getCell(row, 'Business Location', PLANNER_FIELDS['business location']),
    }));
}

const PLANNER_CSV = `Planner Name,Class,Country,Season,Progress,Option Plan Date,Line Plan Date,Buy Plan Date,Category,Business Location
Sarah Martinez,Dress,USA,SS26,75,2026-02-10,2026-02-18,2026-02-28,Apparel,NA`;

export function fetchPlannerData(): PlannerRow[] {
    return parsePlannerCSV(PLANNER_CSV);
}
