export interface SimItem {
    name: string;
    units: number;
    cp: number;
    sp: number;
    sellThru: number;
    lySales: number;
}

export interface SimParams {
    targetOptions: number;
    targetASP: number;
    targetCP: number;
    priceElasticity: number;
    newOptionProductivity: number;
    substitutionRate: number;
}

export interface ExitWeights {
    sellThru: number;
    lySales: number;
    margin: number;
}

export interface BaseMetrics {
    options: number;
    units: number;
    sales: number;
    margin: number;
    sellThru: number;
    asp: number;
    avgCp: number;
}

export interface Deltas {
    options: number;
    units: number;
    sales: number;
    margin: number;
    sellThru: number;
    asp: number;
    avgCp: number;
}

export type ItemAction = 'KEEP' | 'EXIT' | 'NEW';

export interface RankedItem {
    item: SimItem;
    marginPercent: number;
    stScore: number;
    lyScore: number;
    marginScore: number;
    stAvg: number;
    lyAvg: number;
    marginAvg: number;
    exitFactor: number;
    rank: number;
    action: ItemAction;
}

export interface CalcStep {
    label: string;
    formula?: string;
    lines: string[];
}

export interface SimulationResult {
    base: BaseMetrics;
    sim: BaseMetrics;
    delta: Deltas;
    ranked: RankedItem[];
    exited: RankedItem[];
    kept: RankedItem[];
    addedOptions: number;
    exitedUnits: number;
    steps: CalcStep[];
    summary: string;
}

// ── Demo data (illustrative mockup assortment) ────────────────────────────

export const DEMO_ITEMS: SimItem[] = [
    { name: 'Item 1', units: 500, cp: 30, sp: 75, sellThru: 92, lySales: 50000 },
    { name: 'Item 2', units: 450, cp: 27, sp: 72, sellThru: 90, lySales: 45000 },
    { name: 'Item 3', units: 480, cp: 29, sp: 78, sellThru: 88, lySales: 52000 },
    { name: 'Item 4', units: 420, cp: 25, sp: 69, sellThru: 86, lySales: 40000 },
    { name: 'Item 5', units: 410, cp: 21, sp: 60, sellThru: 84, lySales: 38000 },
    { name: 'Item 6', units: 390, cp: 22, sp: 66, sellThru: 78, lySales: 30000 },
    { name: 'Item 7', units: 380, cp: 18, sp: 57, sellThru: 76, lySales: 28000 },
    { name: 'Item 8', units: 320, cp: 19, sp: 63, sellThru: 70, lySales: 25000 },
    { name: 'Item 9', units: 310, cp: 16, sp: 60, sellThru: 68, lySales: 22000 },
    { name: 'Item 10', units: 330, cp: 15, sp: 54, sellThru: 65, lySales: 20000 },
];

export const DEFAULT_WEIGHTS: ExitWeights = { sellThru: 40, lySales: 35, margin: 25 };

export const DEFAULT_ELASTICITY = -1.2;
export const DEFAULT_PRODUCTIVITY = 90;
export const DEFAULT_SUBSTITUTION = 30;

// ── Formatting helpers ─────────────────────────────────────────────────────

