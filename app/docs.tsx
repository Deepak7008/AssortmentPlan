import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassView } from '../components/ui/GlassView';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';

export default function DocsScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const expoUrl = "exp://192.168.1.4:8081";
    // Increased size for better visibility
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(expoUrl)}&bgcolor=1e293b&color=38bdf8`;

    const openLink = () => {
        Linking.openURL(expoUrl).catch(err => console.error("Couldn't load page", err));
    };

    return (
        <View className="flex-1 bg-slate-950">
            <SafeAreaView edges={['top']} className="flex-1">
                <GlassView intensity={10} className="px-5 py-4 border-b border-glass-border flex-row justify-between items-center">
                    <View>
                        <Text className="text-sky-400 text-[10px] uppercase tracking-[0.2em] font-bold mb-0.5">Reference</Text>
                        <Text className="text-white text-xl font-bold">Mobile Access</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="bg-slate-800/80 w-10 h-10 rounded-full border border-slate-700 items-center justify-center z-50 cursor-pointer"
                        activeOpacity={0.7}
                    >
                        <Ionicons name="close" size={24} color="#fff" />
                    </TouchableOpacity>
                </GlassView>

                <View className="flex-1 px-4 items-center justify-center -mt-20">
                    <View className="bg-slate-900 rounded-3xl p-8 items-center border border-slate-700 w-full max-w-sm shadow-2xl">
                        <View className="bg-white p-3 rounded-2xl mb-8 shadow-lg">
                            <Image
                                source={{ uri: qrUrl }}
                                style={{ width: 220, height: 220 }}
                                resizeMode="contain"
                            />
                        </View>
                        <Text className="text-slate-300 text-base mb-6 text-center font-medium">Scan with Expo Go (Android) or Camera (iOS)</Text>

                        <TouchableOpacity
                            onPress={openLink}
                            className="bg-sky-500/10 px-6 py-4 rounded-xl border border-sky-500/30 w-full items-center mb-4 active:bg-sky-500/30"
                        >
                            <Text className="text-sky-400 font-bold text-lg selectable">{expoUrl}</Text>
                        </TouchableOpacity>

                        <Text className="text-slate-500 text-xs text-center px-4 leading-5">
                            Ensure your device is connected to the same Wi-Fi network: {"\n"}
                            <Text className="text-slate-400 font-bold">192.168.1.4</Text>
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}
