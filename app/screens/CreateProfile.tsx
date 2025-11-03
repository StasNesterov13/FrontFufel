import { createProfile } from "@/api/profiles";
import { AuthContext } from "@/context/AuthContext";
import { ScreenNavigationProp } from "@/types/navigation";
import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import {
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const CreateProfileScreen = () => {
  const { token } = useContext(AuthContext);
  const navigation = useNavigation<ScreenNavigationProp>();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dietType, setDietType] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [activityLevel, setActivityLevel] = useState<"low" | "medium" | "high" | null>(null);
  const [height, setHeight] = useState("170");
  const [birthDate, setBirthDate] = useState(new Date(2000, 0, 1));
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleSubmit = async () => {
    if (!firstName || !lastName || !gender || !height || !activityLevel || !dietType) {
      return Alert.alert("Ошибка", "Пожалуйста, заполните все поля");
    }

    const today = new Date();
    if (birthDate > today) return Alert.alert("Ошибка", "Введите корректную дату рождения");

    try {
      await createProfile(token!, {
        first_name: firstName,
        last_name: lastName,
        gender,
        birth_date: birthDate.toISOString(),
        height: Number(height),
        activity_level: activityLevel,
        diet_type: dietType,
      });
      Alert.alert("Успешно", "Профиль создан!");
      navigation.navigate("Profile");
    } catch (err: any) {
      console.log(err.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Создание профиля</Text>

        {/* --- Личные данные --- */}
        <TextInput
          placeholder="Имя"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />
        <TextInput
          placeholder="Фамилия"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
        />

        {/* --- Пол --- */}
        <Text style={styles.label}>Пол</Text>
        <View style={styles.row}>
          <ChoiceButton label="Мужской" selected={gender === "male"} onPress={() => setGender("male")} />
          <ChoiceButton label="Женский" selected={gender === "female"} onPress={() => setGender("female")} />
        </View>

        {/* --- Дата рождения --- */}
        <Text style={styles.label}>Дата рождения</Text>
        <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={[styles.input, { justifyContent: "center" }]}>
          <Text>{birthDate.toLocaleDateString("ru-RU")}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          date={birthDate}
          maximumDate={new Date()}
          locale="ru_RU"
          onConfirm={(d) => { setBirthDate(d); setDatePickerVisibility(false); }}
          onCancel={() => setDatePickerVisibility(false)}
        />

        {/* --- Рост --- */}
        <Text style={styles.label}>Рост (см)</Text>
        <TextInput
          placeholder="Рост"
          value={height}
          onChangeText={setHeight}
          style={styles.input}
          keyboardType="numeric"
        />

        {/* --- Активность --- */}
        <Text style={styles.label}>Уровень активности</Text>
        <View style={styles.row}>
          <ChoiceButton label="Низкий" selected={activityLevel === "low"} onPress={() => setActivityLevel("low")} />
          <ChoiceButton label="Средний" selected={activityLevel === "medium"} onPress={() => setActivityLevel("medium")} />
          <ChoiceButton label="Высокий" selected={activityLevel === "high"} onPress={() => setActivityLevel("high")} />
        </View>

        {/* --- Диета --- */}
        <TextInput
          placeholder="Тип диеты (например: сбалансированная, веганская, кето)"
          value={dietType}
          onChangeText={setDietType}
          style={styles.input}
        />

        {/* --- Кнопка --- */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Создать профиль</Text>
        </TouchableOpacity>      
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

// Вынесенная кнопка выбора
const ChoiceButton = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => (
  <TouchableOpacity
    style={[styles.choice, selected && styles.choiceSelected]}
    onPress={onPress}
  >
    <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: 20, backgroundColor: "#f4f6fb" },
  title: { fontSize: 24, fontWeight: "600", marginBottom: 20, textAlign: "center" },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
    textAlign: "center",
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  choice: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginHorizontal: 4,
    backgroundColor: "#fff",
  },
  choiceSelected: { backgroundColor: "#4a6cf7", borderColor: "#4a6cf7" },
  choiceText: { color: "#333", fontWeight: "500" },
  choiceTextSelected: { color: "#fff" },
  button: { width: "100%", backgroundColor: "#4a6cf7", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});

export default CreateProfileScreen;