export const fmtMoney = (v: number): string => {
    const abs = Math.abs(v);
    const sign = v < 0 ? '-' : '';
    if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
    if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}k`;
    return `${sign}$${abs.toFixed(2)}`;
};

export const fmtNum = (v: number): string =>
    v.toLocaleString('en-US', { maximumFractionDigits: 1 });

export const fmtPct = (v: number, digits = 1): string =>
    `${v >= 0 ? '+' : '-'}${Math.abs(v).toFixed(digits)}%`;

export const fmtPp = (v: number): string =>
    `${v >= 0 ? '+' : '-'}${Math.abs(v).toFixed(1)} pp`;

export const fmtFactor = (v: number): string => v.toFixed(3);

// ── Baseline ───────────────────────────────────────────────────────────────

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
const avg = (arr: number[]) => (arr.length > 0 ? sum(arr) / arr.length : 0);

export const marginOf = (item: SimItem): number =>
    item.sp > 0 ? ((item.sp - item.cp) / item.sp) * 100 : 0;

export function buildBaseline(items: SimItem[]): BaseMetrics {
    const options = items.length;
    const units = sum(items.map(i => i.units));
    const asp = units > 0
        ? sum(items.map(i => i.units * i.sp)) / units
        : avg(items.map(i => i.sp));
    const avgCp = units > 0
        ? sum(items.map(i => i.units * i.cp)) / units
        : avg(items.map(i => i.cp));
    const sales = units * asp;
    return {
        options,
        units,
        sales,
        margin: sales - units * avgCp,
        sellThru: avg(items.map(i => i.sellThru)),
        asp,
        avgCp,
    };
}

// ── Weakness scores & exit factor ──────────────────────────────────────────

const scoreOf = (value: number, classAvg: number): number =>
    classAvg > 0 ? 1 - Math.min(value / classAvg, 1) : 0;

export function computeExitFactors(items: SimItem[], weights: ExitWeights): RankedItem[] {
    const classST = avg(items.map(i => i.sellThru));
    const classLY = avg(items.map(i => i.lySales));
    const classMargin = avg(items.map(i => marginOf(i)));

    const ranked = items.map(item => {
        const stScore = Math.max(0, Math.min(1, scoreOf(item.sellThru, classST)));
        const lyScore = Math.max(0, Math.min(1, scoreOf(item.lySales, classLY)));
        const marginScore = Math.max(0, Math.min(1, scoreOf(marginOf(item), classMargin)));
        const exitFactor =
            stScore * (weights.sellThru / 100) +
            lyScore * (weights.lySales / 100) +
            marginScore * (weights.margin / 100);
        return { item, marginPercent: marginOf(item), stScore, lyScore, marginScore, stAvg: classST, lyAvg: classLY, marginAvg: classMargin, exitFactor };
    });

    ranked.sort((a, b) =>
        b.exitFactor - a.exitFactor ||
        b.item.units - a.item.units ||
        a.item.name.localeCompare(b.item.name)
    );

    // Display rank: 1 = strongest (lowest exit factor)
    return ranked.map((entry, index) => ({
        ...entry,
        rank: ranked.length - index,
        action: 'KEEP' as ItemAction,
    }));
}

export function decideActions(ranked: RankedItem[], targetOptions: number): RankedItem[] {
    const maxExits = Math.max(0, ranked.length - targetOptions);
    return ranked.map((entry, index) => ({
        ...entry,
        action: index < maxExits ? 'EXIT' : 'KEEP',
    }));
}

// ── Simulation ──────────────────────────────────────────────────────────────

export function runSimulation(
    items: SimItem[],
    params: SimParams,
    weights: ExitWeights
): SimulationResult {
    const base = buildBaseline(items);
    const ranked = decideActions(computeExitFactors(items, weights), params.targetOptions);
    const exited = ranked.filter(r => r.action === 'EXIT');
    const kept = ranked.filter(r => r.action === 'KEEP');
    const addedOptions = Math.max(0, params.targetOptions - base.options);

    const exitedUnits = sum(exited.map(r => r.item.units));

    // Assortment effect: substitution (reduction) or new-option productivity (increase)
    let unitsBeforePrice = base.units;
    let newUnits = 0;
    let avgPerOption = 0;
    let perNewOption = 0;

    if (params.targetOptions < base.options) {
        const unitsAfterExit = base.units - exitedUnits;
        const substituted = exitedUnits * (params.substitutionRate / 100);
        unitsBeforePrice = unitsAfterExit + substituted;
    } else if (addedOptions > 0 && base.options > 0) {
        avgPerOption = base.units / base.options;
        perNewOption = avgPerOption * (params.newOptionProductivity / 100);
        newUnits = perNewOption * addedOptions;
        unitsBeforePrice = base.units + newUnits;
    }

    // Price effect
    const priceChangePct = base.asp > 0 ? (params.targetASP - base.asp) / base.asp : 0;
    const demandChangePct = params.priceElasticity * priceChangePct;
    const simUnits = Math.max(0, unitsBeforePrice * (1 + demandChangePct));

    const sales = simUnits * params.targetASP;
    const margin = sales - simUnits * params.targetCP;
    const sellThru = simUnits > 0 ? base.sellThru * (base.units / simUnits) : 0;

    const sim: BaseMetrics = {
        options: params.targetOptions,
        units: simUnits,
        sales,
        margin,
        sellThru,
        asp: params.targetASP,
        avgCp: params.targetCP,
    };

    const delta: Deltas = {
        options: sim.options - base.options,
        units: simUnits - base.units,
        sales: sales - base.sales,
        margin: margin - base.margin,
        sellThru: sellThru - base.sellThru,
        asp: params.targetASP - base.asp,
        avgCp: params.targetCP - base.avgCp,
    };

    return {
        base,
        sim,
        delta,
        ranked,
        exited,
        kept,
        addedOptions,
        exitedUnits,
        steps: buildSteps(base, params, { exitedUnits, unitsBeforePrice, addedOptions, newUnits, avgPerOption, perNewOption, priceChangePct, demandChangePct, simUnits, sales, margin, sellThru }),
        summary: buildSummary(base, params, { exitedUnits, newUnits, demandChangePct, avgPerOption, perNewOption }),
    };
}

// ── Calculation steps ───────────────────────────────────────────────────────

interface StepContext {
    exitedUnits: number;
    unitsBeforePrice: number;
    addedOptions: number;
    newUnits: number;
    avgPerOption: number;
    perNewOption: number;
    priceChangePct: number;
    demandChangePct: number;
    simUnits: number;
    sales: number;
    margin: number;
    sellThru: number;
}

function buildSteps(base: BaseMetrics, params: SimParams, ctx: StepContext): CalcStep[] {
    const steps: CalcStep[] = [];
    const reduction = params.targetOptions < base.options;
    const addition = params.targetOptions > base.options;

    steps.push({
        label: 'Base Assortment',
        lines: [
            `${fmtNum(base.options)} options`,
            `${fmtNum(base.units)} units`,
            `${fmtMoney(base.asp)} ASP`,
        ],
    });

    if (reduction) {
        const exits = base.options - params.targetOptions;
        steps.push({
            label: 'Identify Exits',
            lines: [
                `Target Options = ${params.targetOptions}`,
                `Items to Exit = ${base.options} − ${params.targetOptions} = ${exits} items`,
            ],
        });
        steps.push({
            label: 'Remove Exit Demand',
            lines: [
                `Exited Units = ${fmtNum(ctx.exitedUnits)}`,
                `${fmtNum(base.units)} − ${fmtNum(ctx.exitedUnits)} = ${fmtNum(base.units - ctx.exitedUnits)} units`,
            ],
        });
        steps.push({
            label: 'Apply Substitution',
            lines: [
                `${fmtNum(ctx.exitedUnits)} × ${params.substitutionRate}% = ${fmtNum(ctx.exitedUnits * params.substitutionRate / 100)} units recovered`,
                `${fmtNum(base.units - ctx.exitedUnits)} + ${fmtNum(ctx.exitedUnits * params.substitutionRate / 100)} = ${fmtNum(ctx.unitsBeforePrice)} units`,
            ],
        });
    } else if (addition) {
        steps.push({
            label: 'Add New Options',
            lines: [
                `Avg Units / Option = ${fmtNum(base.units)} / ${base.options} = ${fmtNum(ctx.avgPerOption)}`,
                `Units per New Option = ${fmtNum(ctx.avgPerOption)} × ${params.newOptionProductivity}% = ${fmtNum(ctx.perNewOption)}`,
                `New Option Units = ${fmtNum(ctx.perNewOption)} × ${ctx.addedOptions} = ${fmtNum(ctx.newUnits)}`,
                `${fmtNum(base.units)} + ${fmtNum(ctx.newUnits)} = ${fmtNum(ctx.unitsBeforePrice)} units`,
            ],
        });
    }

    if (Math.abs(ctx.priceChangePct) > 0.0001) {
        steps.push({
            label: 'Apply Price Elasticity',
            lines: [
                `Price change = (${fmtMoney(params.targetASP)} − ${fmtMoney(base.asp)}) / ${fmtMoney(base.asp)} = ${fmtPct(ctx.priceChangePct * 100, 2)}`,
                `Demand change = ${params.priceElasticity} × ${fmtPct(ctx.priceChangePct * 100, 2)} = ${fmtPct(ctx.demandChangePct * 100, 2)}`,
            ],
        });
    }

    steps.push({
        label: 'Final Units',
        lines: [
            `${fmtNum(ctx.unitsBeforePrice)} × ${(1 + ctx.demandChangePct).toFixed(4)} ≈ ${fmtNum(ctx.simUnits)} units`,
        ],
    });
    steps.push({
        label: 'Sales',
        lines: [
            `${fmtNum(ctx.simUnits)} × ${fmtMoney(params.targetASP)} ≈ ${fmtMoney(ctx.sales)}`,
        ],
    });
    steps.push({
        label: 'Margin',
        lines: [
            `${fmtMoney(ctx.sales)} − (${fmtNum(ctx.simUnits)} × ${fmtMoney(params.targetCP)}) ≈ ${fmtMoney(ctx.margin)}`,
        ],
    });
    steps.push({
        label: 'Sell Through',
        formula: 'Avg ST × (Base Units ÷ Simulated Units)',
        lines: [
            `${base.sellThru.toFixed(1)}% × (${fmtNum(base.units)} / ${fmtNum(ctx.simUnits)}) ≈ ${ctx.sellThru.toFixed(1)}%`,
        ],
    });

    return steps;
}

// ── Generated summary ───────────────────────────────────────────────────────

interface SummaryContext {
    exitedUnits: number;
    newUnits: number;
    demandChangePct: number;
    avgPerOption: number;
    perNewOption: number;
}

function buildSummary(base: BaseMetrics, params: SimParams, ctx: SummaryContext): string {
    const parts: string[] = [];

    if (params.targetOptions < base.options) {
        parts.push(
            `Reducing the assortment from ${base.options} to ${params.targetOptions} options removes ${fmtNum(ctx.exitedUnits)} units of demand. ` +
            `With a ${params.substitutionRate}% substitution rate, approximately ${fmtNum(ctx.exitedUnits * params.substitutionRate / 100)} units are recovered by the remaining assortment.`
        );
    } else if (params.targetOptions > base.options) {
        parts.push(
            `Expanding the assortment from ${base.options} to ${params.targetOptions} options adds approximately ${fmtNum(ctx.newUnits)} units of demand, ` +
            `based on ${params.newOptionProductivity}% new-option productivity relative to the class average of ${fmtNum(ctx.avgPerOption)} units per option.`
        );
    }

    if (Math.abs(params.targetASP - base.asp) > 0.001) {
        parts.push(
            `The change in ASP from ${fmtMoney(base.asp)} to ${fmtMoney(params.targetASP)} generates an estimated ` +
            `${fmtPct(ctx.demandChangePct * 100)} change in demand based on the ${params.priceElasticity} price elasticity assumption.`
        );
    } else if (params.targetOptions === base.options) {
        parts.push('No change in assortment depth or ASP was simulated.');
    }

    parts.push('The combined effect results in the simulated unit, sales and margin outcome shown above.');
    return parts.join(' ');
}
