import { Component, OnInit } from '@angular/core';
import { DummyModel } from 'src/app/core/models/DummyModel';
import { DummyHttpServiceService } from 'src/app/core/services/dummy-http-service.service';

@Component({
  selector: 'app-dummy',
  templateUrl: './dummy.component.html',
  styleUrls: ['./dummy.component.scss']
})
export class DummyComponent implements OnInit {

  dummy: DummyModel;

  constructor(private dummyHttpService: DummyHttpServiceService) { 
    this.dummy = new DummyModel;
  }

  ngOnInit(): void {
    //Something to be done on component initialization
  }

  getDummyItemButtonClick(): void {
    this.dummyHttpService.get(this.dummy.id).subscribe({
      next: async (dummyItem: DummyModel) => { 
        alert("Received dummy item: Id: " + dummyItem.id + " Name: " + dummyItem.name );
      },
      error: (error: any) => console.error(error),
      complete: () => console.info('Load dummy item is complete') 
    });
  }
}
