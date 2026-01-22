"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface RewardItem {
    id: string;
    name: string;
    nameTh: string;
    categoryLabel?: string;
    categoryLabelTh?: string;
    colorName?: string;
    colorNameTh?: string;
    sizeName?: string;
    image?: string;
    points: number;
    redeemed: boolean;
}

interface ShippingAddress {
    fullName: string;
    phone: string;
    address: string;
    district: string;
    province: string;
    postalCode: string;
    country: string;
}

interface PartnerCode {
    id: string;
    code: string;
    discountPercent: number;
    expiryDate: string | null;
    maxUses: number | null;
    usedCount: number;
    applicableProducts: "all" | string[];
    isActive: boolean;
    createdAt: string;
}

interface WithdrawalRequest {
    id: string;
    amount: number;
    status: "pending" | "approved" | "rejected" | "completed";
    bankName: string;
    accountNumber: string;
    accountName: string;
    requestedAt: string;
    processedAt?: string;
}

// Partner level configuration - points earned from sales (1 baht = 0.01 points)
interface PartnerLevel {
    level: number;
    pointsRequired: number;
    reward: number;
}

const PARTNER_LEVELS: PartnerLevel[] = [
    { level: 1, pointsRequired: 100, reward: 300 },
    { level: 2, pointsRequired: 300, reward: 1200 },
    { level: 3, pointsRequired: 900, reward: 4500 },
    { level: 4, pointsRequired: 1500, reward: 9000 },
    { level: 5, pointsRequired: 2500, reward: 17500 },
    { level: 6, pointsRequired: 4000, reward: 32000 },
    { level: 7, pointsRequired: 6000, reward: 54000 },
    { level: 8, pointsRequired: 9999, reward: 100000 },
];

interface PartnerRewardClaim {
    id: string;
    level: number;
    pointsUsed: number;
    rewardAmount: number;
    claimedAt: string;
    status: "pending" | "approved" | "completed";
}

interface PartnerInfo {
    isPartner: boolean;
    status: "pending" | "approved" | "rejected";
    affiliateCode: string;
    appliedAt: string;
    approvedAt?: string;
    totalSales: number;
    // Commission system
    totalCommission: number; // Total commission earned
    availableCommission: number; // Commission available to withdraw
    paidCommission: number; // Commission already withdrawn
    commissionRate: number; // Commission rate (e.g., 0.10 = 10%)
    // Points system
    partnerPoints: number; // Points from sales (1 baht = 0.01 points)
    clicks: number;
    conversions: number;
    currentLevel: number; // 1-8
    claimedLevels: number[]; // Levels that have been claimed
    rewardClaims: PartnerRewardClaim[];
    codes: PartnerCode[];
    withdrawals: WithdrawalRequest[];
    bankInfo?: {
        bankName: string;
        accountNumber: string;
        accountName: string;
    };
}

interface UserProfile {
    name: string;
    nickname?: string;
    email: string;
    phone: string;
    avatar?: string;
    memberSince: string;
    memberTier: "Bronze" | "Silver" | "Gold" | "Platinum";
    shippingAddress?: ShippingAddress;
    partnerInfo?: PartnerInfo;
}

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
type OrderType = "purchase" | "redemption";

interface OrderItem {
    id: string;
    name: string;
    nameTh: string;
    image?: string;
    quantity: number;
    price?: number;
    points?: number;
    color?: string;
    colorTh?: string;
    size?: string;
}

interface Order {
    id: string;
    type: OrderType;
    items: OrderItem[];
    status: OrderStatus;
    totalPrice?: number;
    totalPoints?: number;
    createdAt: string;
    updatedAt: string;
    trackingNumber?: string;
    shippingAddress?: ShippingAddress;
}

export type { UserProfile, ShippingAddress, Order, OrderItem, OrderStatus, OrderType, PartnerInfo, PartnerCode, WithdrawalRequest, PartnerLevel, PartnerRewardClaim };
export { PARTNER_LEVELS };

