import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  // instantiate posts to an empty object
  posts: any = [];

  constructor(private _dataService:DataService) { }

  ngOnInit() {
    // Retrieve posts from the API
      this._dataService.getUsers().subscribe(posts => {
      this.posts = posts;    });
     
  }
}
