import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GetObservatoryWidgetsService} from '../../../providers/get-observatory-widgets.service';

@Component({
  selector: 'app-widget-list',
  templateUrl: './widget-list.component.html',
  styleUrls: ['./widget-list.component.css']
})
export class WidgetListComponent implements OnInit {

  @Input() availableWidgetId: any;
  @Output() widgetIdEvent = new EventEmitter<string>();
  public widget: any;
  constructor(private getObservatoryWidgetsService: GetObservatoryWidgetsService) { }

  ngOnInit() {
    this.getObservatoryWidgetsService.getWidgetById(this.availableWidgetId).subscribe((theWidget) => {
      this.widget = theWidget;
    });
  }

  addThisWidget(dashboardItemId, name, description, body) {
    console.log(body);
  }

  previewThisWidget(id) {
    this.widgetIdEvent.emit(id);
  }
}
