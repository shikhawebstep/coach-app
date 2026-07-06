// utils/notificationVisuals.js

const visualsMap = {
    oneToOne: require('@/assets/images/one-to-one.png'),
    birthdayParty: require('@/assets/images/birthdayn.png'),
    courseAdded: require('@/assets/images/add.png'),
    courseUpdated: require('@/assets/images/add.png'),
    cancelled: require('@/assets/images/cancel.png'),
    default: require('@/assets/images/add.png'),
};

// Detects the notification "type" from its title + category text
// since the API doesn't send an explicit type field.
export function getNotificationVisual(notification) {
    const title = (notification?.title || '').toLowerCase();
    const category = (notification?.category || '').toLowerCase();

    if (category.includes('cancelled')) {
        return visualsMap.cancelled;
    }

    if (title.includes('one-to-one')) {
        return visualsMap.oneToOne;
    }

    if (title.includes('birthday party')) {
        return visualsMap.birthdayParty;
    }

    if (title.includes('course')) {
        if (title.includes('updated')) {
            return visualsMap.courseUpdated;
        }
        // "New Course Assigned" and similar
        return visualsMap.courseAdded;
    }

    return visualsMap.default;
}