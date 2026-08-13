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
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';

export default function LoginScreen() {
    const { login, loginWithGoogle } = useAuth();
    const { isDark, colors } = useTheme();
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
        <View className="flex-1 bg-stone-50 dark:bg-stone-900">
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            <SafeAreaView edges={['top', 'bottom']} className="flex-1">
                <View className="flex-row justify-end px-5 pt-4">
                    <ThemeToggle />
                </View>
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
                        <View className="px-6 py-10 w-full max-w-md self-center">
                            <View className="items-center mb-10">
                                <Image
                                    source={require('../assets/images/stratos-logo.png')}
                                    style={{ width: 100, height: 100, borderRadius: 50 }}
                                    resizeMode="cover"
                                />
                                <Text className="text-stone-900 dark:text-stone-100 text-4xl font-display mb-2">
                                    Stratos
                                </Text>
                                <Text className="text-stone-500 dark:text-stone-400 text-sm text-center">
                                    Strategic Oversight for the Retail Frontier
                                </Text>
                            </View>

                            <View className="mb-8">
                                <View className="mb-4">
                                    <Text className="text-stone-600 dark:text-stone-400 text-xs font-sans-bold uppercase tracking-wider mb-2 ml-1">
                                        Email
                                    </Text>
                                    <View
                                        className={`flex-row items-center rounded-xl px-4 h-14 border ${emailFocused
                                            ? 'bg-white border-amber-600/60 dark:bg-stone-800 dark:border-amber-600/50'
                                            : 'bg-white border-stone-200 dark:bg-stone-800 dark:border-stone-700'
                                            }`}
                                    >
                                        <Ionicons
                                            name="mail-outline"
                                            size={20}
                                            color={emailFocused ? colors.accent : colors.textSecondary}
                                        />
                                        <TextInput
                                            className="flex-1 ml-3 text-stone-900 dark:text-white text-base"
                                            placeholder="Enter your email"
                                            placeholderTextColor={isDark ? '#57534E' : '#A8A29E'}
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
                                    <Text className="text-stone-600 dark:text-stone-400 text-xs font-sans-bold uppercase tracking-wider mb-2 ml-1">
                                        Password
                                    </Text>
                                    <View
                                        className={`flex-row items-center rounded-xl px-4 h-14 border ${passwordFocused
                                            ? 'bg-white border-amber-600/60 dark:bg-stone-800 dark:border-amber-600/50'
                                            : 'bg-white border-stone-200 dark:bg-stone-800 dark:border-stone-700'
                                            }`}
                                    >
                                        <Ionicons
                                            name="lock-closed-outline"
                                            size={20}
                                            color={passwordFocused ? colors.accent : colors.textSecondary}
                                        />
                                        <TextInput
                                            className="flex-1 ml-3 text-stone-900 dark:text-white text-base"
                                            placeholder="Enter your password"
                                            placeholderTextColor={isDark ? '#57534E' : '#A8A29E'}
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
                                                color={colors.textSecondary}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <TouchableOpacity className="self-end mt-1 mb-6">
                                    <Text className="text-amber-700 dark:text-amber-400 text-xs font-sans-semibold">
                                        Forgot Password?
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleLogin}
                                    activeOpacity={0.85}
                                    className="rounded-xl overflow-hidden mb-5"
                                >
                                    <LinearGradient
                                        colors={['#D97706', '#F59E0B']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        className="h-14 items-center justify-center rounded-xl"
                                    >
                                        <Text className="text-stone-900 text-base font-sans-bold tracking-wide">
                                            Sign In
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <View className="flex-row items-center mb-5">
                                    <View className="flex-1 h-[1px] bg-stone-200 dark:bg-stone-700" />
                                    <Text className="text-stone-500 dark:text-stone-400 text-xs mx-4 font-sans-medium">
                                        OR
                                    </Text>
                                    <View className="flex-1 h-[1px] bg-stone-200 dark:bg-stone-700" />
                                </View>

                                <TouchableOpacity
                                    onPress={loginWithGoogle}
                                    activeOpacity={0.8}
                                    className="flex-row items-center justify-center h-14 rounded-xl bg-white border border-stone-200 dark:bg-stone-800 dark:border-stone-700"
                                >
                                    <View className="w-5 h-5 mr-3 items-center justify-center">
                                        <Image
                                            source={require('../assets/images/google-logo.png')}
                                            style={{ width: 20, height: 20 }}
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <Text className="text-stone-800 dark:text-white text-sm font-sans-semibold">
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
