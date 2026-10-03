import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetTextInput,
  useBottomSheet,
  type BottomSheetBackgroundProps,
} from '@gorhom/bottom-sheet';
import { SymbolView } from 'expo-symbols';
import { useRef, type ReactNode } from 'react';
import { Keyboard, Platform, Pressable, StyleSheet, TextInput, useWindowDimensions, View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { BottomTabInset, Spacing } from '@/constants/theme';
import { usePlaceSearch, type SheetItem } from '@/hooks/use-place-search';
import { useTheme } from '@/hooks/use-theme';
import type { Place } from '@/lib/mapbox';

import { ConcentricView, isConcentricSupported } from '../../modules/concentric-view';

// The sheet runs behind the floating tab bar, so its lowest stop leaves just the search bar peeking out.
const PeekHeight = BottomTabInset + 84;
const SnapPoints = [PeekHeight, '40%', '92%'];
const Middle = 1;
const Expanded = 2;
const MaxSheetHeight = 0.92;

// On iOS 26+ the sheet floats as a glass card, inset from the sides and bottom of the screen with
// bottom corners concentric to the screen's, until it's fully expanded. Elsewhere it runs edge to edge.
const Floating = isConcentricSupported;
const NativeConcentricView = ConcentricView as NonNullable<typeof ConcentricView>;
const EdgeInset = 8;
const FloatingTopRadius = 36;
const EdgeTopRadius = 24;
// Height of the default sheet handle (10pt padding on each side of a 4pt indicator).
const HandleHeight = 24;

// BottomSheetTextInput moves the sheet out of the keyboard's way on phones, but it calls a TextInput API
// that react-native-web doesn't implement, so web uses a plain TextInput.
const SearchInput = Platform.OS === 'web' ? TextInput : BottomSheetTextInput;

// JavaScript bottom sheet (@gorhom/bottom-sheet). Works on iOS, Android and web.
export function MapSheet({ onSelect }: { onSelect: (place: Place) => void }) {
  const theme = useTheme();
  const sheet = useRef<BottomSheet>(null);
  const { query, setQuery, items, title, resolve } = usePlaceSearch();

  const select = async (item: SheetItem) => {
    Keyboard.dismiss();
    sheet.current?.snapToIndex(Middle);
    try {
      onSelect(await resolve(item));
    } catch (error) {
      console.warn(error);
    }
  };

  const content = (
    <>
      <View style={styles.header}>
        <ThemedView type="backgroundSelected" style={styles.searchBar}>
          <SymbolView
            name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
            tintColor={theme.textSecondary}
            size={18}
          />
          <SearchInput
            value={query}
            onChangeText={setQuery}
            onFocus={(event) => {
              undoFocusScroll(event);
              sheet.current?.snapToIndex(Expanded);
            }}
            placeholder="Search places"
            placeholderTextColor={theme.textSecondary}
            returnKeyType="search"
            autoCorrect={false}
            autoComplete="off"
            textContentType="none"
            style={[styles.input, { color: theme.text }]}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={Spacing.two} accessibilityLabel="Clear search">
              <SymbolView
                name={{ ios: 'xmark.circle.fill', android: 'cancel', web: 'cancel' }}
                tintColor={theme.textSecondary}
                size={18}
              />
            </Pressable>
          )}
        </ThemedView>
      </View>

      <BottomSheetFlatList
        data={items}
        keyExtractor={(item: SheetItem) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
            {title}
          </ThemedText>
        }
        renderItem={({ item }: { item: SheetItem }) => (
          <Pressable
            onPress={() => select(item)}
            onFocus={undoFocusScroll}
            style={({ pressed }) => [styles.row, pressed && { backgroundColor: theme.backgroundSelected }]}>
            <ThemedText numberOfLines={1}>{item.name}</ThemedText>
            {item.address && (
              <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                {item.address}
              </ThemedText>
            )}
          </Pressable>
        )}
      />
    </>
  );

  return (
    <BottomSheet
      ref={sheet}
      index={Middle}
      snapPoints={SnapPoints}
      enableDynamicSizing={false}
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      backgroundComponent={Floating ? FloatingBackground : EdgeBackground}
      handleIndicatorStyle={{ backgroundColor: theme.textSecondary }}>
      {Floating ? <FloatingContent>{content}</FloatingContent> : content}
    </BottomSheet>
  );
}