interface UserContextType {
    // Auth
    isLoggedIn: boolean;
    userProfile: UserProfile | null;
    login: (email: string, password: string, name?: string, phone?: string) => boolean;
    logout: () => void;
    updateProfile: (updates: Partial<UserProfile>) => void;
    updateAvatar: (avatarUrl: string) => void;
    updateShippingAddress: (address: ShippingAddress) => void;

    // Points
    totalPoints: number;
    usedPoints: number;
    availablePoints: number;

    // Redeemed rewards
    redeemedRewards: RewardItem[];

    // Orders
    orders: Order[];
    addOrder: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => void;
    updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;

    // Partner
    applyForPartner: (affiliateCode: string) => void;
    approvePartner: () => void;
    createPartnerCode: (code: Omit<PartnerCode, "id" | "createdAt" | "usedCount">) => void;
    updatePartnerCode: (codeId: string, updates: Partial<PartnerCode>) => void;
    deletePartnerCode: (codeId: string) => void;
    requestWithdrawal: (amount: number, bankInfo: { bankName: string; accountNumber: string; accountName: string }) => void;
    claimPartnerReward: (level: number) => boolean;
    getPartnerLevelInfo: () => { currentLevel: number; nextLevel: PartnerLevel | null; progress: number; availableToClaim: PartnerLevel[] };

    // Actions
    redeemReward: (reward: Omit<RewardItem, "redeemed">) => boolean;
    unredeemReward: (rewardId: string) => void;
    removeReward: (rewardId: string) => void;
    clearRedeemedRewards: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_POINTS_KEY = "reach-user-points";
const REDEEMED_REWARDS_KEY = "reach-redeemed-rewards";
const USER_PROFILE_KEY = "reach-user-profile";
const IS_LOGGED_IN_KEY = "reach-is-logged-in";
const USER_ORDERS_KEY = "reach-user-orders";

export function UserProvider({ children }: { children: ReactNode }) {
    // Auth state
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    // Total points the user has (would come from API in real app)
    const [totalPoints, setTotalPoints] = useState(12500);
    const [redeemedRewards, setRedeemedRewards] = useState<RewardItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            // Load login state
            const savedLoggedIn = localStorage.getItem(IS_LOGGED_IN_KEY);
            if (savedLoggedIn === "true") {
                setIsLoggedIn(true);
            }

            // Load user profile
            const savedProfile = localStorage.getItem(USER_PROFILE_KEY);
            if (savedProfile) {
                setUserProfile(JSON.parse(savedProfile));
            }

            // Load saved points
            const savedPoints = localStorage.getItem(USER_POINTS_KEY);
            if (savedPoints) {
                setTotalPoints(parseInt(savedPoints, 10));
            }

            // Load redeemed rewards
            const savedRewards = localStorage.getItem(REDEEMED_REWARDS_KEY);
            if (savedRewards) {
                setRedeemedRewards(JSON.parse(savedRewards));
            }

            // Load orders
            const savedOrders = localStorage.getItem(USER_ORDERS_KEY);
            if (savedOrders) {
                setOrders(JSON.parse(savedOrders));
            }
        } catch (error) {
            console.error("Failed to load user data:", error);
        }

