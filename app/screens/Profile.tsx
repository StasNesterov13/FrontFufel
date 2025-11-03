import { getProfile } from "@/api/profiles";
import { AuthContext } from "@/context/AuthContext";
import { ScreenNavigationProp } from "@/types/navigation";
import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const ProfileScreen = () => {
  const { token, logout } = useContext(AuthContext);
  const navigation = useNavigation<ScreenNavigationProp>();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  // Срабатывает при изменении токена
  if (!token) {
    navigation.navigate("Login");
  }
}, [token]);

useEffect(() => {
  if (!token) return;

  const fetchProfile = async () => {
    try {
      const data = await getProfile(token);
      setProfile(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, []); // пустой массив — только первый рендер


  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4a6cf7" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loader}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("CreateProfile")}>
          <Text style={styles.buttonText}>Создать профиль</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Массив данных для отображения
  const profileRows = [
    { label: "Имя", value: profile.first_name },
    { label: "Фамилия", value: profile.last_name },
    { label: "Пол", value: profile.gender === "male" ? "Мужской" : "Женский" },
    { label: "Дата рождения", value: new Date(profile.birth_date).toLocaleDateString("ru-RU") },
    { label: "Рост", value: `${profile.height} см` },
    { label: "Уровень активности", value: translateActivity(profile.activity_level) },
    { label: "Тип диеты", value: profile.diet_type },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Мой профиль</Text>

      <View style={styles.card}>
        {profileRows.map(({ label, value }) => (
          <ProfileRow key={label} label={label} value={value} />
        ))}
      </View>

      <Text style={styles.logout} onPress={logout}>
        Выйти
      </Text>
    </ScrollView>
  );
};

// Компонент строки профиля
const ProfileRow = ({ label, value }: { label: string; value: string | number }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

// Перевод уровня активности
const translateActivity = (level: string) => {
  const map: Record<string, string> = {
    low: "Низкий",
    medium: "Средний",
    high: "Высокий",
  };
  return map[level];
};

export default ProfileScreen;

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f4f6fb" },
  container: { flexGrow: 1, justifyContent: "flex-start", padding: 20, backgroundColor: "#f4f6fb" },
  buttonText: { color: "#fff", fontWeight: "400", fontSize: 16 },
  button: { width: "100%", backgroundColor: "#4a6cf7", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 10 },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 20, textAlign: "center", color: "#333" },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 4, marginBottom: 30 },
  row: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: "600", color: "#666", marginBottom: 4 },
  value: { fontSize: 16, fontWeight: "500", color: "#333" },
  logout: { textAlign: "center", color: "#e74c3c", fontWeight: "700", fontSize: 16 },
});
