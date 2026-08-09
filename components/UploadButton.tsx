import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface UploadedFile {
    name: string;
    text: string;
}

interface UploadButtonProps {
    onUpload: (files: UploadedFile[]) => void;
}

export const UploadButton = ({ onUpload }: UploadButtonProps) => {
    const { colors } = useTheme();

    const pickDocuments = async () => {
        try {
            // Lazy-load native-only modules so the web bundle never pulls them in
            const DocumentPicker = require('expo-document-picker');
            const FileSystem = require('expo-file-system/legacy');

            const documentPickerCache = `${FileSystem.cacheDirectory}DocumentPicker`;
            const dirInfo = await FileSystem.getInfoAsync(documentPickerCache);
            if (dirInfo.exists) {
                await FileSystem.deleteAsync(documentPickerCache, { idempotent: true }).catch(() => { });
            }

            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
                multiple: true,
            });

            if (!result.canceled && result.assets?.length) {
                const uploadedFiles: UploadedFile[] = [];
                for (const asset of result.assets) {
                    const text = await FileSystem.readAsStringAsync(asset.uri);
                    uploadedFiles.push({ name: asset.name, text });
                }
                onUpload(uploadedFiles);
            }
        } catch (error) {
            console.error('Error picking documents:', error);
        }
    };

    const handlePress = async () => {
        if (Platform.OS === 'web') {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.csv';
            input.multiple = true;
            input.onchange = async (e: any) => {
                const fileList = e.target.files;
                if (fileList?.length) {
                    const files: UploadedFile[] = [];
                    for (let i = 0; i < fileList.length; i++) {
                        const file = fileList[i];
                        const text = await file.text();
                        files.push({ name: file.name, text });
                    }
                    onUpload(files);
                }
            };
            input.click();
        } else {
            const { Alert } = require('react-native');
            Alert.alert(
                "Data Options",
                "Choose how to load data",
                [
                    { text: "Load Demo Data", onPress: () => onUpload([{ name: '__RESET__', text: '__RESET__' }]) },
                    { text: "Upload CSV(s)", onPress: pickDocuments },
                    { text: "Cancel", style: "cancel" }
                ]
            );
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 items-center justify-center border border-slate-200 dark:border-slate-700"
        >
            <Ionicons name="cloud-upload-outline" size={20} color={colors.accent} />
        </TouchableOpacity>
    );
};
