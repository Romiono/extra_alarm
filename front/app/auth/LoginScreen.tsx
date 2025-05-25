import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import {useRouter} from 'expo-router';
import { useAuth } from '@/hooks/AuthContext';
import {AuthApi} from "@/api/AuthApi";

export default function LoginScreen() {
    const router = useRouter();
    const {token, saveToken, clearToken, loading} = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');

    const handleAuth = async () => {
        setError('');
        if (!email || !password || (!isLogin && !repeatPassword)) {
            setError('Пожалуйста, заполните все поля.');
            return;
        }
        if (!isLogin && password !== repeatPassword) {
            setError('Пароли не совпадают.');
            return;
        }
        try {
            const res = isLogin ? await AuthApi.login({email, password}) : await AuthApi.register({email, password})
            const t = res.accessToken;
            if (t) {
                await saveToken(t);
            } else {
                setError('Неверный ответ от сервера');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка сети');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isLogin ? 'Вход' : 'Регистрация'}</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Пароль"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            {!isLogin && (
                <TextInput
                    style={styles.input}
                    placeholder="Повторите пароль"
                    secureTextEntry
                    value={repeatPassword}
                    onChangeText={setRepeatPassword}
                />
            )}

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button title={isLogin ? 'Войти' : 'Зарегистрироваться'} onPress={handleAuth} />

            <TouchableOpacity onPress={() => {
                setIsLogin(!isLogin);
                setError('');
            }}>
                <Text style={styles.switch}>
                    {isLogin
                        ? 'Нет аккаунта? Зарегистрироваться!'
                        : 'Уже есть аккаунт? Войти!'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        borderBottomWidth: 1,
        padding: 10,
        marginBottom: 16,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 12,
    },
    switch: {
        marginTop: 20,
        textAlign: 'center',
        color: 'blue',
    },
});
