export interface DaysPerWeek {
    date: Date;
    dayOfWeek: number;
    events: CustomEvent[]
    outOfMonth?: boolean;
}