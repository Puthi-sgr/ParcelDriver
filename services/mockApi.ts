// FIX: Implemented mock API service to resolve module not found errors.
import { OFFER_COUNTDOWN_SECONDS } from '../constants';
import {
  Offer,
  Job,
  Settlement,
  Proof,
  DeliveryType,
  ProofType,
  EarningsData,
  Period,
  AccountDetails,
  JobHistoryItem
} from '../types';

// --- Mock Data ---

const createMockJob = (offer: Offer): Job => ({
  id: offer.id,
  pickup: {
    address: offer.pickup,
    contact: 'John Doe - 555-1234',
    notes: 'Pickup from reception. Ask for package #123.',
    itemCount: 3,
    tasks: [
      { label: 'Enter OTP from sender', type: ProofType.OTP, required: true },
      { label: 'Take photo of items', type: ProofType.PHOTO, required: false },
    ],
  },
  dropoff: {
    address: offer.dropoff,
    contact: 'Jane Smith - 555-5678',
    notes: 'Leave at front door if no answer. Beware of dog.',
    deliveryType: DeliveryType.LEAVE_AT_DOOR,
    tasks: [
      { label: 'Take photo of delivery location', type: ProofType.PHOTO, required: false },
      { label: 'Get signature', type: ProofType.SIGNATURE, required: false },
    ],
  },
});

const createMockSettlement = (job: Job): Settlement => ({
    payout: 25.50,
    bonus: 5.00,
    total: 30.50,
});


// --- API Simulation ---

const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// A simple in-memory store to hold the state of our mock objects
let currentOffer: Offer | null = null;
let currentJob: Job | null = null;

export const mockApi = {
  async fetchOffer(): Promise<Offer | null> {
    await apiDelay(1000);
    // 50% chance of getting an offer
    if (Math.random() > 0.5 && !currentOffer && !currentJob) {
      const newOffer: Offer = {
        id: `offer-${Date.now()}`,
        expiresAt: Date.now() + OFFER_COUNTDOWN_SECONDS * 1000,
        estimatedPayout: 25.50,
        pickup: '123 Main St, Anytown, USA',
        dropoff: '456 Oak Ave, Otherville, USA',
      };
      currentOffer = newOffer;
      return newOffer;
    }
    return null;
  },

  async acceptOffer(offerId: string): Promise<Job> {
    await apiDelay(800);
    if (currentOffer?.id !== offerId) {
      throw new Error('Offer expired or invalid.');
    }
    const job = createMockJob(currentOffer);
    currentJob = job;
    currentOffer = null;
    return job;
  },

  async rejectOffer(offerId: string): Promise<void> {
    await apiDelay(300);
    if (currentOffer?.id === offerId) {
      currentOffer = null;
    }
    return;
  },

  async arriveAtPickup(jobId: string): Promise<void> {
    await apiDelay(500);
    if (currentJob?.id !== jobId) throw new Error('Invalid job ID');
    console.log('API: Arrived at pickup for job', jobId);
    return;
  },

  async completePickup(jobId: string, proof: Proof): Promise<void> {
    await apiDelay(1200);
    if (currentJob?.id !== jobId) throw new Error('Invalid job ID');
    console.log('API: Completed pickup for job', jobId, 'with proof:', proof);
    return;
  },

  async arriveAtDropoff(jobId: string): Promise<void> {
    await apiDelay(500);
    if (currentJob?.id !== jobId) throw new Error('Invalid job ID');
    console.log('API: Arrived at dropoff for job', jobId);
    return;
  },

  async completeDropoff(jobId: string, proof: Proof): Promise<Settlement> {
    await apiDelay(1500);
    if (!currentJob || currentJob.id !== jobId) throw new Error('Invalid job ID');
    console.log('API: Completed dropoff for job', jobId, 'with proof:', proof);
    const settlement = createMockSettlement(currentJob);
    currentJob = null;
    return settlement;
  },
  
  async reportIssue(jobId: string, reason: string, evidence?: string): Promise<void> {
      await apiDelay(1000);
      if(currentJob?.id !== jobId) throw new Error('Invalid Job ID');
      console.log('API: Issue reported for job', jobId, {reason, hasEvidence: !!evidence});
      return;
  },

  async fetchEarningsDetails(period: Period): Promise<EarningsData> {
      await apiDelay(1000);
      const multipliers = { today: 1, week: 7, month: 30 };
      const m = multipliers[period];

      return {
          net: 150.75 * m,
          walletBalance: 250.50,
          pending: 30.25 * m,
          codToRemit: period === 'today' ? 15.00 : 0,
          breakdown: {
              gross: 200.00 * m,
              tips: 10.50 * m,
              bonus: 5.00 * m,
              platformFee: 45.00 * m,
              tax: 19.75 * m,
          },
          nextPayout: {
              eta: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
              method: 'Bank Transfer',
              last4: '1234',
          },
      };
  },
  
  async fetchAccountDetails(): Promise<AccountDetails> {
      await apiDelay(1200);
      return {
          profile: {
              id: 'DRV-12345',
              fullName: 'John Doe',
              phone: '(555) 123-4567',
              isPhoneVerified: true,
              email: 'john.doe@example.com',
              dateOfBirth: 'Jan 1, 1990',
              preferredLanguage: 'English',
              photoUrl: 'https://i.pravatar.cc/150?u=johndoe',
          },
          compliance: {
              governmentId: { status: 'verified' },
              driversLicense: { status: 'verified', expiresOn: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() },
              backgroundCheck: { status: 'pending' },
          },
          vehicle: {
              type: 'Sedan',
              plate: 'XYZ 123',
              color: 'Blue',
              hasColdBag: true,
              insurance: { status: 'verified', expiresOn: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString() }, // Expires in 25 days
          },
          performance: {
              lifetimeRating: 4.92,
              recentRating: 4.98,
              completionRate: 98,
              acceptanceRate: 85,
              infractions: [
                  { id: 'inf-1', reason: 'Late pickup', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), isDisputable: true },
              ]
          },
          settings: {
              notifications: {
                  offers: true,
                  chat: true,
                  payouts: false,
              },
              locationPermissionStatus: 'always',
          },
          support: {
              helpCenterUrl: '#',
              phoneLine: '1-800-555-HELP',
              phoneHours: '9am - 5pm MST',
          },
      };
  },

  async fetchJobHistory(): Promise<JobHistoryItem[]> {
      await apiDelay(800);
      return [
          { id: 'job-1', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), payout: 30.50, pickup: '123 Main St', dropoff: '456 Oak Ave', status: 'completed' },
          { id: 'job-2', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), payout: 15.00, pickup: '789 Pine Ln', dropoff: '101 Maple Rd', status: 'completed' },
          { id: 'job-3', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), payout: 0, pickup: '222 Birch Blvd', dropoff: '333 Cedar Ct', status: 'cancelled' },
          { id: 'job-4', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), payout: 22.75, pickup: '444 Elm St', dropoff: '555 Spruce Way', status: 'completed' },
      ];
  }
};