export interface RegisterUserInfo {
  userId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  preferredName?: string;
  dateOfBirth: string;
  phone?: string;
  email: string;
  addresses: RegisterAddresses[];
}

export interface RegisterAddresses {
  addressId: string;
  addressLine1: string;
  addressLine2?: string;
  apt?: string;
  city?: string;
  state: string;
  zipcode: string;
  isPrimaryAddress?: boolean;
}
