import { Colors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function OnboardingPager({ slides, onIndexChanged }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef(null);

    const onViewableItemsChanged = useCallback(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const index = viewableItems[0].index;
            if (index !== null && index !== activeIndex) {
                setActiveIndex(index);
                if (onIndexChanged) {
                    onIndexChanged(index);
                }
            }
        }
    }, [activeIndex, onIndexChanged]);

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const scrollToIndex = (index) => {
        flatListRef.current?.scrollToIndex({ index, animated: true });
    };

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

            <View style={styles.pagination}>
                {slides.map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => scrollToIndex(index)}
                        style={[
                            styles.dot,
                            activeIndex === index ? styles.activeDot : styles.inactiveDot
                        ]}
                    />
                ))}
            </View>
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
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 120,
        alignSelf: 'center',
        paddingVertical: 10,
    },
    dot: {
        height: 6,
        borderRadius: 3,
        marginHorizontal: 3,
    },
    activeDot: {
        width: 20,
        backgroundColor: Colors.light.primary,
    },
    inactiveDot: {
        width: 6,
        backgroundColor: Colors.light.primary,
        opacity: 0.3,
    },
});
