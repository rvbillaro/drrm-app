import AlertsCard from '@/src/components/ui/AlertsCard';
import MenuGrid from '@/src/components/ui/MenuGrid';
import ReportCard from '@/src/components/ui/ReportCardU';
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import Header from "../../src/components/navigation/header";

export default function Home() {
  const router = useRouter();
  const handleViewAllAlerts = () => {
    router.push('/screens/alerts');
  };

  return (
    <View style={styles.container}>
      <View>
        <Header />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <MenuGrid />
        </View>
        
        <View style={styles.alertsCard}>
          <AlertsCard
            limit={3} 
            showViewAll={true}
            onViewAll={handleViewAllAlerts}
          />
        </View>

        <View style={styles.reportCard}>
          <ReportCard />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#fbfbfb',
  },
  alertsCard: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  reportCard: {
    marginBottom: 15,
    marginHorizontal: 15,
  },
});