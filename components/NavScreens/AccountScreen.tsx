import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { AccountDetails, Document, Settings } from '../../types';
import Spinner from '../shared/Spinner';
import Button from '../shared/Button';

// Helper component to create styled sections
const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="bg-[var(--color-surface)] rounded-xl shadow-sm">
    <h2 className="p-3 text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider border-b border-[var(--color-border)] bg-slate-50 rounded-t-xl">{title}</h2>
    <div className="p-4 space-y-4">{children}</div>
  </section>
);

// Helper component for a label-value row
const InfoRow: React.FC<{ label: string; children: React.ReactNode; isVertical?: boolean }> = ({ label, children, isVertical = false }) => (
  <div className={`flex ${isVertical ? 'flex-col items-start' : 'justify-between items-center'} text-sm`}>
    <span className="text-[var(--color-text-secondary)] mb-0.5">{label}</span>
    <div className="font-semibold text-right">{children}</div>
  </div>
);

// Helper component to display a status badge
const StatusBadge: React.FC<{ status: Document['status'] }> = ({ status }) => {
    const styleMap = {
        verified: 'bg-green-100 text-green-800 ring-1 ring-green-200',
        pending: 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200',
        expired: 'bg-red-100 text-red-800 ring-1 ring-red-200',
        missing: 'bg-gray-100 text-gray-800 ring-1 ring-gray-200',
    };
    return <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${styleMap[status]}`}>{status}</span>;
}

// Helper component to show expiration dates and warnings
const ExpiryInfo: React.FC<{ doc: Document }> = ({ doc }) => {
    if (!doc.expiresOn) {
        return <StatusBadge status={doc.status} />;
    }
    const expiryDate = new Date(doc.expiresOn);
    const today = new Date();
    const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    const formattedDate = expiryDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

    if (daysLeft <= 0) {
        return <div className="text-center"><StatusBadge status="expired" /><p className="text-xs text-[var(--color-danger)] mt-1">Expired on {formattedDate}</p></div>
    }
    if (daysLeft < 30) {
        return <div className="text-center"><StatusBadge status={doc.status} /><p className="text-xs text-[var(--color-warning)] mt-1 font-bold">Expires in {daysLeft} days</p></div>
    }
    return <div className="text-center"><StatusBadge status={doc.status} /><p className="text-xs text-[var(--color-text-secondary)] mt-1">{formattedDate}</p></div>;
}

// Helper component for toggle switches
const ToggleSwitch: React.FC<{ label: string; enabled: boolean; onToggle: () => void; }> = ({ label, enabled, onToggle }) => (
    <div className="flex justify-between items-center">
        <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
        <button onClick={onToggle} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'}`}>
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

