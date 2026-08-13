import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { AssortmentItem } from '../services/dataService';
import clsx from 'clsx';

interface ItemCardProps {
    item: AssortmentItem;
    onPress: (item: AssortmentItem) => void;
}

const getColumns = (width: number) => {
    if (width >= 1280) return 5;
    if (width >= 768) return 4;
    return 2;
};

export const ItemCard = ({ item, onPress }: ItemCardProps) => {
    const { width } = useWindowDimensions();
    const columns = getColumns(width);
    const CARD_WIDTH = (width - 32 - (columns - 1) * 8) / columns;
    const [imageFailed, setImageFailed] = useState(false);

    const imageSource = imageFailed
        ? { uri: `https://picsum.photos/seed/${encodeURIComponent(item.id)}/400/500` }
        : { uri: item.imageUrl };

    const statusColor = item.status === 'Approved'
        ? 'bg-green-500'
        : item.status === 'Under Review'
            ? 'bg-yellow-500'
            : 'bg-stone-500';

    return (
        <TouchableOpacity
            onPress={() => onPress(item)}
            className="bg-white dark:bg-stone-800 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700"
            style={{ width: CARD_WIDTH, marginBottom: 10 }}
            activeOpacity={0.8}
        >
            <View className="relative" style={{ height: 140 }}>
                <Image
                    source={imageSource}
                    className="w-full h-full"
                    resizeMode="cover"
                    onError={() => setImageFailed(true)}
                />
                <View className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-black/40 to-transparent" />
                <View className={clsx(
                    "absolute top-2 left-2 px-2 py-0.5 rounded",
                    statusColor
                )}>
                    <Text className="text-[9px] font-sans-bold text-white">{item.status}</Text>
                </View>
            </View>

            <View className="p-2">
                <Text className="text-stone-900 dark:text-stone-100 text-xs font-sans-bold" numberOfLines={1}>
                    {item.name}
                </Text>
                <View className="flex-row justify-between items-baseline mt-1">
                    <Text className="text-stone-500 dark:text-stone-400 text-[10px]" numberOfLines={1}>
                        {item.className}
                    </Text>
                    <Text className="text-amber-700 dark:text-amber-400 text-sm font-sans-bold" style={{ fontVariant: ['tabular-nums'] }}>
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