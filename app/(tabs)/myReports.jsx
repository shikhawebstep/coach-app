import MyReports from '@/components/quality_control/MyReports';
import { useRouter } from 'expo-router';

export default function MyReportsScreen() {
    const router = useRouter();
    return <MyReports onBack={() => router.back()} />;
}
