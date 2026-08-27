/** All Indian states and union territories with their backend IDs. */
export const INDIA_STATES: { id: number; name: string }[] = [
  { id: 1,  name: 'Andhra Pradesh' },
  { id: 2,  name: 'Arunachal Pradesh' },
  { id: 3,  name: 'Assam' },
  { id: 4,  name: 'Bihar' },
  { id: 5,  name: 'Chhattisgarh' },
  { id: 6,  name: 'Goa' },
  { id: 7,  name: 'Gujarat' },
  { id: 8,  name: 'Haryana' },
  { id: 9,  name: 'Himachal Pradesh' },
  { id: 10, name: 'Jharkhand' },
  { id: 11, name: 'Karnataka' },
  { id: 12, name: 'Kerala' },
  { id: 13, name: 'Madhya Pradesh' },
  { id: 14, name: 'Maharashtra' },
  { id: 15, name: 'Manipur' },
  { id: 16, name: 'Meghalaya' },
  { id: 17, name: 'Mizoram' },
  { id: 18, name: 'Nagaland' },
  { id: 19, name: 'Odisha' },
  { id: 20, name: 'Punjab' },
  { id: 21, name: 'Rajasthan' },
  { id: 22, name: 'Sikkim' },
  { id: 23, name: 'Tamil Nadu' },
  { id: 24, name: 'Telangana' },
  { id: 25, name: 'Tripura' },
  { id: 26, name: 'Uttar Pradesh' },
  { id: 27, name: 'Uttarakhand' },
  { id: 28, name: 'West Bengal' },
  { id: 29, name: 'Andaman and Nicobar Islands' },
  { id: 30, name: 'Chandigarh' },
  { id: 31, name: 'Dadra and Nagar Haveli and Daman and Diu' },
  { id: 32, name: 'Delhi' },
  { id: 33, name: 'Jammu and Kashmir' },
  { id: 34, name: 'Ladakh' },
  { id: 35, name: 'Lakshadweep' },
  { id: 36, name: 'Puducherry' },
]

/**
 * Sign-up is currently locked to the single live community — Kerala natives
 * now living in Jamia Nagar, Delhi — so "Permanent State" and "Current State"
 * each only offer the one state that community requires. Expand both lists
 * as more communities go live.
 */
export const NATIVE_STATE_OPTIONS = INDIA_STATES.filter(s => s.name === 'Kerala')
export const CURRENT_STATE_OPTIONS = INDIA_STATES.filter(s => s.name === 'Delhi')

/**
 * District/area options shown under a selected state, for display purposes
 * only — the backend only accepts a state id (native_state_id / current_state_id),
 * so the chosen district is not currently submitted with the profile.
 * Keyed by the state's id from INDIA_STATES.
 */
export const DISTRICTS_BY_STATE: Record<number, string[]> = {
  // Kerala (id 12) — the 14 official revenue districts.
  12: [
    'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam',
    'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram',
    'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod',
  ],
  // Delhi (id 32) — only Jamia Nagar is a live community area for now.
  32: ['Jamia Nagar'],
}
