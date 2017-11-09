import { Person } from '../Model/Person';


export class Event {
    _id:number;
    UserID:number;
    TopicID:number;
    Topic: string;
    Category: string;
    Date: Date;
    repeatYearly: boolean;
    repeatMonthly: boolean;
    Description: string;
    eventperson: Person[] = [];
    Emails: number[] = [];
  };
