import { requireNativeView, requireOptionalNativeModule } from 'expo';
import type { ComponentType } from 'react';
import type { ViewProps } from 'react-native';

export type ConcentricViewProps = ViewProps & {
  /** Draws a Liquid Glass background beneath the children. */
  glass?: boolean;
  /** Radius of the top corners; the bottom corners are always concentric with the screen. */
  topRadius?: number;
};

const ConcentricViewModule = requireOptionalNativeModule<{ isSupported: boolean }>('ConcentricView');

/** True on iOS 26+ builds that include this module; false on Android, web and older iOS. */
export const isConcentricSupported = ConcentricViewModule?.isSupported ?? false;

/** Only available when `isConcentricSupported` is true. */
export const ConcentricView: ComponentType<ConcentricViewProps> | null = isConcentricSupported
  ? requireNativeView<ConcentricViewProps>('ConcentricView')
  : null;
