import AssessmentCriteria from '@/components/assessments/AssessmentCriteria';
import PracticalAssessmentsComponent from '@/components/assessments/PracticalAssessments';
import SummarisePerformance from '@/components/assessments/SummarisePerformance';
import UploadVideo from '@/components/assessments/UploadVideo';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function PracticalAssessmentsFlow() {
    const router = useRouter();
    const [currentView, setCurrentView] = useState('practicalAssessments');

    if (currentView === 'practicalAssessments') {
        return <PracticalAssessmentsComponent
            onBack={() => router.back()}
            onStart={() => setCurrentView('assessmentCriteria')}
        />;
    }

    if (currentView === 'assessmentCriteria') {
        return <AssessmentCriteria
            onBack={() => setCurrentView('practicalAssessments')}
            onNext={() => setCurrentView('uploadVideo')}
        />;
    }

    if (currentView === 'uploadVideo') {
        return <UploadVideo
            onBack={() => setCurrentView('assessmentCriteria')}
            onNext={() => setCurrentView('summarisePerformance')}
        />;
    }

    if (currentView === 'summarisePerformance') {
        return <SummarisePerformance
            onBack={() => setCurrentView('uploadVideo')}
            onComplete={() => setCurrentView('practicalAssessments')}
        />;
    }

    return null;
}
