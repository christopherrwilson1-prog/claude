// Budget Categories and Constants

export const INCOME_CATEGORIES = [
  { value: 'student_government_allocation', label: 'Student Government Allocation' },
  { value: 'fundraising', label: 'Fundraising' },
  { value: 'membership_dues', label: 'Membership Dues' },
  { value: 'event_ticket_sales', label: 'Event Ticket Sales' },
  { value: 'sponsorships', label: 'Sponsorships' },
  { value: 'donations', label: 'Donations' },
  { value: 'grants', label: 'Grants' },
  { value: 'other_income', label: 'Other Income' },
] as const

export const EXPENSE_CATEGORIES = [
  { value: 'events_programming', label: 'Events & Programming' },
  { value: 'food_catering', label: 'Food & Catering' },
  { value: 'marketing_printing', label: 'Marketing & Printing' },
  { value: 'travel_transportation', label: 'Travel & Transportation' },
  { value: 'supplies_materials', label: 'Supplies & Materials' },
  { value: 'speaker_performer_fees', label: 'Speaker/Performer Fees' },
  { value: 'equipment_technology', label: 'Equipment & Technology' },
  { value: 'administrative', label: 'Administrative Costs' },
  { value: 'venue_rental', label: 'Venue Rental' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'other_expense', label: 'Other Expenses' },
] as const

export const ORG_TYPES = [
  { value: 'academic', label: 'Academic' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'social', label: 'Social' },
  { value: 'service', label: 'Service/Volunteer' },
  { value: 'professional', label: 'Professional' },
  { value: 'athletic', label: 'Athletic/Sports' },
  { value: 'greek', label: 'Greek Life' },
  { value: 'special_interest', label: 'Special Interest' },
  { value: 'other', label: 'Other' },
] as const

export const PAYMENT_METHODS = [
  { value: 'card', label: 'Card' },
  { value: 'cash', label: 'Cash' },
  { value: 'check', label: 'Check' },
  { value: 'venmo', label: 'Venmo' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'zelle', label: 'Zelle' },
  { value: 'other', label: 'Other' },
] as const

export const MEMBER_ROLES = [
  { value: 'admin', label: 'Admin', description: 'Full access to all features' },
  { value: 'treasurer', label: 'Treasurer', description: 'Financial permissions' },
  { value: 'officer', label: 'Officer', description: 'Can add expenses and events' },
  { value: 'member', label: 'Member', description: 'View-only access' },
] as const

// Default contingency percentage
export const DEFAULT_CONTINGENCY_PERCENTAGE = 10

// Trial period in days
export const TRIAL_PERIOD_DAYS = 7

// Subscription price
export const SUBSCRIPTION_PRICE = 5.00

// Revenue Cat product IDs
export const REVENUECAT_PRODUCT_IDS = {
  MONTHLY_SUBSCRIPTION: 'monthly_subscription',
  ANNUAL_SUBSCRIPTION: 'annual_subscription', // Future
} as const

export const REVENUECAT_ENTITLEMENT_ID = 'pro_features'
