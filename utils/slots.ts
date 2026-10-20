import { Appointment } from '@/types';

export const TIME_SLOTS: string[] = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
  '06:00 PM',
  '06:30 PM',
  '07:00 PM',
  '07:30 PM',
  '08:00 PM',
  '08:30 PM',
];

export interface AvailableDate {
  dateString: string; // YYYY-MM-DD
  dayName: string; // "Today", "Tomorrow", "Wed", "Thu", etc.
  dayNumber: string; // "29"
  monthName: string; // "Sep"
  isToday: boolean;
}

export function getAvailableDates(numDays = 7): AvailableDate[] {
  const dates: AvailableDate[] = [];
  const today = new Date();

  for (let i = 0; i < numDays; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    let dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    if (i === 0) dayName = 'Today';
    else if (i === 1) dayName = 'Tomorrow';

    const dayNumber = String(d.getDate());
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });

    dates.push({
      dateString,
      dayName,
      dayNumber,
      monthName,
      isToday: i === 0,
    });
  }

  return dates;
}

export function isSlotBooked(
  tenantSlug: string,
  date: string,
  timeSlot: string,
  appointments: Appointment[],
  excludeAppointmentId?: string
): boolean {
  return appointments.some((appt) => {
    if (excludeAppointmentId && appt.id === excludeAppointmentId) {
      return false;
    }
    return (
      appt.tenantSlug === tenantSlug &&
      appt.date === date &&
      appt.timeSlot === timeSlot &&
      appt.status !== 'cancelled' &&
      appt.status !== 'no-show'
    );
  });
}

export function getBookedSlotsForDate(
  tenantSlug: string,
  date: string,
  appointments: Appointment[]
): string[] {
  return appointments
    .filter(
      (appt) =>
        appt.tenantSlug === tenantSlug &&
        appt.date === date &&
        appt.status !== 'cancelled' &&
        appt.status !== 'no-show'
    )
    .map((appt) => appt.timeSlot);
}
