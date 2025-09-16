import React from 'react';
import { DriverState, AppContext } from '../../types';

// Import all the screens for each state
import OfflineScreen from './StateScreens/OfflineScreen';
import IdleScreen from './StateScreens/IdleScreen';
import OfferingScreen from './StateScreens/OfferingScreen';
import AssignedScreen from './StateScreens/AssignedScreen';
import AtPickupScreen from './StateScreens/AtPickupScreen';
import InTransitScreen from './StateScreens/InTransitScreen';
import AtDropoffScreen from './StateScreens/AtDropoffScreen';
import CompletedScreen from './StateScreens/CompletedScreen';
import ExceptionScreen from './StateScreens/ExceptionScreen';

import Header from './shared/Header';
import ErrorBanner from './shared/ErrorBanner';

interface JobScreenProps {
  state: DriverState;
  context: AppContext;
  transition: (event: string, payload?: any) => void;
}

const JobScreen: React.FC<JobScreenProps> = ({ state, context, transition }) => {
  const renderStateScreen = () => {
    switch (state) {
      case DriverState.OFFLINE:
        return <OfflineScreen transition={transition} context={context} />;
      case DriverState.IDLE:
        return <IdleScreen transition={transition} context={context} />;
      case DriverState.OFFERING:
        return <OfferingScreen transition={transition} context={context} />;
      case DriverState.ASSIGNED:
        return <AssignedScreen transition={transition} context={context} />;
      case DriverState.AT_PICKUP:
        return <AtPickupScreen transition={transition} context={context} />;
      case DriverState.IN_TRANSIT:
        return <InTransitScreen transition={transition} context={context} />;
      case DriverState.AT_DROPOFF:
        return <AtDropoffScreen transition={transition} context={context} />;
      case DriverState.COMPLETED:
        return <CompletedScreen transition={transition} context={context} />;
      case DriverState.EXCEPTION_HANDLING:
        return <ExceptionScreen transition={transition} context={context} />;
      default:
        return <div className="p-4 text-center">Unknown state: {state}</div>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header state={state} loading={context.loading} />
      <ErrorBanner message={context.error || ''} />
      <div className="flex-grow overflow-y-auto">
        {renderStateScreen()}
      </div>
    </div>
  );
};

export default JobScreen;
