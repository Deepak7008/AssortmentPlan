import React from 'react';
import { View } from 'react-native';
import { GradientCard } from '../ui/GradientCard';
import { NumberField } from './NumberField';

export interface ControlsProps {
    targetOptions: string;
    targetASP: string;
    elasticity: string;
    productivity: string;
    substitution: string;
    onChange: (field: string, value: string) => void;
    baseOptions: number;
    baseASP: number;
}

const CONTROLS = [
    {
        key: 'targetOptions',
        label: 'Target Options',
        hint: 'Number of options the planner wants in the simulated assortment.',
    },
    {
        key: 'targetASP',
        label: 'Target ASP',
        prefix: '$',
        hint: 'Target average selling price for the simulated assortment.',
    },
    {
        key: 'elasticity',
        label: 'Price Elasticity',
        hint: 'Expected percentage change in demand for a percentage change in price (e.g. -1.20).',
    },
    {
        key: 'productivity',
        label: 'New Option Productivity',
        suffix: '%',
        hint: 'Expected productivity of a new option relative to the current class average units per option.',
    },
    {
        key: 'substitution',
        label: 'Substitution Rate',
        suffix: '%',
        hint: 'Percentage of demand from exited options expected to transfer to the remaining assortment.',
    },
] as const;

export const SimulationControls = (props: ControlsProps) => {
    const {
        targetOptions, targetASP, elasticity, productivity, substitution,
        onChange, baseOptions, baseASP,
    } = props;

    const values: Record<string, string> = {
        targetOptions,
        targetASP,
        elasticity,
        productivity,
        substitution,
    };

    return (
        <View className="flex-row flex-wrap -mx-1">
            {CONTROLS.map(control => (
                <View key={control.key} className="w-1/2 md:w-1/5 p-1">
                    <GradientCard className="p-3" style={{ minHeight: 88 }}>
                        <NumberField
                            label={control.label}
                            hint={control.hint}
                            prefix={'prefix' in control ? control.prefix : undefined}
                            suffix={'suffix' in control ? control.suffix : undefined}
                            baseText={
                                control.key === 'targetOptions'
                                    ? `Base: ${baseOptions} options`
                                    : control.key === 'targetASP'
                                        ? `Base: $${baseASP.toFixed(2)}`
                                        : undefined
                            }
                            value={values[control.key]}
                            onChangeText={t => onChange(control.key, t)}
                        />
                    </GradientCard>
                </View>
            ))}
        </View>
    );
};
