import AssessmentResults from '@/components/classes/assessments/AssessmentResults';
import PracticalAssessments from '@/components/classes/assessments/PracticalAssessments';
import SummarisePerformance from '@/components/classes/assessments/SummarisePerformance';
import BirthdayParties from '@/components/classes/birthday_parties/BirthdayParties';
import BirthdayPartyDetails from '@/components/classes/birthday_parties/BirthdayPartyDetails';
import ClassDetails from '@/components/classes/club/ClassDetails';
import SelectATeam from '@/components/classes/club/SelectATeam';
import SessionDetails from '@/components/classes/club/SessionDetails';
import SessionMatchDetails from '@/components/classes/club/SessionMatchDetails';
import SessionTrainingDetails from '@/components/classes/club/SessionTrainingDetails';
import AddTrialist from '@/components/classes/common/AddTrialist';
import AppHomeCategories from '@/components/classes/common/AppHomeCategories';
import CoachResults from '@/components/classes/common/CoachResults';
import CustomerFeedback from '@/components/classes/common/CustomerFeedback';
import GameDetails from '@/components/classes/common/GameDetails';
import GameDetailsSearch from '@/components/classes/common/GameDetailsSearch';
import HomeDashboard from '@/components/classes/common/HomeDashboard';
import MusicPlayer from '@/components/classes/common/MusicPlayer';
import Notes from '@/components/classes/common/Notes';
import NotificationDetails from '@/components/classes/common/NotificationDetails';
import NotificationsList from '@/components/classes/common/NotificationsList';
import OtherAreas from '@/components/classes/common/OtherAreas';
import Questionnaire from '@/components/classes/common/Questionnaire';
import RecordComments from '@/components/classes/common/RecordComments';
import SearchSkill from '@/components/classes/common/SearchSkill';
import SessionExercise from '@/components/classes/common/SessionExercise';
import SessionPlanList from '@/components/classes/common/SessionPlanList';
import StudentClassDetails from '@/components/classes/common/StudentClassDetails';
import StudentInformation from '@/components/classes/common/StudentInformation';
import StudentNumbers from '@/components/classes/common/StudentNumbers';
import SyllabusDayDetails from '@/components/classes/common/SyllabusDayDetails';
import SyllabusSkill from '@/components/classes/common/SyllabusSkill';
import UploadVideo from '@/components/classes/common/UploadVideo';
import VenuesFilter from '@/components/classes/common/VenuesFilter';
import HolidayCampDetails from '@/components/classes/holiday_camps/HolidayCampDetails';
import HolidayCampsList from '@/components/classes/holiday_camps/HolidayCampsList';
import PrivateClassesBookings from '@/components/classes/private_classes/PrivateClassesBookings';
import PrivateStudentClassDetails from '@/components/classes/private_classes/PrivateStudentClassDetails';
import CreateQcReport from '@/components/classes/reports/CreateQcReport';
import IssueReport from '@/components/classes/reports/IssueReport';
import ReportIssueForm from '@/components/classes/reports/ReportIssueForm';
import ReportIssueList from '@/components/classes/reports/ReportIssueList';
import ReportSummary from '@/components/classes/reports/ReportSummary';
import SelectAVenue from '@/components/classes/weekly_classes/SelectAVenue';
import SelectAVenueList from '@/components/classes/weekly_classes/SelectAVenueList';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Classes() {
    const params = useLocalSearchParams();
    const [currentView, setCurrentView] = useState(params.view || 'dashboard');

    useEffect(() => {
        if (params.view) {
            setCurrentView(params.view);
        }
    }, [params.view]);

    if (currentView === 'camps' || currentView === 'holiday') {
        return <HolidayCampsList
            onBack={() => setCurrentView('dashboard')}
            onCampSelect={() => setCurrentView('campDetails')}
        />;
    }

    if (currentView === 'campDetails') {
        return <HolidayCampDetails
            onBack={() => setCurrentView('camps')}
            onSyllabusClick={() => setCurrentView('syllabus')}
            onStudentSelect={(id) => setCurrentView('studentClass')}
        />;
    }

    if (currentView === 'private') {
        return <PrivateClassesBookings
            onBack={() => setCurrentView('dashboard')}
            onStudentSelect={(id) => setCurrentView('privateStudentClass')}
        />;
    }

    if (currentView === 'privateStudentClass') {
        return <PrivateStudentClassDetails
            onBack={() => setCurrentView('private')}
            onNotesClick={() => setCurrentView('notes')}
        />;
    }

    if (currentView === 'team') {
        return <SelectATeam
            onBack={() => setCurrentView('dashboard')}
            onSessionSelect={() => setCurrentView('session')}
        />;
    }

    if (currentView === 'session') {
        return <SessionDetails
            onBack={() => setCurrentView('team')}
            onSessionPlanClick={() => setCurrentView('syllabusDayDetails')}
        />;
    }

    if (currentView === 'studentClass') {
        return <StudentClassDetails
            onBack={() => {
                // Return to previous view - for now hardcoded to sessionTrainingDetails or campDetails?
                // Let's keep it flexible or at least consistent with common paths
                setCurrentView('sessionTrainingDetails');
            }}
            onNotesClick={() => setCurrentView('notes')}
        />;
    }

    if (currentView === 'class') {
        return <ClassDetails
            onBack={() => setCurrentView('notes')}
            onGameClick={() => setCurrentView('gameDetails')}
        />;
    }

    if (currentView === 'venueList') {
        return <SelectAVenueList
            onBack={() => setCurrentView('venue')}
            onSessionSelect={(id) => setCurrentView('sessionTrainingDetails')}
        />;
    }

    if (currentView === 'birthday') {
        return <BirthdayParties
            onBack={() => setCurrentView('dashboard')}
            onBookingSelect={(id) => setCurrentView('birthdayDetails')}
        />;
    }

    if (currentView === 'birthdayDetails') {
        return <BirthdayPartyDetails
            onBack={() => setCurrentView('birthday')}
            onSyllabusClick={() => setCurrentView('syllabus')}
        />;
    }

    if (currentView === 'venue' || currentView === 'weekly') {
        return <SelectAVenue
            onBack={() => setCurrentView('dashboard')}
            onVenueSelect={(id) => setCurrentView('venueList')}
        />;
    }

    if (currentView === 'notes') {
        return <Notes
            onBack={() => setCurrentView('studentClass')}
            onClassClick={() => setCurrentView('class')}
        />;
    }

    if (currentView === 'addTrialist') {
        return <AddTrialist onBack={() => setCurrentView('dashboard')} />;
    }

    if (currentView === 'sessionTrainingDetails') {
        return <SessionTrainingDetails
            onBack={() => setCurrentView('venueList')}
            onStudentSelect={(id) => setCurrentView('studentInformation')}
            onSessionClick={() => setCurrentView('session')}
            onSessionPlanClick={() => setCurrentView('syllabusDayDetails')}
        />;
    }

    if (currentView === 'syllabusDayDetails') {
        return <SyllabusDayDetails
            onBack={() => setCurrentView('sessionTrainingDetails')}
            onSessionItemSelect={(id) => setCurrentView('sessionExercise')}
        />;
    }

    if (currentView === 'sessionExercise') {
        return <SessionExercise
            onBack={() => setCurrentView('syllabusDayDetails')}
            onSearchSkillClick={() => setCurrentView('searchSkill')}
        />;
    }

    if (currentView === 'searchSkill') {
        return <SearchSkill onBack={() => setCurrentView('sessionExercise')} />;
    }

    if (currentView === 'syllabusSkill') {
        return <SyllabusSkill onBack={() => setCurrentView('dashboard')} />;
    }



    if (currentView === 'issueReport') {
        return <IssueReport onBack={() => setCurrentView('dashboard')} />;
    }



    if (currentView === 'notificationsList') {
        return <NotificationsList onNotificationSelect={() => setCurrentView('notificationDetails')} />;
    }

    if (currentView === 'notificationDetails') {
        return <NotificationDetails onBack={() => setCurrentView('notificationsList')} />;
    }

    if (currentView === 'practicalAssessments') {
        return <PracticalAssessments onBack={() => setCurrentView('dashboard')} />;
    }

    if (currentView === 'reportIssueList') {
        return <ReportIssueList onNewReport={() => setCurrentView('reportIssueForm')} />;
    }

    if (currentView === 'reportIssueForm') {
        return <ReportIssueForm onBack={() => setCurrentView('reportIssueList')} />;
    }

    if (currentView === 'myResults') {
        return <CoachResults onBack={() => setCurrentView('dashboard')} title="My results" />;
    }

    // if (currentView === 'myReports') {
    //     return <CoachResults onBack={() => setCurrentView('dashboard')} title="My reports" />;
    // }

    if (currentView === 'musicPlayer') {
        return <MusicPlayer onBack={() => setCurrentView('dashboard')} />;
    }


    if (currentView === 'customerFeedback') {
        return <CustomerFeedback onBack={() => setCurrentView('dashboard')} />;
    }

    if (currentView === 'studentNumbers') {
        return <StudentNumbers onBack={() => setCurrentView('dashboard')} />;
    }

    if (currentView === 'assessmentResults') {
        return <AssessmentResults onBack={() => setCurrentView('dashboard')} />;
    }

    if (currentView === 'venuesFilter') {
        return <VenuesFilter onBack={() => setCurrentView('dashboard')} />;
    }



    if (currentView === 'studentInformation') {
        return <StudentInformation onBack={() => setCurrentView('sessionTrainingDetails')} />;
    }

    if (currentView === 'createQcReport') {
        return <CreateQcReport onBack={() => setCurrentView('dashboard')} />;
    }

    if (currentView === 'appHomeCategories') {
        return <AppHomeCategories />;
    }

    if (currentView === 'gameDetails') {
        return <GameDetails onBack={() => setCurrentView('class')} />;
    }

    if (currentView === 'uploadVideo') {
        return <UploadVideo onBack={() => setCurrentView('dashboard')} />;
    }

    if (currentView === 'sessionMatchDetails') {
        return <SessionMatchDetails
            onBack={() => setCurrentView('dashboard')}
            onStudentSelect={(id) => setCurrentView('studentClass')}
        />;
    }



    if (currentView === 'gameDetailsSearch') {
        return <GameDetailsSearch onBack={() => setCurrentView('dashboard')} />;
    }

    if (currentView === 'sessionPlanList') {
        return <SessionPlanList
            onBack={() => setCurrentView('session')}
            onSessionSelect={() => setCurrentView('gameDetails')}
        />;
    }

    if (currentView === 'reportSummary') {
        return <ReportSummary onBack={() => setCurrentView('dashboard')} />;
    }

    if (currentView === 'recordComments') {
        return <RecordComments onBack={() => setCurrentView('dashboard')} />;
    }

    if (currentView === 'summarisePerformance') {
        return <SummarisePerformance onBack={() => setCurrentView('dashboard')} />;
    }

    if (currentView === 'otherAreas') {
        return <OtherAreas onBack={() => setCurrentView('dashboard')} />;
    }

    if (currentView === 'questionnaire') {
        return <Questionnaire onBack={() => setCurrentView('dashboard')} />;
    }

    if (currentView === 'homeDashboard') {
        return <HomeDashboard onBack={() => setCurrentView('dashboard')} />;
    }

    if (currentView === 'dashboard') {
        return <AppHomeCategories onCategorySelect={(id) => setCurrentView(id === 'club' ? 'team' : id)} />;
    }

    const renderButtons = () => {
        switch (currentView) {
            case 'club':
                return (
                    <>
                        <Text style={styles.sectionTitle}>Club & Others UIs</Text>
                        <TouchableOpacity style={styles.navButtonBatch6} onPress={() => setCurrentView('issueReport')}>
                            <Text style={styles.navButtonText}>View Issue Report UI</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navButtonBatch7} onPress={() => setCurrentView('notificationsList')}>
                            <Text style={styles.navButtonText}>View Notifications UI</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navButtonBatch7} onPress={() => setCurrentView('notificationDetails')}>
                            <Text style={styles.navButtonText}>View Notification Details UI</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navButtonBatch7} onPress={() => setCurrentView('practicalAssessments')}>
                            <Text style={styles.navButtonText}>View Practical Assessments UI</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navButtonBatch7} onPress={() => setCurrentView('reportIssueList')}>
                            <Text style={styles.navButtonText}>View Report Issue List UI</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navButtonBatch7} onPress={() => setCurrentView('reportIssueForm')}>
                            <Text style={styles.navButtonText}>View New Report UI</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navButtonBatch8} onPress={() => setCurrentView('myResults')}>
                            <Text style={styles.navButtonText}>View My Results UI</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navButtonBatch8} onPress={() => setCurrentView('myReports')}>
                            <Text style={styles.navButtonText}>View My Reports UI</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navButtonBatch8} onPress={() => setCurrentView('musicPlayer')}>
                            <Text style={styles.navButtonText}>View Music Player UI</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navButtonBatch9} onPress={() => setCurrentView('customerFeedback')}>
                            <Text style={styles.navButtonText}>View Customer Feedback UI</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navButtonBatch9} onPress={() => setCurrentView('studentNumbers')}>
                            <Text style={styles.navButtonText}>View Student Numbers UI</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navButtonBatch9} onPress={() => setCurrentView('assessmentResults')}>
                            <Text style={styles.navButtonText}>View Assessment Results UI</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navButtonBatch9} onPress={() => setCurrentView('venuesFilter')}>
                            <Text style={styles.navButtonText}>View Venues Filter UI</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navButtonBatch10} onPress={() => setCurrentView('createQcReport')}>
                            <Text style={styles.navButtonText}>View Create QC Report UI</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navButtonBatch12} onPress={() => setCurrentView('reportSummary')}>
                            <Text style={styles.navButtonText}>View Report Summary UI</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navButtonBatch12} onPress={() => setCurrentView('recordComments')}>
                            <Text style={styles.navButtonText}>View Record Comments UI</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navButtonBatch12} onPress={() => setCurrentView('otherAreas')}>
                            <Text style={styles.navButtonText}>View Other Areas UI</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navButtonBatch12} onPress={() => setCurrentView('questionnaire')}>
                            <Text style={styles.navButtonText}>View Questionnaire UI</Text>
                        </TouchableOpacity>
                    </>
                );
            default:
                return (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Unknown Category</Text>
                        <Text style={styles.cardContent}>Please select a valid category from the dashboard.</Text>
                    </View>
                );
        }
    };

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity onPress={() => setCurrentView('dashboard')} style={{ marginBottom: 16 }}>
                <Text style={{ color: '#3B82F6', fontWeight: 'bold', fontSize: 16 }}>← Back to Categories</Text>
            </TouchableOpacity>

            {renderButtons()}

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    cardContent: {
        color: '#666',
    },
    grid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    gridItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        marginTop: 8,
        color: '#333',
    },
    navButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 12,
        alignItems: 'center',
    },
    navButtonAlt: {
        backgroundColor: '#1CAB4B', // Green to differentiate
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 12,
        alignItems: 'center',
    },
    navButtonBatch3: {
        backgroundColor: '#8B5CF6', // Purple 
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 12,
        alignItems: 'center',
    },
    navButtonBatch4: {
        backgroundColor: '#F59E0B', // Amber/Orange
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 12,
        alignItems: 'center',
    },
    navButtonBatch5: {
        backgroundColor: '#EC4899', // Pink
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 12,
        alignItems: 'center',
    },
    navButtonBatch6: {
        backgroundColor: '#14B8A6', // Teal
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 12,
        alignItems: 'center',
    },
    navButtonBatch7: {
        backgroundColor: '#6366F1', // Indigo
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 12,
        alignItems: 'center',
    },
    navButtonBatch8: {
        backgroundColor: '#8B5CF6', // Purple
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 12,
        alignItems: 'center',
    },
    navButtonBatch9: {
        backgroundColor: '#F43F5E', // Rose
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 12,
        alignItems: 'center',
    },
    navButtonBatch10: {
        backgroundColor: '#0EA5E9', // Sky Blue
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 12,
        alignItems: 'center',
    },
    navButtonBatch11: {
        backgroundColor: '#F59E0B', // Amber
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 12,
        alignItems: 'center',
    },
    navButtonBatch12: {
        backgroundColor: '#8B5CF6', // Purple
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 12,
        alignItems: 'center',
    },
    navButtonBatch13: {
        backgroundColor: '#14B8A6', // Teal
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 12,
        alignItems: 'center',
    },
    navButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
