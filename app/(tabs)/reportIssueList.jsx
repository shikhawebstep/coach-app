import { useRouter } from 'expo-router';
import { useState } from 'react';
import IssueReport from '../../components/report_issue/IssueReport';
import ReportIssueForm from '../../components/report_issue/ReportIssueForm';
import ReportIssueList from '../../components/report_issue/ReportIssueList';

export default function ReportIssueListFlow() {
    const router = useRouter();
    const [view, setView] = useState('list'); // 'list' | 'create' | 'details'
    const [selectedReportId, setSelectedReportId] = useState(null);
    if (view === 'create') {
        return (
            <>
                <ReportIssueForm
                    onBack={() => setView('list')}
                />
            </>
        );
    }

    if (view === 'details' && selectedReportId) {
        return (
            <>
                <IssueReport
                    reportId={selectedReportId}
                    onBack={() => setView('list')}
                />
            </>
        );
    }

    return (
        <>
            <ReportIssueList
                onBack={() => router.back()}
                onNewReport={() => setView('create')}
                onReportSelect={(id) => {
                    setSelectedReportId(id);
                    setView('details');
                }}
            />
        </>
    );
}