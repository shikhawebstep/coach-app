import AssessmentCriteria from '@/components/assessments/AssessmentCriteria';
import AssessmentResults from '@/components/assessments/AssessmentResults';
import PracticalAssessments from '@/components/assessments/PracticalAssessments';
import SummarisePerformance from '@/components/assessments/SummarisePerformance';
import UploadVideo from '@/components/assessments/UploadVideo';

import BirthdayParties from '@/components/classes/birthday_parties/BirthdayParties';
import BirthdayPartyDetails from '@/components/classes/birthday_parties/BirthdayPartyDetails';
import BirthdaySyllabus from '@/components/classes/birthday_parties/BirthdaySyllabus';

import ClassDetails from '@/components/classes/club/ClassDetails';
import ClubStudentClassDetails from '@/components/classes/club/ClubStudentClassDetails';
import ClubSyllabus from '@/components/classes/club/ClubSyllabus';
import SelectATeam from '@/components/classes/club/SelectATeam';
import SessionDetails from '@/components/classes/club/SessionDetails';
import SessionMatchDetails from '@/components/classes/club/SessionMatchDetails';

import AddTrialist from '@/components/classes/common/AddTrialist';
import AppHomeCategories from '@/components/classes/common/AppHomeCategories';
import GameDetails from '@/components/classes/common/GameDetails';
import GameDetailsSearch from '@/components/classes/common/GameDetailsSearch';
import Notes from '@/components/classes/common/Notes';
import SearchSkill from '@/components/classes/common/SearchSkill';
import SessionExercise from '@/components/classes/common/SessionExercise';
import SessionPlanList from '@/components/classes/common/SessionPlanList';
import StudentInformation from '@/components/classes/common/StudentInformation';
import SyllabusSkill from '@/components/classes/common/SyllabusSkill';
import VenuesFilter from '@/components/classes/common/VenuesFilter';
import NotificationDetails from '@/components/notifications/NotificationDetails';
import NotificationsList from '@/components/notifications/NotificationsList';

import HolidayCampDetails from '@/components/classes/holiday_camps/HolidayCampDetails';
import HolidayCampsList from '@/components/classes/holiday_camps/HolidayCampsList';
import HolidayStudentClassDetails from '@/components/classes/holiday_camps/HolidayStudentClassDetails';
import HolidaySyllabus from '@/components/classes/holiday_camps/HolidaySyllabus';

import PrivateClassesBookings from '@/components/classes/private_classes/PrivateClassesBookings';
import PrivateStudentClassDetails from '@/components/classes/private_classes/PrivateStudentClassDetails';

import SelectAVenue from '@/components/classes/weekly_classes/SelectAVenue';
import SelectAVenueList from '@/components/classes/weekly_classes/SelectAVenueList';
import WeeklySessionTrainingDetails from '@/components/classes/weekly_classes/WeeklySessionTrainingDetails';
import WeeklyStudentClassDetails from '@/components/classes/weekly_classes/WeeklyStudentClassDetails';
import WeeklySyllabusDayDetails from '@/components/classes/weekly_classes/WeeklySyllabusDayDetails';

import QcReportFlow from '@/components/quality_control/CreateQcReport';
import MyReports from '@/components/quality_control/MyReports';

import CustomerFeedback from '@/components/venue_health/CustomerFeedback';
import StudentNumbers from '@/components/venue_health/StudentNumbers';

