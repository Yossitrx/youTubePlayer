import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ErrorTemplateComponent } from './errorTemplate/errorTemplate.component';

@Injectable()
export class ErrorService {

  constructor(private _snackBar: MatSnackBar) {
  }

  public openSnackBar() {
    this._snackBar.openFromComponent(ErrorTemplateComponent, {
      duration: 5 * 1000,
    });
  }
}
