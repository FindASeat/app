import { get_building } from '../../../../firebase/firebase_api';
import { useGlobal } from '../../../../context/GlobalContext';
import BuildingView from '../../../../views/BuildingView';
import ErrorView from '../../../../views/ErrorView';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

const building = () => {
  console.log('building page');

  const { code } = useLocalSearchParams() as { code: string | undefined };
  const { selectedBuilding, setSelectedBuilding } = useGlobal();

  useEffect(() => {
    if (code) get_building(code).then(setSelectedBuilding);
    else if (selectedBuilding) get_building(selectedBuilding?.code).then(setSelectedBuilding);
  }, []);

  if (!code && !selectedBuilding?.code) return <ErrorView />;
  return <BuildingView />;
};

export default building;
