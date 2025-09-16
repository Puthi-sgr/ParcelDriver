
import { useState, useCallback } from 'react';
import { DriverState, AppContext } from '../types';

const stateMachineConfig = {
  initial: DriverState.OFFLINE,
  states: {
    [DriverState.OFFLINE]: {
      on: {
        GO_ONLINE: DriverState.IDLE,
      },
    },
    [DriverState.IDLE]: {
      on: {
        RECEIVE_OFFER: DriverState.OFFERING,
        GO_OFFLINE: DriverState.OFFLINE,
      },
    },
    [DriverState.OFFERING]: {
      on: {
        ACCEPT_OFFER: DriverState.ASSIGNED,
        REJECT_OFFER: DriverState.IDLE,
        TIMEOUT_OFFER: DriverState.IDLE,
      },
    },
    [DriverState.ASSIGNED]: {
      on: {
        ARRIVE_AT_PICKUP: DriverState.AT_PICKUP,
        REPORT_ISSUE: DriverState.EXCEPTION_HANDLING,
      },
    },
    [DriverState.AT_PICKUP]: {
      on: {
        COMPLETE_PICKUP: DriverState.IN_TRANSIT,
        REPORT_ISSUE: DriverState.EXCEPTION_HANDLING,
      },
    },
    [DriverState.IN_TRANSIT]: {
      on: {
        ARRIVE_AT_DROPOFF: DriverState.AT_DROPOFF,
        REPORT_ISSUE: DriverState.EXCEPTION_HANDLING,
      },
    },
    [DriverState.AT_DROPOFF]: {
      on: {
        COMPLETE_DELIVERY: DriverState.COMPLETED,
        REPORT_ISSUE: DriverState.EXCEPTION_HANDLING,
      },
    },
    [DriverState.EXCEPTION_HANDLING]: {
        on: {
            RESOLVE_ISSUE: DriverState.IDLE, // Or could go to another state
        }
    },
    [DriverState.COMPLETED]: {
      on: {
        ACKNOWLEDGE_SETTLEMENT: DriverState.IDLE,
      },
    },
  },
};

export const useStateMachine = () => {
  const [state, setState] = useState<DriverState>(stateMachineConfig.initial);
  const [context, setContext] = useState<AppContext>({});

  const transition = useCallback((event: string, contextUpdater?: (ctx: AppContext) => AppContext) => {
    const currentStateConfig = stateMachineConfig.states[state];
    const nextState = currentStateConfig?.on?.[event];
    
    if (nextState) {
      setState(nextState);
      if (contextUpdater) {
        setContext(contextUpdater);
      }
      return nextState;
    }
    
    console.warn(`Invalid transition: ${event} from state ${state}`);
    return null;
  }, [state]);

  return { state, context, transition, setContext };
};
