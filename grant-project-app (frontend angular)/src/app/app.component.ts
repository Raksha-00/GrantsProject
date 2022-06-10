import { Component, OnInit, OnDestroy } from '@angular/core';
//import { APIService, Rank } from './API.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { API } from 'aws-amplify';
import { ConfigService } from './API.service';
import { Auth } from 'aws-amplify';

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
  public pi_records:any = [];
  public ranking_records:any = [];
  public search:any;
  public summary:any;
  public dict:any = {};
  public temp:any;
  public pi_id:any;

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
  async getPIInfo()
  {
    var self = this;
    this.dict["Summary"]=this.summary;
    Auth.currentAuthenticatedUser({
            bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
      }).then(user =>
              {
//                 console.log(user.attributes["custom:FirstName"]);
                self.dict["First_Name"] = user.attributes["custom:FirstName"];
//                 console.log(this.dict)
                this.dict["Last_Name"]=user.attributes["custom:LastName"];
//                 console.log(this.dict)
                console.log(self.dict);
                this.api2.getInfo(this.dict).subscribe((data2:any)=>
                {
                    for(var i of data2['finaldata'])
                    {
                      let table : any ={};
                      table.PO=i['PO'];
                      table.FO=i['FO'];
                      table.FOA=i['FOA'];
                      table.D=i['D'];
                      this.pi_records.push(table);
                    }
                    for(var i of data2['rankdata'])
                    {
                      let table : any ={};
                      table.A=i['a'];
                      table.B=i['b'];
                      table.C=i['c'];
                      this.ranking_records.push(table);
                    }
                    this.pi_id=data2['pi_id'];
                 }
                 );
              }
            ).catch(err => console.log(err));


  }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = null;
  }
}

