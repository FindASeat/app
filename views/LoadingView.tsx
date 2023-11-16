import { Animated, StyleSheet } from 'react-native';
import { useEffect, useRef } from 'react';

const LoadingView = ({ is_loading, children }: { is_loading: boolean; children: React.ReactNode }) => {
  console.log('loading view');

  const opacity = useRef(new Animated.Value(0.25)).current;

  useEffect(() => {
    let animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.25,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.75,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.25,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );

    if (is_loading) animation.start();
    else opacity.setValue(1);

    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [is_loading]);

  return <Animated.View style={[StyleSheet.absoluteFill, { opacity }]}>{children}</Animated.View>;
};

export default LoadingView;
