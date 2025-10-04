import { TouchableOpacity } from "react-native";
import { ScrollView, Text, View } from "react-native";

export default function AllDays({ Days, currentDay, setCurrentDay }) {
  return (
    <View style={{ paddingVertical: 8 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      >
        {Days.map(day => {

          // console.log("day",day)
          console.log("currentDay",currentDay)
          
          const isActive = currentDay === day;

          return (
            <TouchableOpacity
              key={day}
              onPress={() => setCurrentDay(day)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 9,
                borderRadius: 16,
                marginLeft: -12,
                marginRight: 17,
                borderWidth: 1,
                borderColor: isActive ? '#4F46E5' : '#e5e7eb',
                backgroundColor: isActive ? '#EEF2FF' : 'white',
              }}
            >
              <Text style={{ fontWeight: isActive ? '700' : '500', color: isActive ? '#3730A3' : '#111827' }}>
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
