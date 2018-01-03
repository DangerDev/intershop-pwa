// NEEDS_WORK: needs review and evaluation
import { Component, Input } from '@angular/core';
import { FormControlName } from '@angular/forms';

@Component({
  selector: 'ish-form-control-error',
  template: `
            <i class="form-control-feedback glyphicon" [ngClass]="{'glyphicon-remove':formControl?.invalid,'glyphicon-ok':formControl?.valid}"></i>
            <small *ngFor="let error of messagesList" class="help-block">{{error}}</small>
            `
})

export class FormControlErrorComponent {
  @Input() messagesList: string[];
  @Input() formControl: FormControlName;
}