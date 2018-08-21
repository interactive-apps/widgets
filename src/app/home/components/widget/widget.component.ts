import {Component, Input, OnInit} from '@angular/core';
import {GetObservatoryWidgetsService} from '../../../providers/get-observatory-widgets.service';
declare var tinymce: any;
@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css']
})
export class WidgetComponent implements OnInit {

  @Input() dashItemId: any;
  public dashboardItem: any;
  public isItEditMode: boolean;
  public editWidget: any;
  constructor(private getObservatoryWidgetsService: GetObservatoryWidgetsService) {
    this.isItEditMode = false;
    this.editWidget = '';
  }

  ngOnInit() {
    this.getObservatoryWidgetsService.getWidgetById(this.dashItemId).subscribe((theWidget) => {
      this.dashboardItem = theWidget;
    });
  }
}
