// app/RootLayoutNav.tsx
//@ts-ignore
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/hooks/AuthContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayoutNav() {
    const colorScheme = useColorScheme();
    const { token, loading } = useAuth();
    const [fontsLoaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (fontsLoaded && !loading) SplashScreen.hideAsync();
    }, [fontsLoaded, loading]);

    useEffect(() => {
        if (loading || !fontsLoaded) return;

        const inAuthGroup = segments[0] === 'auth';

        if (!token && !inAuthGroup) {
            router.replace('/auth/LoginScreen');
        }

        if (token && inAuthGroup) {
            router.replace('/');
        }
    }, [loading, fontsLoaded, token, segments]);

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="auth/LoginScreen" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}
