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

export type DeadlineStatus = 'green' | 'orange' | 'red';

export function getDeadlineStatus(deadline: string, currentDate: Date): DeadlineStatus {
    const deadlineDate = new Date(deadline);
    const diffMs = deadlineDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'red';
    if (diffDays <= 7) return 'orange';
    return 'green';
}

export function parsePlannerCSV(csvText: string): PlannerRow[] {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    return lines.slice(1).map(line => {
        const cols = line.split(',').map(c => c.trim());
        return {
            plannerName: cols[0],
            class: cols[1],
            country: cols[2],
            season: cols[3],
            progress: parseInt(cols[4], 10),
            optionPlanDate: cols[5],
            linePlanDate: cols[6],
            buyPlanDate: cols[7],
            category: cols[8],
            businessLocation: cols[9],
        };
    });
}

const PLANNER_CSV = `Planner Name,Class,Country,Season,Progress,Option Plan Date,Line Plan Date,Buy Plan Date,Category,Business Location
Sarah Martinez,Dress,USA,SS26,75,2026-02-10,2026-02-18,2026-02-28,Apparel,NA`;

export function fetchPlannerData(): PlannerRow[] {
    return parsePlannerCSV(PLANNER_CSV);
}
