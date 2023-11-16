import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

const LoadingView = ({
  is_loading,
  children,
  multiplier = 1,
}: {
  multiplier?: number;
  is_loading: boolean;
  children: React.ReactNode;
}) => {
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
          duration: 500 * multiplier,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.25,
          duration: 500 * multiplier,
          useNativeDriver: true,
        }),
      ]),
    );

    if (is_loading) animation.start();
    else opacity.setValue(1);

    return () => {
      if (animation) animation.stop();
    };
  }, [is_loading]);

  return <Animated.View style={[{ opacity, width: '100%', height: '100%' }]}>{children}</Animated.View>;
};

export default LoadingView;