// 1 at the middle stop and below, easing to 0 as the sheet reaches the expanded stop.
function floatingProgress(animatedIndex: SharedValue<number>) {
  'worklet';
  return interpolate(animatedIndex.value, [Middle, Expanded], [1, 0], Extrapolation.CLAMP);
}

// Glass card that sinks into the screen edges as the sheet expands, turning opaque on the way.
function FloatingBackground({ animatedIndex, animatedPosition }: BottomSheetBackgroundProps) {
  const theme = useTheme();
  const { height } = useWindowDimensions();

  const cardStyle = useAnimatedStyle(() => {
    const inset = EdgeInset * floatingProgress(animatedIndex);
    return { left: inset, right: inset, height: height - animatedPosition.value - inset };
  });
  const opaqueStyle = useAnimatedStyle(() => ({ opacity: 1 - floatingProgress(animatedIndex) }));

  return (
    <Animated.View pointerEvents="none" style={[styles.card, cardStyle]}>
      <NativeConcentricView glass topRadius={FloatingTopRadius} style={StyleSheet.absoluteFill}>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: theme.background }, opaqueStyle]} />
      </NativeConcentricView>
    </Animated.View>
  );
}

// Clips the content to the floating card. The content keeps a fixed size so dragging only resizes
// this wrapper instead of re-laying out the list every frame.
function FloatingContent({ children }: { children: ReactNode }) {
  const { width, height } = useWindowDimensions();
  const { animatedIndex, animatedPosition } = useBottomSheet();

  const clipStyle = useAnimatedStyle(() => {
    const inset = EdgeInset * floatingProgress(animatedIndex);
    return { marginHorizontal: inset, height: height - animatedPosition.value - inset - HandleHeight };
  });

  return (
    <Animated.View style={clipStyle}>
      <NativeConcentricView style={styles.fill}>
        <View style={{ width: width - EdgeInset * 2, height: height * MaxSheetHeight - HandleHeight, alignSelf: 'center' }}>
          {children}
        </View>
      </NativeConcentricView>
    </Animated.View>
  );
}

function EdgeBackground({ style }: BottomSheetBackgroundProps) {
  return <ThemedView type="backgroundElement" style={[style, styles.edgeBackground]} />;
}

// On web, focusing an element in the sheet makes the browser scroll the sheet's clipped container to
// "reveal" it, which knocks the sheet off its snap point. Clipped containers never scroll on purpose, so
// reset them.
function undoFocusScroll(event: { currentTarget: unknown }) {
  if (Platform.OS !== 'web') return;
  let element = (event.currentTarget as HTMLElement).parentElement;
  while (element) {
    if (element.scrollTop && getComputedStyle(element).overflowY === 'hidden') element.scrollTop = 0;
    element = element.parentElement;
  }
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    top: 0,
  },
  fill: {
    flex: 1,
  },
  edgeBackground: {
    borderTopLeftRadius: EdgeTopRadius,
    borderTopRightRadius: EdgeTopRadius,
    boxShadow: '0 -2px 16px rgba(0, 0, 0, 0.12)',
  },
  header: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.four,
  },
  input: {
    flex: 1,
    fontSize: 16,
    outlineWidth: 0,
    paddingVertical: Spacing.two + Spacing.one,
  },
  listContent: {
    paddingBottom: BottomTabInset + Spacing.three,
  },
  sectionTitle: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.one,
  },
  row: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + Spacing.one,
  },
});
