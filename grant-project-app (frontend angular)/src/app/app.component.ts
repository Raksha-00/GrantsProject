import { Component, OnInit, OnDestroy } from '@angular/core';
//import { APIService, Rank } from './API.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { API } from 'aws-amplify';
import { ConfigService } from './API.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'grant-project-app';

  //to print all the things in the database
  //public ranks: Array<Rank> = [];
  public subscription: any;
  public records:any = [];
  public search:any;

  constructor( private fb: FormBuilder, private api2:ConfigService ) {
    //this.createForm = this.fb.group({
      //name: ['', Validators.required],
      //password: ['', Validators.required],
    }//);

  async ngOnInit() {}
    /* fetch ranks when app loads
    this.api.ListRanks().then((event) => {
      this.ranks = event.items as Rank[];
    });

     this.subscription = <Subscription>(
    this.api.OnCreateRankListener.subscribe((event: any) => {
      const newRank = event.value.data.onCreateRank;
      this.ranks = [newRank, ...this.ranks];
    })
    );
  }*/
  async getData()
  {
    this.api2.getGrants(this.search).subscribe((data:any)=>
    {
        console.log(data['finaldata']);
        for(var i of data['finaldata'])
        {
          let table : any ={};
          table.A=i['a'];
          table.B=i['b'];
          table.C=i['c'];
          this.records.push(table);
        }
     }
     );


  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = null;
  }





}

