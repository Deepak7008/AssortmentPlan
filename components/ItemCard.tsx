import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { AssortmentItem } from '../services/dataService';
import clsx from 'clsx';

interface ItemCardProps {
    item: AssortmentItem;
    onPress: (item: AssortmentItem) => void;
}

const CARD_WIDTH = (Dimensions.get('window').width - 32 - 8) / 3;

export const ItemCard = ({ item, onPress }: ItemCardProps) => {
    const statusColor = item.status === 'Approved'
        ? 'bg-green-500'
        : item.status === 'Under Review'
            ? 'bg-yellow-500'
            : 'bg-slate-500';

    return (
        <TouchableOpacity
            onPress={() => onPress(item)}
            className="bg-slate-900/80 rounded-xl overflow-hidden border border-slate-800/50"
            style={{ width: CARD_WIDTH, marginBottom: 6 }}
            activeOpacity={0.8}
        >
            <View className="relative" style={{ height: 100 }}>
                <Image
                    source={{ uri: item.imageUrl }}
                    className="w-full h-full"
                    resizeMode="cover"
                />
                <View className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-black/40 to-transparent" />
                <View className={clsx(
                    "absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded",
                    statusColor
                )}>
                    <Text className="text-[8px] font-bold text-white">{item.status}</Text>
                </View>
            </View>

            <View className="p-1.5">
                <Text className="text-white text-[10px] font-bold" numberOfLines={1}>
                    {item.name}
                </Text>
                <View className="flex-row justify-between items-baseline mt-0.5">
                    <Text className="text-slate-400 text-[8px]" numberOfLines={1}>
                        {item.className}
                    </Text>
                    <Text className="text-sky-400 text-xs font-bold">
                        ${item.sellingPrice.toFixed(0)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export const ItemGrid = ({ items, onItemPress }: { items: AssortmentItem[], onItemPress: (item: AssortmentItem) => void }) => {
    return (
        <View className="flex-row flex-wrap justify-between px-4">
            {items.map(item => (
                <ItemCard key={item.id} item={item} onPress={onItemPress} />
            ))}
        </View>
    );
};
