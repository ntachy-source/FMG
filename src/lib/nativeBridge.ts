import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export const isNativeAndroid = (): boolean => {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
};

export const initNativeAndroid = (navigate?: (path: string | number) => void) => {
  if (!Capacitor.isNativePlatform()) return;

  // Status Bar configuration
  try {
    StatusBar.setStyle({ style: Style.Dark });
    StatusBar.setBackgroundColor({ color: '#0f172a' });
  } catch (err) {
    console.debug('StatusBar setup skipped:', err);
  }

  // Android Hardware Back button handling
  try {
    CapApp.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack && navigate) {
        navigate(-1);
      } else {
        CapApp.exitApp();
      }
    });
  } catch (err) {
    console.debug('BackButton setup skipped:', err);
  }
};

export const triggerHaptic = async (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' = 'light') => {
  try {
    if (!Capacitor.isNativePlatform()) return;
    if (type === 'success') {
      await Haptics.notification({ type: NotificationType.Success });
    } else if (type === 'warning') {
      await Haptics.notification({ type: NotificationType.Warning });
    } else {
      const style = type === 'heavy' ? ImpactStyle.Heavy : type === 'medium' ? ImpactStyle.Medium : ImpactStyle.Light;
      await Haptics.impact({ style });
    }
  } catch {}
};
