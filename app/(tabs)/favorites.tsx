import { View, Text } from 'react-native';
import React from 'react';

export default function FavoritesScreen() {
    return (
        <View style={{ flex: 1, backgroundColor: '#020617', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#38bdf8', fontSize: 24, fontWeight: 'bold' }}>Saved Modules</Text>
            <Text style={{ color: '#94a3b8', marginTop: 8 }}>This feature is coming soon.</Text>
        </View>
    );
}
