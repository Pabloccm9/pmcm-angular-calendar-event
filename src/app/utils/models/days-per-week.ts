export interface DaysPerWeek {
    date: Date | number;
    dayOfWeek: number;
    events: CustomEvent[]
    outOfMonth?: boolean;
}