import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface BinState {
    id: string;
    alerts: Array<AlertEntry>;
    fillLevel: bigint;
    lastCollected: Time;
    location: string;
}
export interface CollectionLogEntry {
    time: Time;
    collectedBy: Principal;
    fillLevelBefore: bigint;
    binId: string;
}
export interface AlertEntry {
    resolved: boolean;
    level: bigint;
    timestamp: Time;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAlert(binId: string, level: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    dispatchCollection(binId: string): Promise<void>;
    getAllBins(): Promise<Array<BinState>>;
    getBinState(binId: string): Promise<BinState | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCollectionLog(): Promise<Array<CollectionLogEntry>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateBinFillLevel(binId: string, newLevel: bigint): Promise<void>;
}
