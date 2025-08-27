import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

type StarRatingProps = {
    value: number | string;
    max?: number;
    size?: number;
    colorActive?: string;
    colorInactive?: string;
    isShowAll?: boolean;
    onChange?: (value: number) => void;
};

export const StarRating: React.FC<StarRatingProps> = ({
    value,
    max = 5,
    size = 20,
    colorActive = '#FFD700',
    colorInactive = '#CCCCCC',
    isShowAll = true,
    onChange,
}) => {
    const fixValue = Number(value) || 0;
    const rating = Math.max(0, Math.min(fixValue, max));

    return (
        <View style={styles.container}>
            {Array.from({ length: isShowAll ? max : rating }).map((_, index) => {
                const starValue = index + 1;
                const isActive = starValue <= rating;
                return (
                    <Pressable
                        key={index}
                        onPress={() => {
                            if (!onChange) return;
                            // nếu bấm lại ngôi sao hiện tại -> reset về 0
                            if (starValue === rating) {
                                onChange(0);
                            } else {
                                onChange(starValue);
                            }
                        }}
                    >
                        <MaterialCommunityIcons
                            name="star"
                            size={size}
                            color={isActive ? colorActive : colorInactive}
                        />
                    </Pressable>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
});
