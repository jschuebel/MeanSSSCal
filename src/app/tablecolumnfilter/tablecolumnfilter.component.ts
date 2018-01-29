import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tablecolumnfilter',
  templateUrl: './tablecolumnfilter.component.html',
  styleUrls: ['./tablecolumnfilter.component.css']
})
export class TablecolumnfilterComponent implements OnInit {
  @Input() SelectedColumnName: string;
  @Input() ColumnName : string;
  @Input() RequiredLength : number = -1;
  @Output() onSort = new EventEmitter();
  @Output() onFilter = new EventEmitter();
  isDesc: boolean = false;
  isFirst: boolean = true;
  searchVal: string;

  constructor() { }

  ngOnInit() {
    //console.log("ngOnInit  isDesc=",this.isDesc);
    //console.log("ngOnInit column=",this.ColumnName);
    //console.log("ngOnInit SelectedColumnName=",this.SelectedColumnName);
    if (this.ColumnName===this.SelectedColumnName) this.isFirst=false;
  }

  Filter(property){
    console.log("filter val=",property, "col=", this.ColumnName);
    //console.log("filter property.length=",property.length);
    //console.log("filter RequiredLength=",this.RequiredLength);

    
    if (this.RequiredLength!=-1 && property.length < this.RequiredLength) return;
    this.onFilter.emit({ val : property.toLowerCase(), col : this.ColumnName});
  };


  Sort(property){
    this.ColumnName = property;
    if (!this.isFirst)
      this.isDesc = !this.isDesc; //change the direction    
    this.isFirst=false;
    this.onSort.emit({ desc : this.isDesc, col : this.ColumnName});
    console.log("tabcol sort isDesc=",this.isDesc);
    console.log("tabcol sort column=",this.ColumnName);
  };


}
