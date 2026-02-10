import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export const ProfileButton = () => {
    const { userName, userEmail, logout } = useAuth();
    const [menuVisible, setMenuVisible] = useState(false);

    const initials = (userName || 'U')
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <>
            <TouchableOpacity
                onPress={() => setMenuVisible(true)}
                className="w-9 h-9 rounded-full bg-sky-500/20 border border-sky-500/30 items-center justify-center ml-2"
            >
                <Text className="text-sky-400 text-xs font-bold">{initials}</Text>
            </TouchableOpacity>

            <Modal
                transparent
                visible={menuVisible}
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <TouchableOpacity
                    className="flex-1"
                    activeOpacity={1}
                    onPress={() => setMenuVisible(false)}
                >
                    <View className="absolute top-24 right-4 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl overflow-hidden min-w-[200px]">
                        <View className="px-4 py-3 border-b border-slate-700">
                            <Text className="text-white text-sm font-bold">{userName}</Text>
                            <Text className="text-slate-400 text-xs mt-0.5">{userEmail}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                setMenuVisible(false);
                                logout();
                            }}
                            className="flex-row items-center px-4 py-3"
                        >
                            <Ionicons name="log-out-outline" size={18} color="#ef4444" />
                            <Text className="text-red-400 text-sm font-semibold ml-2">Logout</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
};
