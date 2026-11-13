
import React from 'react';
import { useSessionUser } from '../services/api';
import { ProviderHistoryView } from './history/ProviderHistoryView';
import { CustomerHistoryView } from './history/CustomerHistoryView';

export const RiwayatScreen: React.FC = () => {
  const { isPenyediaJasa } = useSessionUser();

  if (isPenyediaJasa) {
    return <ProviderHistoryView />;
  }

  return <CustomerHistoryView />;
};
