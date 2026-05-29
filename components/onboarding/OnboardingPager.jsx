import { Colors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function OnboardingPager({ slides, onIndexChanged }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef(null);

    const onIndexChangedRef = useRef(onIndexChanged);
    onIndexChangedRef.current = onIndexChanged;

    // Use useRef to guarantee the function reference never changes on rerender,
    // avoiding the React Native "Changing onViewableItemsChanged on the fly" error.
    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems && viewableItems.length > 0) {
            const index = viewableItems[0].index;
            if (index !== null) {
                setActiveIndex(index);
                if (onIndexChangedRef.current) {
                    onIndexChangedRef.current(index);
                }
            }
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const renderItem = ({ item }) => (
        <View style={styles.slide}>
            <Image source={item.image} style={styles.image} resizeMode="cover" />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.gradient}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                scrollEventThrottle={32}
                initialNumToRender={1}
                maxToRenderPerBatch={1}
                windowSize={3}
                style={styles.flatList}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        height: height,
    },
    flatList: {
        flex: 1,
    },
    slide: {
        width: width,
        height: height,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
    },
});
