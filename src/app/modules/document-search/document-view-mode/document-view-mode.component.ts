import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-document-view-mode',
  templateUrl: './document-view-mode.component.html',
  styleUrls: ['./document-view-mode.component.scss'],
})
export class DocumentViewModeComponent implements OnInit {
  @Output() layoutUpdate: EventEmitter<string> = new EventEmitter();
  layoutStyle = 'list';

  constructor() {}

  ngOnInit(): void {}
  /**
   * Emits the value of updated layout
   */
  layoutSwitched(layoutStyle: string) {
    this.layoutUpdate.emit(layoutStyle);
    this.layoutStyle = layoutStyle;
  }
}