import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Classes() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const [currentView, setCurrentView] = useState(params.view || 'dashboard');
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [selectedVenuenId, setSelectedVenuenId] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedSessionData, setSelectedSessionData] = useState(null);
    const [selectedBirthdaySessionData, setSelectedBirthdaySessionData] = useState(null);
    const [selectedSessionDate, setSelectedSessionDate] = useState(null);
    const [syllabusDetails, setSyllabusDetails] = useState(null);
    const [selectedBirthdayBooking, setSelectedBirthdayBooking] = useState(null);
    const [selectedBirthdaySyllabus, setSelectedBirthdaySyllabus] = useState(null);
    const [weeklyExcercises, setWeeklyExcercises] = useState(null);
    const [selectedPrivateBookingId, setSelectedPrivateBookingId] = useState(null);
    const [selectedReportId, setSelectedReportId] = useState(null);
    const [notesBackView, setNotesBackView] = useState('studentClass');
    console.log('currentView', currentView)

    useFocusEffect(
        useCallback(() => {
            setCurrentView(params.view || 'dashboard');
        }, [params.view])
    );

    useEffect(() => {
        if (params.view) {
            setCurrentView(params.view);
        }
    }, [params.view]);

    if (currentView === 'camps' || currentView === 'holiday') {
        return <HolidayCampsList
            onBack={() => setCurrentView('dashboard')}
            onCampSelect={(id) => {
                setCurrentView('campDetails');
                setSelectedVenuenId(id)

            }}
        />;
    }

    if (currentView === 'campDetails') {
        return <HolidayCampDetails
            id={selectedVenuenId}
            onBack={() => setCurrentView('camps')}
            onSyllabusClick={(data) =>{ 
                setCurrentView('holidaySyllabus');
                setSyllabusDetails(data)
            }}
            onStudentSelect={(student) => {
                setSelectedStudent(student);         // ← store it
                setCurrentView('holidayStudentClass');
            }}
        />;
    }

    // classes.js
    if (currentView === 'holidaySyllabus') {
        return <HolidaySyllabus
            venueId={selectedVenuenId}          // ← pass so it can fetch
            onBack={() => setCurrentView('campDetails')}
            onSessionSelect={(exercise) => {
                setWeeklyExcercises(exercise);
                setCurrentView('holidaySessionExercise');
            }}
            syllabus={syllabusDetails}
        />;
    }

    if (currentView === 'holidaySessionExercise') {
        return <SessionExercise
            exerciseData={weeklyExcercises}
            onBack={() => setCurrentView('holidaySyllabus')}
            onSearchSkillClick={() => setCurrentView('holidaySearchSkill')}
        />;
    }


    if (currentView === 'holidaySearchSkill') {
        return <SearchSkill onBack={() => setCurrentView('holidaySessionExercise')} />;
    }

    if (currentView === 'private') {
        return <PrivateClassesBookings
            onBack={() => setCurrentView('dashboard')}
            onStudentSelect={(id) => {
                setSelectedPrivateBookingId(id);
                setCurrentView('privateStudentClass');
            }}
        />;
    }

    if (currentView === 'privateStudentClass') {
        return <PrivateStudentClassDetails
            bookingId={selectedPrivateBookingId}
            onBack={() => setCurrentView('private')}
            onNotesClick={() => {
                setNotesBackView('privateStudentClass');
                setCurrentView('notes');
            }}
        />;
    }

    if (currentView === 'team' || currentView === 'club') {
        return <SelectATeam
            onBack={() => setCurrentView('dashboard')}
            onSessionSelect={() => setCurrentView('session')}
            onMatchSelect={() => setCurrentView('sessionMatchDetails')}
        />;
    }

    if (currentView === 'session') {
        return <SessionDetails
            onBack={() => setCurrentView('team')}
            onSessionPlanClick={() => setCurrentView('clubSyllabus')}
            onStudentSelect={(id) => setCurrentView('clubStudentInformation')}
        />;
    }

    if (currentView === 'sessionTrainingDetails') {
        return <WeeklySessionTrainingDetails
            sessionId={selectedSessionId}
            sessionDate={selectedSessionDate}
            onBack={() => setCurrentView('venueList')}
            onStudentSelect={(student) => {
                setSelectedStudent(student);
                setCurrentView('studentClass');
            }}
            onSessionClick={(view) => setCurrentView(view)}
            onSessionPlanClick={(sessionData) => {        // ← receive sessionData here
                setSelectedSessionData(sessionData);
                setCurrentView('syllabusDayDetails');
            }}
            sessionTitle="Session"
        />;
    }
    if (currentView === 'clubSyllabus') {
        return <ClubSyllabus
            onBack={() => setCurrentView('session')}
            onSessionSelect={() => setCurrentView('clubSessionExercise')}
        />;
    }

    if (currentView === 'clubSessionExercise') {
        return <SessionExercise
            onBack={() => setCurrentView('clubSyllabus')}
            onSearchSkillClick={() => setCurrentView('clubSearchSkill')}
        />;
    }

    if (currentView === 'clubSearchSkill') {
        return <SearchSkill onBack={() => setCurrentView('clubSessionExercise')} />;
    }

    if (currentView === 'clubStudentInformation') {
        return <StudentInformation onBack={() => setCurrentView('session')} />;
    }

    if (currentView === 'clubStudentClass') {
        return <ClubStudentClassDetails
            onBack={() => setCurrentView('sessionMatchDetails')}
            onNotesClick={() => {
                setNotesBackView('clubStudentClass');
                setCurrentView('notes');
            }}
        />;
    }

    if (currentView === 'holidayStudentClass') {
        return <HolidayStudentClassDetails
            onBack={() => setCurrentView('campDetails')}
            onNotesClick={() => setCurrentView('holidayStudentInformation')}
        />;
    }

    if (currentView === 'holidayStudentInformation') {
        return <StudentInformation onBack={() => setCurrentView('holidayStudentClass')} />;
    }

    if (currentView === 'studentClass') {
        return <WeeklyStudentClassDetails
            student={selectedStudent}
            onBack={() => setCurrentView('sessionTrainingDetails')}
            onNotesClick={() => {
                setNotesBackView('studentClass');
                setCurrentView('notes');
            }}
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
            venueId={selectedVenue?.id}
            onBack={() => setCurrentView('venue')}
            onSessionSelect={(sessionId, sessionDate) => {    // ← receive date too
                setSelectedSessionId(sessionId);
                setSelectedSessionDate(sessionDate);          // ← store it
                setCurrentView('sessionTrainingDetails');
            }}
        />;
    }

    if (currentView === 'birthday') {
        return <BirthdayParties
            onBack={() => setCurrentView('dashboard')}
            onBookingSelect={(booking) => {
                setSelectedBirthdayBooking(booking)
                setCurrentView('birthdayDetails')
            }}
        />
    }

    // 4. Fix birthdayDetails — pass actual booking object, not the string 'booking'
    if (currentView === 'birthdayDetails') {
        return <BirthdayPartyDetails
            booking={selectedBirthdayBooking}
            onBack={() => setCurrentView('birthday')}
            onSyllabusClick={(booking) => {
                setSelectedBirthdayBooking(booking);   // ← was setSelectedBirthdayBooking('booking')
                setCurrentView('birthdaySyllabus');
            }}
        />
    }

    // 5. Fix birthdaySyllabus — pass selectedBirthdayBooking (not selectedBirthdaySyllabus)
    //    Fix onSessionSelect — store exercise in selectedBirthdaySessionData
    if (currentView === 'birthdaySyllabus') {
        return <BirthdaySyllabus
            booking={selectedBirthdayBooking}          // ← was selectedBirthdaySyllabus
            onBack={() => setCurrentView('birthdayDetails')}
            onSessionSelect={(exerciseItem) => {
                setSelectedBirthdaySessionData(exerciseItem);  // ← was setSelectedBirthdaySyllabus
                setCurrentView('birthdaySessionExercise');
            }}
        />;
    }

    if (currentView === 'birthdaySessionExercise') {
        return <SessionExercise
            exerciseData={selectedBirthdaySessionData}
            onBack={() => setCurrentView('birthdaySyllabus')}
        />;
    }
    if (currentView === 'venue' || currentView === 'weekly') {
        return <SelectAVenue
            onBack={() => setCurrentView('dashboard')}
            onVenueSelect={(venue) => {
                setSelectedVenue(venue);        // ← store it
                setCurrentView('venueList');
            }}
        />;
    }
    if (currentView === 'notes') {
        return <Notes
            onBack={() => setCurrentView(notesBackView)}
            onClassClick={() => setCurrentView('class')}
        />;
    }

    if (currentView === 'addTrialist') {
        return <AddTrialist onBack={() => setCurrentView('dashboard')} />;
    }

    if (currentView === 'sessionTrainingDetails') {
        return <WeeklySessionTrainingDetails
            sessionId={selectedSessionId}
            onBack={() => setCurrentView('venueList')}
            onStudentSelect={(student) => {
                setSelectedStudent(student);
                setCurrentView('studentClass'); // changed from studentInformation to studentClass so we can see the student details and notes UI
            }}
            onSessionClick={(view) => setCurrentView(view)}
            onSessionPlanClick={() => setCurrentView('syllabusDayDetails')}
            sessionTitle="Session"
        />;
    }

    if (currentView === 'syllabusDayDetails') {
        return <WeeklySyllabusDayDetails
            onBack={() => setCurrentView('sessionTrainingDetails')}
            onSessionItemSelect={(excercise) => {
                setCurrentView('sessionExercise');
                setWeeklyExcercises(excercise)
            }}
            sessionPlan={selectedSessionData?.sessionPlan}
        />;
    }

    if (currentView === 'sessionExercise') {
        return <SessionExercise
            exerciseData={weeklyExcercises}
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





    if (currentView === 'notificationsList') {
        return <NotificationsList onNotificationSelect={() => setCurrentView('notificationDetails')} />;
    }

    if (currentView === 'notificationDetails') {
        return <NotificationDetails onBack={() => setCurrentView('notificationsList')} />;
    }

    if (currentView === 'practicalAssessments') {
        return <PracticalAssessments
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

 

    if (currentView === 'customerFeedback') {
        return <CustomerFeedback onBack={() => router.back()} />;
    }

    if (currentView === 'studentNumbers') {
        return <StudentNumbers onBack={() => router.back()} />;
    }

    if (currentView === 'createQcReport') {
        return <QcReportFlow onBack={() => router.back()} />;
    }

    if (currentView === 'myReports') {
        return <MyReports onBack={() => router.back()} />;
    }

    if (currentView === 'assessmentResults') {
        return <AssessmentResults onBack={() => router.back()} />;
    }

    if (currentView === 'venuesFilter') {
        return <VenuesFilter onBack={() => router.back()} />;
    }



    if (currentView === 'studentInformation') {
        return <WeeklyStudentInformation student={selectedStudent} onBack={() => setCurrentView('sessionTrainingDetails')} />;
    }



    if (currentView === 'appHomeCategories') {
        return <AppHomeCategories />;
    }

    if (currentView === 'gameDetails') {
        return <GameDetails onBack={() => setCurrentView('class')} />;
    }

    if (currentView === 'uploadVideoOld') {
        return <UploadVideo onBack={() => setCurrentView('dashboard')} />;
    }

    if (currentView === 'sessionMatchDetails') {
        return <SessionMatchDetails
            onBack={() => setCurrentView('team')}
            onStudentSelect={(id) => setCurrentView('clubStudentClass')}
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

    if (currentView === 'dashboard') {
        return <AppHomeCategories onCategorySelect={(id) => setCurrentView(id === 'club' ? 'team' : id)} />;
    }

    const renderButtons = () => {
        switch (currentView) {
            case 'club':
                return (
                    <>
                        <Text style={styles.sectionTitle}>Club & Others UIs</Text>

                        <TouchableOpacity style={styles.navButtonBatch7} onPress={() => setCurrentView('notificationsList')}>
                            <Text style={styles.navButtonText}>View Notifications UI</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navButtonBatch7} onPress={() => setCurrentView('notificationDetails')}>
                            <Text style={styles.navButtonText}>View Notification Details UI</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navButtonBatch7} onPress={() => setCurrentView('practicalAssessments')}>
                            <Text style={styles.navButtonText}>View Practical Assessments UI</Text>
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
