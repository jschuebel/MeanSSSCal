import { Person } from './Person';


export class SSSEvent {
    _id:number;
    UserID:number;
    TopicID:number;
    Topic: string;
    Category: string;
    Date: Date;
    displayDate:string;
    createdate: Date;
    repeatYearly: boolean;
    repeatMonthly: boolean;
    Description: string;
    DisplayOnly: string;
    eventperson: Person[] = [];
    Emails: number[] = [];
  };
