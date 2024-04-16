
export type DataItem = {
    _id: string;
    lot: string;
    camera: string;
    plateNumber: string;
    plate: string
    vehicle: string;
    direction: string;
    time: string;
}


export type PermitType = {
    id: string;
    name: string;
    reason: string;
    plate: string;
}

export type LotType = {
    _id: string;
    token: string;
    cover: string;
    siteCode: string;
    url: string;
    owners: string[];
}

export type UserType = {
    uid: string,
    email: string,
    emailVerified: boolean,
    disabled: boolean,
    displayName?: string,
    photoURL?: string,
    customClaims?: {
        admin?: boolean,
    },
    metadata: {
        lastSignInTime: string,
        creationTime: string,
        lastRefreshTime: string
    },
    passwordHash?: string,
    passwordSalt?: string,
}

export interface ConsolidatedRecord {
    _id: string;
    lot: string;
    camera: string;
    plateNumber: string;
    plate: string;
    vehicle1: string;
    vehicle2?: string;
    direction: string;
    entryTime?: string;
    exitTime?: string;
  }