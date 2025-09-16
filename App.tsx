import React, { useEffect, useCallback, useState } from 'react';
import { useStateMachine } from './hooks/useStateMachine';
import { mockApi } from './services/mockApi';
import JobScreen from './components/JobScreen';
import HistoryScreen from './components/NavScreens/HistoryScreen';
import EarningsScreen from './components/NavScreens/EarningsScreen';
import AccountScreen from './components/NavScreens/AccountScreen';
import NavigationBar from './components/shared/NavigationBar';
import { AppContext, DriverState, Job, Offer, Proof } from './types';

export type View = 'job' | 'history' | 'earnings' | 'account';

const App: React.FC = () => {
  const { state, context, transition, setContext } = useStateMachine();
  const [activeView, setActiveView] = useState<View>('job');

  const handleTransition = useCallback(async (event: string, payload?: any) => {
    setContext(ctx => ({ ...ctx, error: undefined, loading: true }));
    try {
      let newContext: Partial<AppContext> = {};

      // FIX: The application logic was flawed, attempting state transitions before API calls
      // and using an incorrect second transition call. This has been refactored to perform API
      // calls first, ensuring the UI state only changes on a successful operation.
      switch (event) {
        case 'ACCEPT_OFFER':
          const job = await mockApi.acceptOffer(context.offer!.id);
          newContext = { job, offer: undefined };
          break;
        case 'REJECT_OFFER':
        case 'TIMEOUT_OFFER':
          await mockApi.rejectOffer(context.offer!.id);
          newContext = { offer: undefined };
          break;
        case 'ARRIVE_AT_PICKUP':
          await mockApi.arriveAtPickup(context.job!.id);
          break;
        case 'COMPLETE_PICKUP':
          await mockApi.completePickup(context.job!.id, payload as Proof);
          break;
        case 'ARRIVE_AT_DROPOFF':
          await mockApi.arriveAtDropoff(context.job!.id);
          break;
        case 'COMPLETE_DELIVERY':
          const settlement = await mockApi.completeDropoff(context.job!.id, payload as Proof);
          newContext = { settlement };
          break;
        case 'REPORT_ISSUE':
            // FIX: The 'REPORT_ISSUE' event is overloaded. This block now only handles the API call
            // when submitting the form from the ExceptionScreen (which provides a payload).
            // Transitions to the ExceptionScreen do not have a payload and will skip this.
            if (payload?.reason) {
                await mockApi.reportIssue(context.job!.id, payload.reason, payload.evidence);
                newContext = { issue: { reason: payload.reason, resolution: 'Return to Sender' } };
            }
            break;
        case 'ACKNOWLEDGE_SETTLEMENT':
        case 'RESOLVE_ISSUE':
          newContext = { job: undefined, settlement: undefined, issue: undefined };
          break;
        default:
          break;
      }
      
      // FIX: If submitting an issue report, we update the context but don't change state.
      // Otherwise, we perform the state transition after the API call is successful.
      if (event === 'REPORT_ISSUE' && state === DriverState.EXCEPTION_HANDLING) {
        setContext(ctx => ({...ctx, ...newContext, loading: false }));
      } else {
        const nextState = transition(event, (ctx) => ({...ctx, ...newContext, loading: false }));
        if (!nextState) {
          throw new Error(`Invalid transition: ${event} from ${state}`);
        }
      }

    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error(message);
        setContext(ctx => ({ ...ctx, error: message, loading: false }));
        // Do not transition, stay in the current state on error
    }
  }, [state, context, transition, setContext]);

  useEffect(() => {
    // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setInterval> for browser compatibility.
    let interval: ReturnType<typeof setInterval>;
    if (state === DriverState.IDLE && !context.offer) {
      interval = setInterval(async () => {
        try {
          const offer = await mockApi.fetchOffer();
          if (offer) {
            setContext(ctx => ({ ...ctx, offer }));
            transition('RECEIVE_OFFER');
          }
        } catch (error) {
          console.error("Failed to fetch offer:", error);
        }
      }, 2000); // Check for new offers every 2 seconds
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, context.offer, setContext]);

  const renderContent = () => {
    switch (activeView) {
      case 'history': return <HistoryScreen />;
      case 'earnings': return <EarningsScreen />;
      case 'account': return <AccountScreen />;
      case 'job':
      default:
        return <JobScreen state={state} context={context} transition={handleTransition} />;
    }
  };

  return (
    <div className="w-full h-screen bg-[var(--color-background)] font-sans flex items-center justify-center p-0 md:p-4">
      <div className="w-full max-w-sm h-full md:h-[95vh] md:max-h-[800px] bg-[var(--color-surface)] md:rounded-2xl shadow-xl flex flex-col overflow-hidden">
        <div className="flex-grow relative overflow-y-auto">
          {renderContent()}
        </div>
        <NavigationBar activeView={activeView} onNavigate={setActiveView} />
      </div>
    </div>
  );
};

export default App;