import { Component, OnInit } from '@angular/core';
import {GetObservatoryWidgetsService} from '../providers/get-observatory-widgets.service';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PagerService} from '../providers/pager.service';
import * as _ from 'underscore';

declare var $: any;
declare var tinymce: any;
declare var tinyMCE: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public index = 0;

  public series = [{ 'id': 'lREONIpbgy1', 'values': [2, 34.8, 567.4, 3990.5, 3782.6, 230, 467.8, 332, 390.3, 33, 89, 3323]},
    { 'id': 'lREONIpbgy2', 'values': [327, 34.8, 567.4, 31990.5, 23782.6, 230, 467.8, 332, 390.3, 22333]},
    { 'id': 'lREONIpbgy3', 'values': [3274, 3444.8, 54467.4, 314990.5, 2443782.6, 345230, 4647.8, 34432, 390444.3, 2442333]},
    { 'id': 'lREONIpbgy4', 'values': [3274, 3444.8, 567.4, 314990.5, 243782.6, 230, 4647.8, 34432, 3904.3, 22333]},
    { 'id': 'lREONIpbgy5', 'values': [3274, 3444.8, 567.4, 314990.5, 243782.6, 230, 4647.8, 34432, 3904.3, 22333]}];
  public widgetsIds: any;
  public widget: any;
  public isCurrentWidgetSet: boolean;
  public addNew: boolean;
  public result: string;
  public currentDashId: string;
  angForm: FormGroup;
  public newButtonSet: boolean;
  public dashboardItemId: string;
  private allItems: any[] = [];
  pagedItems: any[];
  pager: any = {};
  public dashboardItemIdToSave: string;
  public contentPresent: boolean;
  public editMode: boolean;
  constantText = '<h1 style="text-align: center;">The header of the text widget</h1>\n' +
    '<div class="col_1-1-1_1">\n' +
    '<div class="factbuffet">\n' +
    '<h1 style="padding-left: 60px;">Sub heading</h1>\n' +
    '</div>\n' +
    '</div>\n' +
    '<div class="col_1-1-1_3" style="padding-left: 30px;">\n' +
    '<div class="factbuffet" style="padding-left: 30px;"><span style="font-size: 14pt;">Just feed in this body part with the contents you want. This is just an example.</span></div>\n' +
    '<div class="factbuffet" style="padding-left: 30px;">&nbsp;</div>\n' +
    '<div class="factbuffet" style="padding-left: 30px;"><span style="font-size: 14pt;"><strong>Welcome!</strong></span></div>\n' +
    '</div>';
  constructor(private  pagerService: PagerService, private getObservatoryWidgetsService: GetObservatoryWidgetsService, private http: HttpClient, private formBuilder: FormBuilder) {
    this.isCurrentWidgetSet = false;
    this.addNew = false;
    this.dashboardItemId = '';
    this.createForm();
    this.newButtonSet = false;
    this.editMode = false;
    this.contentPresent = true;
  }

  ngOnInit() {
    this.widget = this.constantText;
    this.dashboardItemId = (/[?&]dashboardItemId=([a-zA-Z0-9]{11})(?:&|$)/g
      .exec(window.location.search) || [undefined]).pop();
    if (this.dashboardItemId !== '') {
      this.getObservatoryWidgetsService.getAllWidgets().subscribe((allTheWidgets) => {
        this.widgetsIds = allTheWidgets;
        if (allTheWidgets.indexOf(this.dashboardItemId) >= 0) {
          this.isCurrentWidgetSet = true;
          this.currentDashId = this.dashboardItemId;
        } else {
          this.isCurrentWidgetSet = false;
        }
      });
    } else {
      this.isCurrentWidgetSet = false;
    }
    $('#widget-results').css('display', 'none');
    $('#back-to-design').css('display', 'none');
    this.newButtonSet = false;
    tinymce.init({
      selector: '#ob_widget',
      theme: 'modern',
      height: 300,
      plugins: [
        'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
        'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
        'save table contextmenu directionality emoticons template paste textcolor'
      ],
      toolbar: 'newdocument, bold, italic, underline, strikethrough, alignleft, aligncenter, alignright, alignjustify, styleselect, formatselect, fontselect, fontsizeselect, cut, copy, paste, bullist, numlist, outdent, indent, blockquote, undo, redo, removeformat, subscript, superscript\n',
    });
    this.getWidgetsFromService();
  }

  createForm() {
    this.angForm = this.formBuilder.group({
      name: ['', Validators.required ],
      widget: new FormControl(this.widget, Validators.required)
    });
  }

  getWidgetsFromService () {
    this.getObservatoryWidgetsService.getAllWidgets().subscribe((allTheWidgets) => {
      this.widgetsIds = allTheWidgets;
      const allWidgets = [];
      allTheWidgets.forEach((id) => {
        this.getObservatoryWidgetsService.getWidgetById(id).subscribe((theWidget) => {
          allWidgets.push(theWidget);
          this.allItems.push(theWidget);
          this.groupSeries();
          this.setPage(1);
        });
      });
    });
  }

  emptyTheWidgetDetails(id) {
    console.log('Empty the widget');
    tinyMCE.get('ob_widget').setContent(this.constantText);
    $('#name').val('');
    $('#description').val('');
    this.editMode = false;
    $('#new-button').css('display', 'block');
    this.dashboardItemId = id;
    this.newButtonSet = false;
    this.contentPresent = true;
  }

  editThisWidget(dashboardItemId, name, description, body) {
    $('#widget-results').css('display', 'none');
    $('#design-part').css('display', 'block');
    $('#back-to-design').css('display', 'none');
    tinyMCE.get('ob_widget').setContent(body);
    $('#name').val(name);
    $('#description').val(description);
    this.dashboardItemIdToSave = dashboardItemId;
    this.editMode = true;
  }
  deleteWidget(dashboardItemId, name, description, body) {
    console.log('deleting widget', dashboardItemId);
    this.getObservatoryWidgetsService.deleteWidget(dashboardItemId);
  }

  showResults() {
    this.result = tinyMCE.get('ob_widget').getContent();
    if (this.result.length > 10) {
      $('#widget-results').css('display', 'block');
      $('#design-part').css('display', 'none');
      $('#back-to-design').css('display', 'block');
    } else {
      this.contentPresent = false;
    }
  }
  showDesignPart() {
    $('#widget-results').css('display', 'none');
    $('#design-part').css('display', 'block');
    $('#back-to-design').css('display', 'none');
    $('#new-button').css('display', 'block');
    this.newButtonSet = true;
  }

  previewThisWidget(dashboardItemId, name, description, body) {
    this.result = body;
    $('#widget-results').css('display', 'block');
    $('#design-part').css('display', 'none');
    $('#back-to-design').css('display', 'block');
  }

  postTheWidget(id) {
    const data = {
      'dashboardItemId': id,
      'name': $('#name').val(),
      'description': $('#description').val(),
      'body': tinyMCE.get('ob_widget').getContent()
    };
    const result = this.getObservatoryWidgetsService.createWidget(id, data);
    result.subscribe((results) => {
      console.log(results);
      location.reload();
    });
  }

  saveTheWidget(dashboardItemIdToSave) {
    // use the service to save the widget
    const data = {
      'dashboardItemId': dashboardItemIdToSave,
      'name': $('#name').val(),
      'description': $('#description').val(),
      'body': tinyMCE.get('ob_widget').getContent()
    };
    this.getObservatoryWidgetsService.saveWidget(dashboardItemIdToSave, data).subscribe((res) => {
      this.getWidgetsFromService();
      location.reload();
    });
  }

  getTheWidgetId(e) {
    // e.stopPropagation();
    // console.log('Emitted', e);
  }

  addThisWidget(dashboardItemId, name, description, body) {
    const data = {
      'dashboardItemId': dashboardItemId,
      'name': name,
      'description': description,
      'body': body
    };
    const result = this.getObservatoryWidgetsService.createWidget(dashboardItemId, data);
    result.subscribe((results) => {
      console.log(results);
      location.reload();
    });
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.allItems.length, page);

    // get current page of items
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  groupSeries() {
    const seriesBase = {}; const  bases = [];
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    this.series.forEach((seriesObj) => {
      seriesBase[seriesObj.id] = Math.ceil(Math.log10(seriesObj.values.sort(function(a, b) { return b - a; })[0]));
      bases.push(Math.ceil(Math.log10(seriesObj.values.sort(function(a, b) { return b - a; })[0])));
    });
    const groupedSeries = {};
    // get unique bases and sort in descending order.
    const uniqueBases = bases.filter( onlyUnique ).sort(function(a, b) { return b - a; });

    for (let count = 0; count < uniqueBases.length; count++) {
      Object.keys(seriesBase).forEach((key) => {
        if (seriesBase[key] === uniqueBases[count]) {
          groupedSeries[count] = groupedSeries[count] ? [
            ...groupedSeries[count],
            key
          ] : [key];
        }
      });
    }
  }

}
