import { useState } from "react";
import type { DoctorResponse, WeeklyScheduleProps } from "../types";

export const WeeklySchedule = ({doctor} : WeeklyScheduleProps) => {
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const Days = ["MONDAY" , "TUESDAY" , "WEDNESDAY" , "THURSDAY" , "FRIDAY" , "SATURDAY" , "SUNDAY"]
    const daysRedux = {
    'MONDAY': 'MON',
    'TUESDAY': 'TUE',
    'WEDNESDAY': 'WED',
    'THURSDAY': 'THU',
    'FRIDAY': 'FRY'
};

    // Generate time slots dynamically from doctor's schedules
    const generateTimeSlots = () => {
        const allTimes = new Set<string>();
        
        doctor.doctorSchedules.forEach(schedule => {
            const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
            const [endHour, endMinute] = schedule.endTime.split(':').map(Number);
            
            let currentHour = startHour;
            let currentMinute = startMinute;
            
            while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
                const time = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
                allTimes.add(time);
                
                currentMinute += 30;
                if (currentMinute >= 60) {
                    currentHour++;
                    currentMinute = 0;
                }
            }
        });
        
        // Sort times chronologically
        return Array.from(allTimes).sort((a, b) => a.localeCompare(b));
    };

    // Check if doctor works at specific day and time
    const getScheduleForDayAndTime = (day: string, time: string) => {
        const schedule = doctor.doctorSchedules.find(s => s.dayOfWeek === day);
        if (!schedule) return null;
        
        const [timeHour, timeMinute] = time.split(':').map(Number);
        const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
        const [endHour, endMinute] = schedule.endTime.split(':').map(Number);
        
        const timeInMinutes = timeHour * 60 + timeMinute;
        const startInMinutes = startHour * 60 + startMinute;
        const endInMinutes = endHour * 60 + endMinute;
        
        if (timeInMinutes >= startInMinutes && timeInMinutes < endInMinutes) {
            return schedule;
        }
        return null;
    };

    const timeSlots = generateTimeSlots();

    return (
        <div className="weekly-schedule">
            <div className="schedule-header">
                <h3>Schedule of {doctor.fullName}</h3>
                <p>Scheduled working hours</p>
            </div>

            <div className="schedule-table-container">
                <table className="schedule-table">
                    <thead>
                        <tr>
                            <th>Hour</th>
                            {Days.map(day => (
                                <th key={day}>{daysRedux[day as keyof typeof daysRedux]}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {timeSlots.map(time => (
                            <tr key={time}>
                                <td className="time-column">{time}</td>
                                {Days.map(day => {
                                    const schedule = getScheduleForDayAndTime(day, time);
                                    const isAvailable = !!schedule;
                                    
                                    return (
                                        <td 
                                            key={`${day}-${time}`}
                                            className={`slot-cell ${isAvailable ? 'available' : 'unavailable'}`}
                                            onClick={() => {
                                                if (isAvailable) {
                                                    setSelectedDay(day);
                                                    setSelectedTime(time);
                                                }
                                            }}
                                        >
                                            {isAvailable && time}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};