const AccountScreen: React.FC = () => {
    const [account, setAccount] = useState<AccountDetails | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Create a local state for settings to make toggles interactive
    const [settings, setSettings] = useState<Settings['notifications'] | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await mockApi.fetchAccountDetails();
                setAccount(data);
                setSettings(data.settings.notifications);
            } catch (err) {
                console.error("Failed to load account details", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleToggle = (key: keyof Settings['notifications']) => {
        setSettings(prev => prev ? { ...prev, [key]: !prev[key] } : null);
    };

    if (loading) {
        return <div className="flex items-center justify-center h-full bg-[var(--color-background)]"><Spinner /></div>;
    }
    
    if (!account) {
        return <div className="p-8 text-center bg-[var(--color-background)]">Could not load account details.</div>;
    }

    return (
        <div className="bg-[var(--color-background)] h-full">
            <header className="sticky top-0 z-10 p-4 bg-[var(--color-surface)] flex items-center space-x-4 border-b border-[var(--color-border)]">
                <img src={account.profile.photoUrl} alt="Driver" className="w-16 h-16 rounded-full object-cover" />
                <div>
                    <h1 className="text-xl font-bold">{account.profile.fullName}</h1>
                    <p className="text-sm text-[var(--color-text-secondary)]">ID: {account.profile.id}</p>
                </div>
            </header>
            <main className="p-4 space-y-6 pb-8">
                <SectionCard title="Profile & Identity">
                    <InfoRow label="Phone"><div className="flex items-center">{account.profile.phone} {account.profile.isPhoneVerified && <span className="ml-2 text-[var(--color-success)]">✓</span>}</div></InfoRow>
                    <InfoRow label="Email"><span>{account.profile.email}</span></InfoRow>
                    <InfoRow label="Date of Birth"><span>{account.profile.dateOfBirth}</span></InfoRow>
                    <InfoRow label="Language"><span>{account.profile.preferredLanguage}</span></InfoRow>
                </SectionCard>
                
                <SectionCard title="Compliance & Documents">
                    <InfoRow label="Government ID"><StatusBadge status={account.compliance.governmentId.status} /></InfoRow>
                    <InfoRow label="Driver’s License"><ExpiryInfo doc={account.compliance.driversLicense} /></InfoRow>
                    <InfoRow label="Background Check"><StatusBadge status={account.compliance.backgroundCheck.status} /></InfoRow>
                    <InfoRow label="Insurance"><ExpiryInfo doc={account.vehicle.insurance} /></InfoRow>
                </SectionCard>

                <SectionCard title="Vehicle & Equipment">
                    <InfoRow label="Type"><span className="capitalize">{account.vehicle.type}</span></InfoRow>
                    <InfoRow label="Plate"><span>{account.vehicle.plate}</span></InfoRow>
                    <InfoRow label="Color"><span>{account.vehicle.color}</span></InfoRow>
                    <InfoRow label="Cold Bag"><span>{account.vehicle.hasColdBag ? 'Yes' : 'No'}</span></InfoRow>
                </SectionCard>

                <SectionCard title="Ratings & Performance">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div><p className="text-2xl font-bold text-[var(--color-primary)]">{account.performance.lifetimeRating.toFixed(2)}</p><p className="text-xs text-[var(--color-text-secondary)]">Lifetime Rating</p></div>
                        <div><p className="text-2xl font-bold">{account.performance.recentRating.toFixed(2)}</p><p className="text-xs text-[var(--color-text-secondary)]">Recent 100</p></div>
                        <div><p className="text-2xl font-bold">{account.performance.completionRate}%</p><p className="text-xs text-[var(--color-text-secondary)]">Completion</p></div>
                        <div><p className="text-2xl font-bold">{account.performance.acceptanceRate}%</p><p className="text-xs text-[var(--color-text-secondary)]">Acceptance</p></div>
                    </div>
                     {account.performance.infractions.length > 0 && (
                        <div className="pt-4 mt-4 border-t border-[var(--color-border)]">
                            <h3 className="font-semibold text-sm mb-2">Recent Infractions</h3>
                            <div className="space-y-2">
                                {account.performance.infractions.map(inf => (
                                    <div key={inf.id} className="text-xs flex justify-between items-center p-2 bg-red-50 rounded-lg">
                                        <div>
                                            <p className="font-semibold">{inf.reason}</p>
                                            <p className="text-gray-500">{new Date(inf.date).toLocaleDateString()}</p>
                                        </div>
                                        {inf.isDisputable && <button className="text-[var(--color-primary)] font-bold">Dispute</button>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </SectionCard>

                {settings && (
                    <SectionCard title="Settings & Privacy">
                        <ToggleSwitch label="Job Offers" enabled={settings.offers} onToggle={() => handleToggle('offers')} />
                        <ToggleSwitch label="Chat Messages" enabled={settings.chat} onToggle={() => handleToggle('chat')} />
                        <ToggleSwitch label="Payouts" enabled={settings.payouts} onToggle={() => handleToggle('payouts')} />
                        <InfoRow label="Location Permissions"><span className="capitalize text-[var(--color-success)]">{account.settings.locationPermissionStatus}</span></InfoRow>
                    </SectionCard>
                )}

                <SectionCard title="Support">
                    <InfoRow label="Help Center"><a href={account.support.helpCenterUrl} className="text-[var(--color-primary)] font-bold">Open</a></InfoRow>
                    <InfoRow label="Phone Support"><div className="text-right">
                        <p>{account.support.phoneLine}</p>
                        <p className="text-xs text-[var(--color-text-secondary)]">{account.support.phoneHours}</p>
                    </div></InfoRow>
                    <div className="flex gap-4 pt-2">
                        <Button variant="secondary">Chat with Support</Button>
                        <Button variant="primary">Open a Ticket</Button>
                    </div>
                </SectionCard>
            </main>
        </div>
    );
};

export default AccountScreen;