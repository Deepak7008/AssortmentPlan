import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';

interface UploadButtonProps {
    onUpload: (csvText: string) => void;
}

export const UploadButton = ({ onUpload }: UploadButtonProps) => {
    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
                multiple: false,
            });

            if (!result.canceled && result.assets?.[0]) {
                const fileUri = result.assets[0].uri;
                const csvText = await FileSystem.readAsStringAsync(fileUri);
                onUpload(csvText);
            }
        } catch (error) {
            console.error('Error picking document:', error);
        }
    };

    const handlePress = async () => {
        if (Platform.OS === 'web') {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.csv';
            input.onchange = async (e: any) => {
                const file = e.target.files?.[0];
                if (file) {
                    const text = await file.text();
                    onUpload(text);
                }
            };
            input.click();
        } else {
            // Mobile: Show options
            const { Alert } = require('react-native');
            Alert.alert(
                "Data Options",
                "Choose how to load data",
                [
                    { text: "Load Demo Data", onPress: () => onUpload('__RESET__') },
                    { text: "Upload CSV", onPress: pickDocument },
                    { text: "Cancel", style: "cancel" }
                ]
            );
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            className="w-10 h-10 rounded-full bg-slate-800 items-center justify-center border border-slate-700"
        >
            <Ionicons name="cloud-upload-outline" size={20} color="#38bdf8" />
        </TouchableOpacity>
    );
};
