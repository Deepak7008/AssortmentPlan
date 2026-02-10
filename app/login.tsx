import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
    const { login, loginWithGoogle } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    const handleLogin = () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }
        if (!password.trim()) {
            Alert.alert('Error', 'Please enter your password');
            return;
        }
        login(email, password);
    };

    return (
        <View className="flex-1 bg-slate-950">
            <StatusBar barStyle="light-content" />
            <SafeAreaView className="flex-1">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <ScrollView
                        className="flex-1"
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View className="px-6 py-10">
                            <View className="items-center mb-10">
                                <Image
                                    source={require('../assets/images/stratos-logo.png')}
                                    style={{ width: 100, height: 100, borderRadius: 50 }}
                                    resizeMode="cover"
                                />
                                <Text className="text-white text-3xl font-bold mb-2">
                                    Stratos
                                </Text>
                                <Text className="text-slate-400 text-sm text-center">
                                    Strategic Oversight for the Retail Frontier
                                </Text>
                            </View>

                            <View className="mb-8">
                                <View className="mb-4">
                                    <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">
                                        Email
                                    </Text>
                                    <View
                                        className={`flex-row items-center rounded-xl px-4 h-14 border ${emailFocused
                                            ? 'bg-slate-800 border-sky-500/50'
                                            : 'bg-slate-900 border-slate-700'
                                            }`}
                                    >
                                        <Ionicons
                                            name="mail-outline"
                                            size={20}
                                            color={emailFocused ? '#38bdf8' : '#64748b'}
                                        />
                                        <TextInput
                                            className="flex-1 ml-3 text-white text-base"
                                            placeholder="Enter your email"
                                            placeholderTextColor="#475569"
                                            value={email}
                                            onChangeText={setEmail}
                                            onFocus={() => setEmailFocused(true)}
                                            onBlur={() => setEmailFocused(false)}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            autoComplete="email"
                                        />
                                    </View>
                                </View>

                                <View className="mb-2">
                                    <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">
                                        Password
                                    </Text>
                                    <View
                                        className={`flex-row items-center rounded-xl px-4 h-14 border ${passwordFocused
                                            ? 'bg-slate-800 border-sky-500/50'
                                            : 'bg-slate-900 border-slate-700'
                                            }`}
                                    >
                                        <Ionicons
                                            name="lock-closed-outline"
                                            size={20}
                                            color={passwordFocused ? '#38bdf8' : '#64748b'}
                                        />
                                        <TextInput
                                            className="flex-1 ml-3 text-white text-base"
                                            placeholder="Enter your password"
                                            placeholderTextColor="#475569"
                                            value={password}
                                            onChangeText={setPassword}
                                            onFocus={() => setPasswordFocused(true)}
                                            onBlur={() => setPasswordFocused(false)}
                                            secureTextEntry={!showPassword}
                                            autoCapitalize="none"
                                        />
                                        <TouchableOpacity
                                            onPress={() => setShowPassword(!showPassword)}
                                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        >
                                            <Ionicons
                                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                                size={20}
                                                color="#64748b"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <TouchableOpacity className="self-end mt-1 mb-6">
                                    <Text className="text-sky-400 text-xs font-semibold">
                                        Forgot Password?
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleLogin}
                                    activeOpacity={0.85}
                                    className="rounded-xl overflow-hidden mb-5"
                                >
                                    <LinearGradient
                                        colors={['#0ea5e9', '#38bdf8']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        className="h-14 items-center justify-center rounded-xl"
                                    >
                                        <Text className="text-slate-950 text-base font-bold tracking-wide">
                                            Sign In
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <View className="flex-row items-center mb-5">
                                    <View className="flex-1 h-[1px] bg-slate-700" />
                                    <Text className="text-slate-500 text-xs mx-4 font-medium">
                                        OR
                                    </Text>
                                    <View className="flex-1 h-[1px] bg-slate-700" />
                                </View>

                                <TouchableOpacity
                                    onPress={loginWithGoogle}
                                    activeOpacity={0.8}
                                    className="flex-row items-center justify-center h-14 rounded-xl bg-slate-900 border border-slate-700"
                                >
                                    <View className="w-5 h-5 mr-3 items-center justify-center">
                                        <Image
                                            source={require('../assets/images/google-logo.png')}
                                            style={{ width: 20, height: 20 }}
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <Text className="text-white text-sm font-semibold">
                                        Continue with Google
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
