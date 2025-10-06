import MenuGrid from '@/src/components/ui/MenuGrid';
import ReportCard from '@/src/components/ui/ReportCardU';
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import Header from "../../src/components/navigation/header";


export default function Home() {
  const router = useRouter();

  return (
    
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Header />
        </View>
        <ScrollView>
          <View>
            <MenuGrid/>
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

  headerContainer: {
    width: '100%',
    zIndex: 5,
    gap: 10,
  },

  contentContainer: {
    flex: 1,
    gap: 10,
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 15
  },

  reportCard: {
    marginBottom: 15,
    marginHorizontal: 15
  },

  searchBarContainer: {
    position: 'absolute',
    top: 65,
    width: '100%',
    zIndex: 5,
  },

  chatbotButton: {
    position: 'absolute',
    right: 20,
    bottom: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 5,
  },
});