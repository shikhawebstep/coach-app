import QcReportFlow from '@/components/quality_control/CreateQcReport';
import { useRouter } from 'expo-router';

export default function CreateQcReportScreen() {
    const router = useRouter();
    return <QcReportFlow onBack={() => router.back()} />;
}
