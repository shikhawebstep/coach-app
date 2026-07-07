import AssessmentCriteria from '@/components/assessments/AssessmentCriteria';
import AssessmentDecision from '@/components/assessments/AssessmentDecision';
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
            onComplete={() => setCurrentView('assessmentDecision')}
        />;
    }

    if (currentView === 'assessmentDecision') {
        return <AssessmentDecision
            onBack={() => setCurrentView('summarisePerformance')}
            onComplete={() => setCurrentView('practicalAssessments')}
        />;
    }

    return null;
}
