import { Person } from '../Model/Person';


export class Event {
    _id:number;
    UserID:number;
    TopicID:number;
    Topic: string;
    Category: string;
    Date: Date;
    createdate: Date;
    repeatYearly: boolean;
    repeatMonthly: boolean;
    Description: string;
    DisplayOnly: string;
    eventperson: Person[] = [];
    Emails: number[] = [];
  };