        setIsLoaded(true);
    }, []);

    // Save to localStorage when data changes
    useEffect(() => {
        if (!isLoaded || typeof window === "undefined") return;

        localStorage.setItem(USER_POINTS_KEY, totalPoints.toString());
        localStorage.setItem(REDEEMED_REWARDS_KEY, JSON.stringify(redeemedRewards));
        localStorage.setItem(IS_LOGGED_IN_KEY, isLoggedIn.toString());
        localStorage.setItem(USER_ORDERS_KEY, JSON.stringify(orders));
        if (userProfile) {
            localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userProfile));
        }
    }, [totalPoints, redeemedRewards, isLoaded, isLoggedIn, userProfile, orders]);

    // Login function
    const login = (email: string, password: string, name?: string, phone?: string): boolean => {
        // In a real app, this would validate against an API
        // For demo purposes, we accept any login
        if (!email || !password) return false;

        const profile: UserProfile = {
            name: name || email.split("@")[0],
            email,
            phone: phone || "",
            memberSince: new Date().toISOString().split("T")[0],
            memberTier: "Silver",
        };

        setUserProfile(profile);
        setIsLoggedIn(true);
        return true;
    };

    // Logout function
    const logout = () => {
        setIsLoggedIn(false);
        setUserProfile(null);
        localStorage.removeItem(USER_PROFILE_KEY);
        localStorage.setItem(IS_LOGGED_IN_KEY, "false");
    };

    // Update profile function
    const updateProfile = (updates: Partial<UserProfile>) => {
        if (!userProfile) return;
        setUserProfile({ ...userProfile, ...updates });
    };

    // Update avatar function
    const updateAvatar = (avatarUrl: string) => {
        if (!userProfile) return;
        setUserProfile({ ...userProfile, avatar: avatarUrl });
    };

    // Update shipping address function
    const updateShippingAddress = (address: ShippingAddress) => {
        if (!userProfile) return;
        setUserProfile({ ...userProfile, shippingAddress: address });
    };

    // Calculate used points from redeemed rewards
    const usedPoints = redeemedRewards
        .filter(r => r.redeemed)
        .reduce((sum, r) => sum + r.points, 0);

    const availablePoints = totalPoints - usedPoints;

    // Redeem a reward
    const redeemReward = (reward: Omit<RewardItem, "redeemed">): boolean => {
        if (reward.points > availablePoints) {
            return false;
        }

        setRedeemedRewards(prev => {
            // Check if already exists
            const existing = prev.find(r => r.id === reward.id);
            if (existing) {
                // Toggle redeemed status
                return prev.map(r =>
                    r.id === reward.id ? { ...r, redeemed: true } : r
                );
            }
            // Add new reward
            return [...prev, { ...reward, redeemed: true }];
        });

        return true;
    };

    // Un-redeem a reward (keep in list but mark as not redeemed)
    const unredeemReward = (rewardId: string) => {
        setRedeemedRewards(prev =>
            prev.map(r => r.id === rewardId ? { ...r, redeemed: false } : r)
        );
    };

    // Remove a reward completely from the list
    const removeReward = (rewardId: string) => {
        setRedeemedRewards(prev => prev.filter(r => r.id !== rewardId));
    };

    // Clear all redeemed rewards
    const clearRedeemedRewards = () => {
        setRedeemedRewards([]);
    };

    // Add a new order
    const addOrder = (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => {
        const now = new Date().toISOString();
        const newOrder: Order = {
            ...order,
            id: `ORD-${Date.now()}`,
            createdAt: now,
            updatedAt: now,
        };
        setOrders(prev => [newOrder, ...prev]);
    };

    // Update order status
    const updateOrderStatus = (orderId: string, status: OrderStatus, trackingNumber?: string) => {
        setOrders(prev =>
            prev.map(order =>
                order.id === orderId
                    ? {
                          ...order,
                          status,
                          trackingNumber: trackingNumber || order.trackingNumber,
                          updatedAt: new Date().toISOString(),
                      }
                    : order
            )
        );
    };

    // Apply for partner program
    const applyForPartner = (affiliateCode: string) => {
        if (!userProfile) return;

        const defaultCode: PartnerCode = {
            id: `CODE-${Date.now()}`,
            code: `${affiliateCode.toUpperCase()}10`,
            discountPercent: 10,
            expiryDate: null,
            maxUses: null,
            usedCount: 0,
            applicableProducts: "all",
            isActive: true,
            createdAt: new Date().toISOString(),
        };

        const partnerInfo: PartnerInfo = {
            isPartner: true,
            status: "pending",
            affiliateCode: affiliateCode.toUpperCase(),
            appliedAt: new Date().toISOString(),
            totalSales: 0,
            // Commission
            totalCommission: 0,
            availableCommission: 0,
            paidCommission: 0,
            commissionRate: 0.10, // 10% default
            // Points
            partnerPoints: 0,
            clicks: 0,
            conversions: 0,
            currentLevel: 0,
            claimedLevels: [],
            rewardClaims: [],
            codes: [defaultCode],
            withdrawals: [],
        };

        setUserProfile({ ...userProfile, partnerInfo });
    };

    // Approve partner (for demo - auto approve)
    const approvePartner = () => {
        if (!userProfile?.partnerInfo) return;

        // Ensure codes array exists
        const existingCodes = userProfile.partnerInfo.codes || [];
        const codes = existingCodes.length > 0 ? existingCodes : [{
            id: `CODE-${Date.now()}`,
            code: `${userProfile.partnerInfo.affiliateCode}10`,
            discountPercent: 10,
            expiryDate: null,
            maxUses: null,
            usedCount: 0,
            applicableProducts: "all" as const,
            isActive: true,
            createdAt: new Date().toISOString(),
        }];

        // Demo data: random sales between 5000-55000 baht
        const demoSales = Math.floor(Math.random() * 50000) + 5000;
        // Points = sales * 0.01
        const demoPoints = demoSales * 0.01;
        // Commission = sales * 10%
        const commissionRate = 0.10;
        const demoCommission = demoSales * commissionRate;
        const demoPaidCommission = Math.floor(demoCommission * 0.6); // 60% already paid
        const demoAvailableCommission = demoCommission - demoPaidCommission;

        setUserProfile({
            ...userProfile,
            partnerInfo: {
                ...userProfile.partnerInfo,
                status: "approved",
                approvedAt: new Date().toISOString(),
                codes,
                withdrawals: userProfile.partnerInfo.withdrawals || [],
                rewardClaims: userProfile.partnerInfo.rewardClaims || [],
                claimedLevels: userProfile.partnerInfo.claimedLevels || [],
                // Demo data
                clicks: Math.floor(Math.random() * 500) + 100,
                conversions: Math.floor(Math.random() * 50) + 10,
                totalSales: demoSales,
                // Commission
                totalCommission: demoCommission,
                availableCommission: demoAvailableCommission,
                paidCommission: demoPaidCommission,
                commissionRate,
                // Points
                partnerPoints: demoPoints,
                currentLevel: PARTNER_LEVELS.filter(l => demoPoints >= l.pointsRequired).length,
            },
        });
    };

    // Create new partner code
    const createPartnerCode = (code: Omit<PartnerCode, "id" | "createdAt" | "usedCount">) => {
        if (!userProfile?.partnerInfo) return;

        const newCode: PartnerCode = {
            ...code,
            id: `CODE-${Date.now()}`,
            usedCount: 0,
            createdAt: new Date().toISOString(),
        };

        const existingCodes = userProfile.partnerInfo.codes || [];

        setUserProfile({
            ...userProfile,
            partnerInfo: {
                ...userProfile.partnerInfo,
                codes: [...existingCodes, newCode],
            },
        });
    };

    // Update partner code
    const updatePartnerCode = (codeId: string, updates: Partial<PartnerCode>) => {
        if (!userProfile?.partnerInfo) return;

        const existingCodes = userProfile.partnerInfo.codes || [];

        setUserProfile({
            ...userProfile,
            partnerInfo: {
                ...userProfile.partnerInfo,
                codes: existingCodes.map(code =>
                    code.id === codeId ? { ...code, ...updates } : code
                ),
            },
        });
    };

    // Delete partner code
    const deletePartnerCode = (codeId: string) => {
        if (!userProfile?.partnerInfo) return;

        const existingCodes = userProfile.partnerInfo.codes || [];

        setUserProfile({
            ...userProfile,
            partnerInfo: {
                ...userProfile.partnerInfo,
                codes: existingCodes.filter(code => code.id !== codeId),
            },
        });
    };

    // Request withdrawal from available commission
    const requestWithdrawal = (amount: number, bankInfo: { bankName: string; accountNumber: string; accountName: string }) => {
        if (!userProfile?.partnerInfo) return;

        const availableCommission = userProfile.partnerInfo.availableCommission || 0;
        if (amount > availableCommission) return; // Can't withdraw more than available

        const withdrawal: WithdrawalRequest = {
            id: `WD-${Date.now()}`,
            amount,
            status: "pending",
            ...bankInfo,
            requestedAt: new Date().toISOString(),
        };

        const existingWithdrawals = userProfile.partnerInfo.withdrawals || [];

        setUserProfile({
            ...userProfile,
            partnerInfo: {
                ...userProfile.partnerInfo,
                availableCommission: availableCommission - amount,
                paidCommission: (userProfile.partnerInfo.paidCommission || 0) + amount,
                withdrawals: [withdrawal, ...existingWithdrawals],
                bankInfo,
            },
        });
    };

    // Get partner level info
    const getPartnerLevelInfo = () => {
        if (!userProfile?.partnerInfo) {
            return { currentLevel: 0, nextLevel: PARTNER_LEVELS[0], progress: 0, availableToClaim: [] };
        }

        const points = userProfile.partnerInfo.partnerPoints || 0;
        const claimedLevels = userProfile.partnerInfo.claimedLevels || [];

        // Find current level (highest level achieved)
        let currentLevel = 0;
        for (const level of PARTNER_LEVELS) {
            if (points >= level.pointsRequired) {
                currentLevel = level.level;
            }
        }

        // Find next level
        const nextLevel = PARTNER_LEVELS.find(l => points < l.pointsRequired) || null;

        // Calculate progress to next level
        let progress = 0;
        if (nextLevel) {
            const prevLevelPoints = currentLevel > 0
                ? PARTNER_LEVELS[currentLevel - 1].pointsRequired
                : 0;
            progress = ((points - prevLevelPoints) / (nextLevel.pointsRequired - prevLevelPoints)) * 100;
        } else {
            progress = 100;
        }

        // Find levels available to claim (achieved but not yet claimed)
        const availableToClaim = PARTNER_LEVELS.filter(
            l => points >= l.pointsRequired && !claimedLevels.includes(l.level)
        );

        return { currentLevel, nextLevel, progress: Math.min(progress, 100), availableToClaim };
    };

    // Claim partner reward - adds reward to available commission
    const claimPartnerReward = (level: number): boolean => {
        if (!userProfile?.partnerInfo) return false;

        const levelInfo = PARTNER_LEVELS.find(l => l.level === level);
        if (!levelInfo) return false;

        const points = userProfile.partnerInfo.partnerPoints || 0;
        const claimedLevels = userProfile.partnerInfo.claimedLevels || [];

        // Check if level is achievable and not already claimed
        if (points < levelInfo.pointsRequired || claimedLevels.includes(level)) {
            return false;
        }

        const claim: PartnerRewardClaim = {
            id: `CLAIM-${Date.now()}`,
            level,
            pointsUsed: levelInfo.pointsRequired,
            rewardAmount: levelInfo.reward,
            claimedAt: new Date().toISOString(),
            status: "completed", // Auto-complete and add to commission
        };

        const existingClaims = userProfile.partnerInfo.rewardClaims || [];
        const currentAvailableCommission = userProfile.partnerInfo.availableCommission || 0;
        const currentTotalCommission = userProfile.partnerInfo.totalCommission || 0;

        setUserProfile({
            ...userProfile,
            partnerInfo: {
                ...userProfile.partnerInfo,
                claimedLevels: [...claimedLevels, level],
                rewardClaims: [claim, ...existingClaims],
                // Add reward to commission
                availableCommission: currentAvailableCommission + levelInfo.reward,
                totalCommission: currentTotalCommission + levelInfo.reward,
            },
        });

        return true;
    };

    return (
        <UserContext.Provider
            value={{
                isLoggedIn,
                userProfile,
                login,
                logout,
                updateProfile,
                updateAvatar,
                updateShippingAddress,
                totalPoints,
                usedPoints,
                availablePoints,
                redeemedRewards,
                orders,
                addOrder,
                updateOrderStatus,
                applyForPartner,
                approvePartner,
                createPartnerCode,
                updatePartnerCode,
                deletePartnerCode,
                requestWithdrawal,
                claimPartnerReward,
                getPartnerLevelInfo,
                redeemReward,
                unredeemReward,
                removeReward,
                clearRedeemedRewards,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
