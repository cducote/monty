import * as Font from 'expo-font';

export const loadFonts = async () => {
  await Font.loadAsync({
    'Modak-Regular': require('../../assets/fonts/Modak-Regular.ttf'),
  });
};

export const fonts = {
  modak: 'Modak-Regular',
};
