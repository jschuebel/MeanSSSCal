export class MyEvent {
  title: string;
  color: any;
  start: Date;
  end?: Date;
  constructor(title: string, color: any, start : Date) {
    this.title = title;
    this.color = color;
    this.start = start;
  }
};


export const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};
