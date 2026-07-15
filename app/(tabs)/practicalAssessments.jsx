import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Alert, StyleSheet, View, Text, useColorScheme } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import AssessmentCriteria from '@/components/assessments/AssessmentCriteria';
import AssessmentDecision from '@/components/assessments/AssessmentDecision';
import PracticalAssessmentsComponent from '@/components/assessments/PracticalAssessments';
import SummarisePerformance from '@/components/assessments/SummarisePerformance';
import UploadVideo from '@/components/assessments/UploadVideo';
import AssessmentResults from '@/components/assessments/AssessmentResults';
import CustomLoader from '@/components/common/CustomLoader';

export default function PracticalAssessmentsFlow() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const { token, isAuthLoading } = useAuth();

    const [currentView, setCurrentView] = useState('practicalAssessments');
    const [assessments, setAssessments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [loadingPreview, setLoadingPreview] = useState(false);

    // States for accumulating assessment data
    const [selectedAssessment, setSelectedAssessment] = useState(null);
    const [ratings, setRatings] = useState({});
    const [videoData, setVideoData] = useState(null);
    const [audioUri, setAudioUri] = useState(null);
    const [decision, setDecision] = useState(null);

    const fetchAssessments = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const authToken = token || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQ0MSwiZW1haWwiOiJsb3ZlbHlrYXBpbDEwQGdtYWlsLmNvbSIsInJvbGUiOiJDb2FjaCIsImZpcnN0TmFtZSI6IkNvYWNoIiwibGFzdE5hbWUiOiIxIiwiaWF0IjoxNzg0MDEyMjAwLCJleHAiOjE3ODQwMzM4MDB9.jH0iYSKuXFdn0k_2QbLGvH5xivs8EHRQsuGobvAefcM";
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${authToken}`);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.grabbite.com/";
            const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
            const response = await fetch(`${cleanBaseUrl}api/coachpro/practical-assessment/my-assessments`, requestOptions);
            const resultText = await response.text();

            if (!response.ok) {
                throw new Error(`Failed to fetch assessments: ${response.status}`);
            }

            const json = JSON.parse(resultText);
            if (json.status) {
                setAssessments(json.data || []);
            } else {
                throw new Error(json.message || "Failed to load assessments");
            }
        } catch (err) {
            console.error(err);
            setError("Could not load assessments. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (!isAuthLoading) {
            fetchAssessments();
        }
    }, [fetchAssessments, isAuthLoading]);

    const submitAssessment = async (finalDecision) => {
        setSubmitting(true);
        try {
            const authToken = token || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQ0MSwiZW1haWwiOiJsb3ZlbHlrYXBpbDEwQGdtYWlsLmNvbSIsInJvbGUiOiJDb2FjaCIsImZpcnN0TmFtZSI6IkNvYWNoIiwibGFzdE5hbWUiOiIxIiwiaWF0IjoxNzg0MDEyMjAwLCJleHAiOjE3ODQwMzM4MDB9.jH0iYSKuXFdn0k_2QbLGvH5xivs8EHRQsuGobvAefcM";
            
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${authToken}`);

            const formdata = new FormData();
            
            // Map venueId and recruitmentLeadId
            const recruitmentLeadId = selectedAssessment?.raw?.recruitmentLeadId || selectedAssessment?.id;
            const venueId = selectedAssessment?.raw?.venue?.id;
            
            formdata.append("recruitmentLeadId", String(recruitmentLeadId || ''));
            formdata.append("venueId", String(venueId || ''));
            
            // Map scores
            formdata.append("punctuality", String(ratings.punctuality || '0'));
            formdata.append("communicationSkill", String(ratings.communicationSkills || '0'));
            formdata.append("structureOfExercise", String(ratings.structureOfExercises || '0'));
            if (ratings.controlOfGroup !== undefined) {
                formdata.append("controlOfGroup", String(ratings.controlOfGroup || '0'));
            }
            
            // Append notes
            formdata.append("notes", videoData?.notes || "");
            
            // Append video file
            if (videoData?.video) {
                const videoFile = videoData.video;
                const ext = videoFile.name?.split('.').pop() || 'mp4';
                formdata.append("videoUrl", {
                    uri: videoFile.uri,
                    name: videoFile.name || `video-${Date.now()}.${ext}`,
                    type: videoFile.mimeType || `video/${ext}`,
                });
            }

            // Append audio file if exists
            if (audioUri) {
                const ext = audioUri.split('.').pop() || 'm4a';
                formdata.append("audioUrl", {
                    uri: audioUri,
                    name: `audio-${Date.now()}.${ext}`,
                    type: `audio/${ext}`,
                });
            }

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: formdata,
                redirect: "follow"
            };

            const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.grabbite.com/";
            const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
            const response = await fetch(`${cleanBaseUrl}api/coachpro/practical-assessment/score`, requestOptions);
            const resultText = await response.text();

            let resultObj = {};
            try {
                resultObj = JSON.parse(resultText);
            } catch (e) {
                console.error("JSON parse error:", e);
            }

            if (!response.ok || (resultObj.status === false || resultObj.success === false)) {
                throw new Error(resultObj.message || `Submission failed with status: ${response.status}`);
            }

            Alert.alert("Success", "Assessment submitted successfully!");
            setDecision(finalDecision);
            setCurrentView('assessmentResults');
            
            // Refresh list of assessments
            fetchAssessments();
        } catch (err) {
            console.error("Submission error:", err);
            Alert.alert("Submission Failed", err.message || "Failed to submit assessment. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const fetchPrefilledResults = async (assessment) => {
        setLoadingPreview(true);
        try {
            const authToken = token || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQ0MSwiZW1haWwiOiJsb3ZlbHlrYXBpbDEwQGdtYWlsLmNvbSIsInJvbGUiOiJDb2FjaCIsImZpcnN0TmFtZSI6IkNvYWNoIiwibGFzdE5hbWUiOiIxIiwiaWF0IjoxNzg0MDEyMjAwLCJleHAiOjE3ODQwMzM4MDB9.jH0iYSKuXFdn0k_2QbLGvH5xivs8EHRQsuGobvAefcM";
            
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${authToken}`);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.grabbite.com/";
            const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
            
            const response = await fetch(`${cleanBaseUrl}api/coachpro/practical-assessment/preview/${assessment.id}`, requestOptions);
            const resultText = await response.text();

            if (!response.ok) {
                throw new Error(`Failed to fetch preview: ${response.status}`);
            }

            const json = JSON.parse(resultText);
            if (json.status && json.data) {
                const data = json.data;
                
                const getAbsoluteUrl = (url) => {
                    if (!url) return null;
                    const trimmed = String(url).trim();
                    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('file://') || trimmed.startsWith('content://')) {
                        return trimmed;
                    }
                    const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.grabbite.com/";
                    const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
                    return cleanBase + (trimmed.startsWith('/') ? trimmed.slice(1) : trimmed);
                };

                const absoluteVideoUrl = getAbsoluteUrl(data.videoUrl);
                const absoluteAudioUrl = getAbsoluteUrl(data.audioUrl);
                
                // Map the prefilled data
                const prefilledRatings = {
                    punctuality: Number(data.punctuality ?? 0),
                    communicationSkills: Number(data.communicationSkill ?? data.communicationSkills ?? 0),
                    structureOfExercises: Number(data.structureOfExercise ?? data.structureOfExercises ?? 0),
                    controlOfGroup: Number(data.controlOfGroup ?? 0),
                };
                
                const prefilledVideo = absoluteVideoUrl ? {
                    name: absoluteVideoUrl.split('/').pop() || 'video.mp4',
                    uri: absoluteVideoUrl
                } : null;

                // Normalize decision based on average score or decision field
                let normalizedDecision = 'pass';
                if (data.decision) {
                    const d = String(data.decision).toLowerCase();
                    if (d.includes('fail')) normalizedDecision = 'fail';
                    else if (d.includes('pass')) normalizedDecision = 'pass';
                } else if (data.status) {
                    const s = String(data.status).toLowerCase();
                    if (s.includes('fail')) normalizedDecision = 'fail';
                    else if (s.includes('pass')) normalizedDecision = 'pass';
                } else {
                    // Fallback based on score (70% or more is a pass)
                    const values = [
                        prefilledRatings.punctuality,
                        prefilledRatings.communicationSkills,
                        prefilledRatings.structureOfExercises,
                        prefilledRatings.controlOfGroup
                    ];
                    const sum = values.reduce((acc, v) => acc + v, 0);
                    const percentage = Math.round((sum / 20) * 100);
                    normalizedDecision = percentage >= 70 ? 'pass' : 'fail';
                }

                setSelectedAssessment(assessment);
                setRatings(prefilledRatings);
                setVideoData({ video: prefilledVideo, notes: data.notes || "" });
                setAudioUri(absoluteAudioUrl);
                setDecision(normalizedDecision);
                setCurrentView('assessmentResults');
            } else {
                throw new Error(json.message || "Failed to load preview details");
            }
        } catch (err) {
            console.error("Preview fetch error:", err);
            Alert.alert("Error", err.message || "Failed to load assessment details. Please try again.");
        } finally {
            setLoadingPreview(false);
        }
    };

    const handleReset = () => {
        setSelectedAssessment(null);
        setRatings({});
        setVideoData(null);
        setAudioUri(null);
        setDecision(null);
        setCurrentView('practicalAssessments');
    };

    if (submitting || loadingPreview) {
        return (
            <View style={[styles.submittingContainer, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
                <CustomLoader size={80} color="#3B82F6" />
                <Text style={[styles.submittingText, { color: isDark ? '#fff' : '#1a1a1a' }]}>
                    {submitting ? "Submitting Assessment..." : "Loading Assessment Details..."}
                </Text>
            </View>
        );
    }

    if (currentView === 'practicalAssessments') {
        return <PracticalAssessmentsComponent
            onBack={() => router.back()}
            onStart={(assessment) => {
                setSelectedAssessment(assessment);
                setCurrentView('assessmentCriteria');
            }}
            onViewResults={fetchPrefilledResults}
            assessments={assessments}
            isLoading={isLoading}
            error={error}
            onRefresh={fetchAssessments}
        />;
    }

    if (currentView === 'assessmentCriteria') {
        return <AssessmentCriteria
            onBack={() => setCurrentView('practicalAssessments')}
            onNext={(criteriaRatings) => {
                setRatings(criteriaRatings);
                setCurrentView('uploadVideo');
            }}
        />;
    }

    if (currentView === 'uploadVideo') {
        return <UploadVideo
            onBack={() => setCurrentView('assessmentCriteria')}
            onNext={(vidData) => {
                setVideoData(vidData);
                setCurrentView('summarisePerformance');
            }}
        />;
    }

    if (currentView === 'summarisePerformance') {
        return <SummarisePerformance
            onBack={() => setCurrentView('uploadVideo')}
            onComplete={(audio) => {
                setAudioUri(audio);
                setCurrentView('assessmentDecision');
            }}
        />;
    }

    if (currentView === 'assessmentDecision') {
        return <AssessmentDecision
            onBack={() => setCurrentView('summarisePerformance')}
            onComplete={(decisionVal) => {
                submitAssessment(decisionVal);
            }}
        />;
    }

    if (currentView === 'assessmentResults') {
        return <AssessmentResults
            assessment={selectedAssessment}
            ratings={ratings}
            video={videoData?.video}
            notes={videoData?.notes}
            audioUri={audioUri}
            decision={decision}
            onBack={handleReset}
        />;
    }

    return null;
}

const styles = StyleSheet.create({
    submittingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submittingText: {
        fontSize: 16,
        marginTop: 20,
        fontFamily: 'Urbanist_700Bold',
    }
});
