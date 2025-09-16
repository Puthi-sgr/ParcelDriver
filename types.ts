// FIX: Populated types file to resolve import errors.
export enum DriverState {
  OFFLINE = 'OFFLINE',
  IDLE = 'IDLE',
  OFFERING = 'OFFERING',
  ASSIGNED = 'ASSIGNED',
  AT_PICKUP = 'AT_PICKUP',
  IN_TRANSIT = 'IN_TRANSIT',
  AT_DROPOFF = 'AT_DROPOFF',
  COMPLETED = 'COMPLETED',
  EXCEPTION_HANDLING = 'EXCEPTION_HANDLING',
}

export enum ProofType {
  OTP = 'OTP',
  PHOTO = 'PHOTO',
  SIGNATURE = 'SIGNATURE',
}

export enum DeliveryType {
  HAND_TO_CUSTOMER = 'HAND_TO_CUSTOMER',
  LEAVE_AT_DOOR = 'LEAVE_AT_DOOR',
}

export interface Task {
  label: string;
  type: ProofType;
  required: boolean;
}

export interface Proof {
  otp?: string;
  photos?: string[];
  signature?: string;
}

export interface Offer {
  id: string;
  expiresAt: number;
  estimatedPayout: number;
  pickup: string;
  dropoff: string;
}

export interface LocationDetails {
  address: string;
  contact: string;
  notes: string;
}

export interface PickupDetails extends LocationDetails {
  itemCount: number;
  tasks: Task[];
}

export interface DropoffDetails extends LocationDetails {
  deliveryType: DeliveryType;
  tasks: Task[];
}

export interface Job {
  id: string;
  pickup: PickupDetails;
  dropoff: DropoffDetails;
}

export interface Settlement {
  payout: number;
  bonus: number;
  total: number;
}

export interface Issue {
  reason: string;
  resolution: string;
}

export interface AppContext {
  offer?: Offer;
  job?: Job;
  settlement?: Settlement;
  issue?: Issue;
  error?: string;
  loading?: boolean;
}

export type Period = 'today' | 'week' | 'month';

export interface EarningsData {
  net: number;
  walletBalance: number;
  pending: number;
  codToRemit: number;
  breakdown: {
    gross: number;
    tips: number;
    bonus: number;
    platformFee: number;
    tax: number;
  };
  nextPayout: {
    eta: string;
    method: string;
    last4: string;
  };
}

export interface Document {
  status: 'verified' | 'pending' | 'expired' | 'missing';
  expiresOn?: string;
}

export interface Settings {
  notifications: {
    offers: boolean;
    chat: boolean;
    payouts: boolean;
  };
  locationPermissionStatus: string;
}

export interface Infraction {
  id: string;
  reason: string;
  date: string;
  isDisputable: boolean;
}

export interface AccountDetails {
  profile: {
    id: string;
    fullName: string;
    phone: string;
    isPhoneVerified: boolean;
    email: string;
    dateOfBirth: string;
    preferredLanguage: string;
    photoUrl: string;
  };
  compliance: {
    governmentId: Document;
    driversLicense: Document;
    backgroundCheck: Document;
  };
  vehicle: {
    type: string;
    plate: string;
    color: string;
    hasColdBag: boolean;
    insurance: Document;
  };
  performance: {
    lifetimeRating: number;
    recentRating: number;
    completionRate: number;
    acceptanceRate: number;
    infractions: Infraction[];
  };
  settings: Settings;
  support: {
    helpCenterUrl: string;
    phoneLine: string;
    phoneHours: string;
  };
}

export interface JobHistoryItem {
  id: string;
  date: string;
  payout: number;
  pickup: string;
  dropoff: string;
  status: 'completed' | 'cancelled';
}
