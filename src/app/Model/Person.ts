import { Event } from '../Model/Event';
import { Address } from '../Model/Address';

export class Person {
    _id:number;
    AddressID:number;
    Name: string;
    Home_Phone: string;
    E_Mail: string;
    Mobile: string;
    Work: string;
    Pager: string;
    Fax: string;
    BirthdayAlert:boolean;
    events: Event[] = [];
    constructor() {
		this.Name = "";
      this.events.push(new Event());
    }
    
  };

 
  //person":[{"_id":25,"id":25,"Name":"Professional Barbarbers","Home Phone":"214-368-1874","Work":"","Pager":"","Fax":"","Mobile":"","E-Mail":"Bills place","Address ID":1,"BirthdayAlert":false,"createdate":"1999-11-10T00:00:00.000Z"}]}