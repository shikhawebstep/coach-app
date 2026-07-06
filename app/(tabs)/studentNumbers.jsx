import StudentNumbers from '@/components/venue_health/StudentNumbers';
import { useRouter } from 'expo-router';

export default function StudentNumbersScreen() {
    const router = useRouter();
    return <StudentNumbers onBack={() => router.back()} />;
}
