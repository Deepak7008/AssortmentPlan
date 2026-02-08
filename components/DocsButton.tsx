import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export const DocsButton = () => {
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() => router.push('/docs')}
            className="flex-row items-center bg-slate-800/80 w-9 h-9 justify-center rounded-lg border border-slate-700 mr-2"
        >
            <Ionicons name="help-circle-outline" size={20} color="#94a3b8" />
        </TouchableOpacity>
    );
};
