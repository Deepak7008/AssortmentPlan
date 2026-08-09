import React from 'react';
import { View, Text } from 'react-native';
import { GlassView } from './ui/GlassView';
import { DocsButton } from './DocsButton';
import { UploadButton } from './UploadButton';
import { ProfileButton } from './ProfileButton';
import { ThemeToggle } from './ThemeToggle';

interface AppHeaderProps {
    onUpload: (files: { name: string; text: string }[]) => void;
}

export const AppHeader = ({ onUpload }: AppHeaderProps) => (
    <GlassView intensity={10} className="px-5 py-4 flex-row justify-between items-center border-b border-glass-border">
        <View>
            <Text className="text-slate-900 dark:text-white text-xl font-bold">Stratos</Text>
        </View>
        <View className="flex-row items-center">
            <ThemeToggle />
            <DocsButton />
            <UploadButton onUpload={onUpload} />
            <ProfileButton />
        </View>
    </GlassView>
);
