import { VACOMTheme } from '@/theme/theme';
import { Helper } from '@/utils/Helper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useRef, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Pressable } from 'react-native-gesture-handler';
import { IconButton, Modal, Text, useTheme } from 'react-native-paper';
import { VcTabBar } from './vcTabBar';
dayjs.extend(utc);

LocaleConfig.locales['vi-VN'] = {
  monthNames: [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12'
  ],
  monthNamesShort: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
  dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  today: "Hôm nay"
};

LocaleConfig.defaultLocale = 'vi-VN';
const months = Array.from({ length: 12 }, (_, index) => { return { id: index + 1, value: `Tháng ${index + 1}` } });
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 200 }, (_, i) => ({ id: i + currentYear - 100, value: `${i + currentYear - 100}` }));

interface VcDatePickerProps {
  label?: string;
  value?: string; // 'YYYY-MM-DD'
  disabled?: boolean;
  onChange: (date: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>
}

export const VcDatePicker: React.FC<VcDatePickerProps> = ({
  label,
  value,
  disabled = false,
  onChange,
  placeholder,
  style
}) => {
  const [visible, setVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState<string | null>(value ? dayjs.utc(value).format("YYYY-MM-DD") : null);
  const nowDate = (new Date()).toISOString().split('T')[0];
  const [selectYear, setSelectYear] = useState<number>(parseInt((currentDate || nowDate).split('-')[0]));
  const [selectMonth, setSelectMonth] = useState<number>(parseInt((currentDate || nowDate).split('-')[1]));
  const { colors } = useTheme<VACOMTheme>();

  const [initialDate, setInitialDate] = useState<string | null>(currentDate);

  const handleDayPress = (day: any) => {
    onChange(`${day.dateString} 00:00:00`);
    setCurrentDate(day.dateString);
    setVisible(false);
  };
  const isChange = useRef<boolean>(false);
  useEffect(() => {
    if (isChange.current) return;
    // Lấy day hiện tại
    const currentDay = parseInt((currentDate || nowDate).split('-')[2], 10);
    // Tìm số ngày tối đa trong tháng được chọn
    const maxDay = new Date(selectYear, selectMonth, 0).getDate(); // month: 1-12
    // Nếu currentDay lớn hơn maxDay, dùng maxDay
    const safeDay = Math.min(currentDay, maxDay);
    // Padding month và day
    const paddedMonth = String(selectMonth).padStart(2, '0');
    const paddedDay = String(safeDay).padStart(2, '0');
    const newDateChange = `${selectYear}-${paddedMonth}-${paddedDay}`;
    if (initialDate !== newDateChange) {
      setInitialDate(newDateChange);
    }
  }, [selectYear, selectMonth])

  const setCurrentValue = () => {
    if ((currentDate || nowDate) === initialDate) return;
    const parts = (currentDate || nowDate).split('-');
    const newYear = parseInt(parts[0]);
    const newMonth = parseInt(parts[1]);
    if (selectYear !== newYear) setSelectYear(newYear);
    if (selectMonth !== newMonth) setSelectMonth(newMonth);
  }

  useEffect(() => {
    isChange.current = true;
    const _currentDate = value ? dayjs.utc(value).format("YYYY-MM-DD") : null;
    const _selectYear = parseInt((currentDate || nowDate).split('-')[0]);
    const _selectMonth = parseInt((currentDate || nowDate).split('-')[1]);
    setCurrentDate(_currentDate);
    setSelectYear(_selectYear);
    setSelectMonth(_selectMonth);
    setTimeout(() => {
      isChange.current = false;
    }, 1000)
  }, [value])

  return (
    <>
      <View style={[{ marginTop: 6 }, style]}>
        <Pressable style={[styles.button, { backgroundColor: disabled ? colors.elevation.level1 : colors.background, borderColor: colors.vacom.borderColor }]} onPress={() => {
          if (disabled) return;
          setVisible(true);
        }}>
          <View style={[styles.input]}>
            <View style={{ flex: 1 }}><Text numberOfLines={1} variant='bodyLarge' style={[styles.inputText]}>
              {currentDate ? currentDate.split('-').reverse().join('/') : <Text numberOfLines={1} style={{ color: colors.backdrop, fontSize: 16, width: "auto" }}>{placeholder || label}</Text>}
            </Text></View>
          </View>
          {(Helper.isEmpty(value) || disabled) && <FontAwesome name="calendar" size={20} color={colors.secondary} />}
        </Pressable >
        {!Helper.isEmpty(value) && !disabled && <IconButton style={{ position: "absolute", right: -5 }} icon="close-circle" size={15} iconColor={colors.primary} onPress={() => onChange("")} />
        }
        {
          !Helper.isEmpty(value) &&
          <View style={styles.label}>
            <View style={styles.label}>
              <Text style={{ color: colors.inverseSurface, fontSize: 12.7 }}>{label}</Text>
            </View>
            <Text style={{ color: disabled ? colors.elevation.level1 : colors.background, paddingHorizontal: 4 }}>{label}</Text>
            <View style={[styles.line, { borderColor: colors.background }]} />
          </View>
        }
      </View >

      <Modal visible={visible}
        onDismiss={() => {
          setVisible(false);
          setCurrentValue();
        }}
        style={{ zIndex: 1 }}  // chỉnh zIndex được    
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Calendar
              key={currentDate || nowDate}
              current={currentDate || nowDate}
              initialDate={initialDate ?? undefined}
              onDayPress={handleDayPress}
              onMonthChange={(date: any) => {
                if (date.year !== selectYear) setSelectYear(date.year);
                if (date.month !== selectMonth) setSelectMonth(date.month);
              }}
              markedDates={
                currentDate
                  ? {
                    [currentDate]: {
                      selected: true,
                      selectedColor: colors.primary,
                    },
                  }
                  : undefined
              }
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#333',
                selectedDayBackgroundColor: colors.primary,
                selectedDayTextColor: '#ffffff',
                todayTextColor: colors.primary,
                dayTextColor: '#333',
                textDisabledColor: '#d9e1e8',
                arrowColor: colors.primary,
                monthTextColor: '#000',
                indicatorColor: colors.primary,
              }}
            />
            <View style={{ gap: 5, paddingHorizontal: 10 }}>
              <VcTabBar data={years} value={selectYear} onPress={(year) => setSelectYear(year.id as number)} style={{ borderRadius: 10, paddingHorizontal: 10 }} />
              <VcTabBar data={months} value={selectMonth} onPress={(month) => setSelectMonth(month.id as number)} style={{ borderRadius: 10, paddingHorizontal: 10 }} />
            </View>
            <IconButton mode='contained' icon={"close"} iconColor={colors.secondary} onPress={() => setVisible(false)}
              style={{ alignSelf: "center", marginVertical: 10 }} />
          </View>
        </View>
      </Modal >
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
    borderWidth: 0.5,
    borderRadius: 5
  },
  line: {
    position: "absolute",
    width: "100%",
    borderWidth: 1,
    top: 4.5,
    left: 2,
    zIndex: 1
  },
  label: {
    position: "absolute",
    color: 'transparent',
    fontSize: 12,
    top: -4.5,
    left: 8,
    zIndex: 2
  },
  input: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 10,
    height: 40
  },
  inputText: {
    color: '#333'
  },
  modalBackground: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  yearButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
  },
  closeButton: {
    flex: 0.5,
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
  },
  closeButtonText: {
    fontWeight: 'bold',
  },
  yearList: {
    padding: 10,
  },
  yearItem: {
    flex: 1,
    margin: 5,
    paddingVertical: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    alignItems: 'center',
  },
  yearItemText: {
    fontSize: 16,
    color: '#333',
  },
});
