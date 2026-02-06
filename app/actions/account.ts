'use server';

export interface AddressData {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PaymentMethodData {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

export async function addAddress(data: AddressData) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log('Adding address:', data);
  return { success: true, message: 'Address added successfully' };
}

export async function addPaymentMethod(data: PaymentMethodData) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log('Adding payment method:', data);
  return { success: true, message: 'Payment method added successfully' };
}
