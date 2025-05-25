import {Button, Image, StyleSheet} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import CustomizableButton from "@/components/ui/CustomizableButton";
import {useAuth} from "@/hooks/AuthContext";

export default function HomeScreen() {
    const {clearToken} = useAuth()
    return (
        <ThemedView style={styles.container}>
            {/* Основной контент (будет занимать всё пространство кроме места под templateContainer) */}
            <ThemedView style={styles.mainContainer}>
                <Image
                    source={require('@/assets/images/power-svgrepo-com.png')}
                    style={styles.alertButton}
                />
                <ThemedText style={styles.alertText}>Отправить сообщение!</ThemedText>
            </ThemedView>

            {/* Контейнер с шаблоном (будет прижат к низу, но над Tabs) */}
            <ThemedView style={styles.templateContainer}>
                <ThemedView style={styles.templateChoser}>
                    <ThemedText style={styles.templateText}>Выбранный шаблон: Основной</ThemedText>
                    <CustomizableButton>Выбрать шаблон</CustomizableButton>
                    <Button  title={'Выйти'} onPress={clearToken}/>
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between', // Распределяет пространство между детьми
    },
    mainContainer: {
        flex: 1, // Занимает всё доступное пространство
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertButton: {
        height: 200,
        aspectRatio: 1,
    },
    alertText: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 20,
    },
    templateContainer: {
        width: '100%',
        padding: 10,
        // Высота определяется содержимым
    },
    templateChoser: {
        width: '100%',
        minHeight: 100, // Минимальная высота
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5, // Для Android
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        gap: 5
    },
    templateText: {
        fontSize: 16,
        textAlign: 'center',
    },
});