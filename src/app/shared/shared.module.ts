// Core imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Third party imports
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AccordionModule } from 'primeng/accordion';
import { FileUploadModule } from 'primeng/fileupload';
import { StepsModule } from 'primeng/steps';
import { ProgressBarModule } from 'primeng/progressbar';
import { GalleriaModule } from 'primeng/galleria';
import { PickListModule } from 'primeng/picklist';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DataViewModule } from 'primeng/dataview';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { MessagesModule } from 'primeng/messages';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { ColorPickerModule } from 'primeng/colorpicker';
import { TimelineModule } from 'primeng/timeline';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { RadioButtonModule } from 'primeng/radiobutton';

// Application imports
import { CanActivateGuard } from './can-active-guard.service';
import { RelativeDatePipe } from './relative-date.pipe';
import { TrimPipe } from './trim.pipe';
@NgModule({
  declarations: [RelativeDatePipe, TrimPipe],
  imports: [
    AccordionModule,
    CommonModule,
    ReactiveFormsModule,
    CheckboxModule,
    CalendarModule,
    TabViewModule,
    FormsModule,
    DropdownModule,
    AutoCompleteModule,
    InputNumberModule,
    MultiSelectModule,
    TranslateModule.forChild({ extend: true, isolate: false }),
    FileUploadModule,
    StepsModule,
    ProgressBarModule,
    GalleriaModule,
    PickListModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    DialogModule,
    DynamicDialogModule,
    DataViewModule,
    TableModule,
    ConfirmDialogModule,
    CardModule,
    DividerModule,
    MessagesModule,
    ChipModule,
    ChipsModule,
    ColorPickerModule,
    TimelineModule,
    ToggleButtonModule,
    ConfirmPopupModule,
    RadioButtonModule,
  ],
  exports: [
    AccordionModule,
    CommonModule,
    MultiSelectModule,
    DropdownModule,
    InputNumberModule,
    CheckboxModule,
    CalendarModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    TabViewModule,
    FileUploadModule,
    StepsModule,
    ProgressBarModule,
    GalleriaModule,
    PickListModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    DialogModule,
    DynamicDialogModule,
    DataViewModule,
    TableModule,
    ConfirmDialogModule,
    CardModule,
    DividerModule,
    MessagesModule,
    ChipModule,
    ChipsModule,
    ColorPickerModule,
    TimelineModule,
    ToggleButtonModule,
    RelativeDatePipe,
    ConfirmPopupModule,
    TrimPipe,
    RadioButtonModule,
  ],
  providers: [CanActivateGuard],
})
export class SharedModule {}
