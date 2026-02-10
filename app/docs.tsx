import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassView } from '../components/ui/GlassView';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function DocsScreen() {
    const router = useRouter();
    const expoUrl = "exp://192.168.1.4:8081";
    // Increased size for better visibility
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(expoUrl)}&bgcolor=1e293b&color=38bdf8`;

    const openLink = () => {
        Linking.openURL(expoUrl).catch(err => console.error("Couldn't load page", err));
    };

    return (
        <View className="flex-1 bg-slate-950">
            <SafeAreaView edges={['top']} className="flex-1">
                <View className="relative">
                    <GlassView intensity={10} className="px-5 py-4 border-b border-glass-border flex-row justify-between items-center">
                        <View>
                            <Text className="text-sky-400 text-[10px] uppercase tracking-[0.2em] font-bold mb-0.5">Reference</Text>
                            <Text className="text-white text-xl font-bold">Mobile Access</Text>
                        </View>
                        <View className="w-10 h-10" />
                    </GlassView>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ position: 'absolute', right: 20, top: 12, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(30, 41, 59, 0.8)', borderWidth: 1, borderColor: 'rgba(51, 65, 85, 1)', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="close" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

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
