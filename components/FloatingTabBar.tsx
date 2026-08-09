import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Grid, List, Calculator } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();

  return (
    <View style={[styles.container, { bottom: Math.max(insets.bottom, 20) }]}>
      <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={[styles.blurView, { backgroundColor: isDark ? 'rgba(2, 6, 23, 0.65)' : 'rgba(255, 255, 255, 0.72)' }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          let IconComponent = Home;
          let label = 'Home';
          if (route.name === 'home') { IconComponent = Home; label = 'Home'; }
          if (route.name === 'index') { IconComponent = Grid; label = 'Dashboard'; }
          if (route.name === 'items') { IconComponent = List; label = 'Items'; }
          if (route.name === 'simulator') { IconComponent = Calculator; label = 'Simulator'; }

          return (
            <TabItem 
                key={route.key}
                isFocused={isFocused}
                onPress={onPress}
                onLongPress={onLongPress}
                IconComponent={IconComponent}
                label={label}
            />
          );
        })}
      </BlurView>
    </View>
  );
}

const TabItem = ({ isFocused, onPress, onLongPress, IconComponent, label }: any) => {
  const { colors } = useTheme();
    
  // Spring animation for subtle scale when focused
  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(isFocused ? 1.15 : 1, { damping: 12, stiffness: 200 }) }
      ],
    };
  });

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabContent}
      activeOpacity={0.7}
    >
      <Animated.View style={[animatedIconStyle, styles.iconContainer]}>
          <IconComponent 
            size={22} 
            color={isFocused ? colors.accent : colors.textSecondary} 
            strokeWidth={isFocused ? 2.5 : 2}
          />
          <Text style={[
            styles.tabLabel,
            { 
              color: isFocused ? colors.accent : colors.textSecondary,
              fontWeight: isFocused ? '700' : '500'
            }
          ]}>
            {label}
          </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: '10%',
    right: '10%',
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    // Shadow for Android
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
  },
  blurView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
  }
});
