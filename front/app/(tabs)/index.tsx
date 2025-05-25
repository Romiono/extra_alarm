import React, { useEffect, useState } from 'react';
import {
    Button,
    FlatList,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Switch,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import CustomizableButton from '@/components/ui/CustomizableButton';
import { useAuth } from '@/hooks/AuthContext';
import { TemplateApi } from '@/api/TemplateApi';
import { MessageApi } from '@/api/MessageApi';
import { CreateMessageTemplateDto, MessageTemplate } from '@/shared/types/api';
import { ContactApi } from '@/api/ContactApi';
import { Contact, CreateContactDto } from '@/shared/types/api';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const TEMPLATE_STORAGE_KEY = 'currentTemplate';

export default function HomeScreen() {
    const { clearToken } = useAuth();

    const [isModalVisible, setModalVisible] = useState(false);
    const [isCreateVisible, setCreateVisible] = useState(false);
    const [templates, setTemplates] = useState<MessageTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);

    const [name, setName] = useState('');
    const [messageBody, setMessageBody] = useState('');
    const [includeLocation, setIncludeLocation] = useState(false);

    const [contactsModalVisible, setContactsModalVisible] = useState(false);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [newContactEmail, setNewContactEmail] = useState('');
    const [showAddContact, setShowAddContact] = useState(false);

    useEffect(() => {
        const loadTemplate = async () => {
            try {
                const storedId = await AsyncStorage.getItem(TEMPLATE_STORAGE_KEY);
                if (storedId) {
                    const template = await TemplateApi.getById(storedId);
                    setSelectedTemplate(template);
                }
            } catch (error) {
                console.error('Ошибка загрузки шаблона из хранилища', error);
            }
        };

        loadTemplate();
    }, []);

    const openModal = async () => {
        try {
            const fetchedTemplates = await TemplateApi.getAll();
            setTemplates(fetchedTemplates);
            setModalVisible(true);
        } catch (error) {
            console.error('Ошибка получения шаблонов', error);
        }
    };

    const chooseTemplate = async (template: MessageTemplate) => {
        try {
            setSelectedTemplate(template);
            await AsyncStorage.setItem(TEMPLATE_STORAGE_KEY, template.id);
            setModalVisible(false);
        } catch (error) {
            console.error('Ошибка выбора шаблона', error);
        }
    };

    const handleSend = async () => {
        if (!selectedTemplate) return;

        try {
            let locationData = undefined;

            if (selectedTemplate.include_location) {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert(
                        'Разрешение отклонено',
                        'Чтобы отправить сообщение с геолокацией, нужно разрешение на доступ к местоположению.'
                    );
                    return;
                }

                const location = await Location.getCurrentPositionAsync({});
                locationData = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                };
            }

            const response = await MessageApi.send(selectedTemplate.id, locationData);

            if (!response.success) {
                console.warn('Сообщение не отправлено');
            }
        } catch (error) {
            console.error('Ошибка при отправке сообщения', error);
        }
    };

    const handleCreateTemplate = async () => {
        if (!name.trim() || !messageBody.trim()) {
            return alert('Заполните все поля');
        }

        try {
            const newTemplate: CreateMessageTemplateDto = {
                name,
                message_body: messageBody,
                include_location: includeLocation,
            };

            await TemplateApi.create(newTemplate);

            const refreshed = await TemplateApi.getAll();
            setTemplates(refreshed);

            setName('');
            setMessageBody('');
            setIncludeLocation(false);
            setCreateVisible(false);
        } catch (error) {
            console.error('Ошибка создания шаблона', error);
        }
    };

    const openContacts = async (templateId: string) => {
        try {
            const list = await ContactApi.getByTemplate(templateId);
            setContacts(list);
            setShowAddContact(false);
            setContactsModalVisible(true);
        } catch (e) {
            console.error(e);
        }
    };

    const deleteContact = async (id: string) => {
        try {
            await ContactApi.delete(id);
            setContacts(prev => prev.filter(c => c.id !== id));
        } catch (e) {
            console.error(e);
        }
    };

    const addContact = async () => {
        if (!newContactEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            alert('Неверный email');
            return;
        }

        try {
            if (!selectedTemplate) return;
            const contact: CreateContactDto = {
                type: 'email',
                value: newContactEmail,
                template_id: selectedTemplate.id,
            };
            const created = await ContactApi.create(contact);
            setContacts(prev => [...prev, created]);
            setNewContactEmail('');
            setShowAddContact(false);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <TouchableOpacity
                style={[styles.mainContainer, !selectedTemplate && { opacity: 0.4 }]}
                onPress={handleSend}
                disabled={!selectedTemplate}
            >
                <Image
                    source={require('@/assets/images/power-svgrepo-com.png')}
                    style={styles.alertButton}
                />
                <ThemedText style={styles.alertText}>Отправить сообщение!</ThemedText>
            </TouchableOpacity>

            <ThemedView style={styles.templateContainer}>
                <ThemedView style={styles.templateChoser}>
                    <ThemedText style={styles.templateText}>
                        {selectedTemplate
                            ? `Выбранный шаблон: ${selectedTemplate.name}`
                            : 'Шаблон не выбран'}
                    </ThemedText>
                    <ThemedView style={styles.templateButtons}>
                        <CustomizableButton onPress={openModal}>Выбрать шаблон</CustomizableButton>
                    </ThemedView>
                </ThemedView>
            </ThemedView>

            <Modal visible={isModalVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <ThemedView style={styles.modalContent}>
                        <FlatList
                            data={templates}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
                                    <Pressable onPress={() => chooseTemplate(item)} style={styles.templateItem}>
                                        <ThemedText style={styles.templateName}>{item.name}</ThemedText>
                                        <ThemedText>{item.message_body}</ThemedText>
                                        <ThemedText>Геолокация: {item.include_location ? 'Да' : 'Нет'}</ThemedText>
                                    </Pressable>
                                    <TouchableOpacity onPress={() => openContacts(item.id)} style={{ padding: 10 }}>
                                        <Ionicons name="mail" size={24} color="black" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                        <Button title="Отмена" onPress={() => setModalVisible(false)} />
                        <TouchableOpacity style={styles.fab} onPress={() => setCreateVisible(true)}>
                            <ThemedText style={styles.fabText}>+</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                </View>
            </Modal>

            <Modal visible={isCreateVisible} transparent animationType="fade">
                <View style={styles.centeredModal}>
                    <ThemedView style={styles.createModal}>
                        <TextInput style={styles.input} placeholder="Название шаблона" value={name} onChangeText={setName} />
                        <TextInput style={[styles.input, { height: 80 }]} placeholder="Сообщение" value={messageBody} onChangeText={setMessageBody} multiline />
                        <View style={styles.switchRow}>
                            <ThemedText>Включить геолокацию</ThemedText>
                            <Switch value={includeLocation} onValueChange={setIncludeLocation} />
                        </View>
                        <CustomizableButton onPress={handleCreateTemplate}>Создать шаблон</CustomizableButton>
                        <Button title="Закрыть" onPress={() => setCreateVisible(false)} />
                    </ThemedView>
                </View>
            </Modal>

            <Modal visible={contactsModalVisible} transparent animationType="fade">
                <View style={styles.modalContainer}>
                    <ThemedView style={styles.modalContent}>
                        {!contacts ?
                            <ThemedText>У вас пока нет контактов для этого шаблона, добавьте их!</ThemedText>
                            :
                            <FlatList
                                data={contacts}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                        <ThemedText>{item.value}</ThemedText>
                                        <TouchableOpacity onPress={() => deleteContact(item.id)}>
                                            <Ionicons name="trash" size={20} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        }

                        {showAddContact ? (
                            <Modal transparent animationType='fade'>
                                <View style={styles.centeredModal}>
                                    <ThemedView style={styles.createModal}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Email"
                                            value={newContactEmail}
                                            onChangeText={setNewContactEmail}
                                        />
                                        <CustomizableButton onPress={addContact}>Сохранить контакт</CustomizableButton>
                                        <Button title={'Закрыть'} onPress={() => setShowAddContact(false)}/>
                                    </ThemedView>
                                </View>

                            </Modal>
                        ) : null}
                        <Button title="Закрыть" onPress={() => setContactsModalVisible(false)} />
                        <TouchableOpacity style={styles.fab} onPress={() => setShowAddContact(true)}>
                            <ThemedText style={styles.fabText}>+</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                </View>
            </Modal>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'space-between' },
    mainContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    alertButton: { height: 200, aspectRatio: 1 },
    alertText: { fontWeight: 'bold', fontSize: 18, marginTop: 20 },
    templateContainer: { width: '100%', padding: 10 },
    templateChoser: {
        width: '100%', minHeight: 100, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3, shadowRadius: 10, elevation: 5, borderRadius: 10,
        justifyContent: 'center', alignItems: 'center', padding: 15, gap: 5,
    },
    templateButtons: { width: '100%', display: 'flex', gap: 5 },
    templateText: { fontSize: 16, textAlign: 'center' },
    modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
    modalContent: {
        height: '75%', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, position: 'relative'
    },
    templateItem: { padding: 15 },
    templateName: { fontWeight: 'bold', fontSize: 16 },
    fab: {
        position: 'absolute', bottom: 65, right: 20, width: 50, height: 50,
        borderRadius: 25, backgroundColor: '#78DFFF', justifyContent: 'center',
        alignItems: 'center', elevation: 5, padding: 0, textAlign: 'center', margin: 0
    },
    fabText: { color: '#fff', fontSize: 21, fontWeight: 'bold',  padding: 0, textAlign: 'center', margin: 0 },
    centeredModal: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
    createModal: { width: '90%', borderRadius: 10, padding: 20, gap: 10 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16, backgroundColor: '#f9f9f9' },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
