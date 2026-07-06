import CustomerFeedback from '@/components/venue_health/CustomerFeedback';
import { useRouter } from 'expo-router';

export default function CustomerFeedbackScreen() {
    const router = useRouter();
    return <CustomerFeedback onBack={() => router.back()} />;
}
