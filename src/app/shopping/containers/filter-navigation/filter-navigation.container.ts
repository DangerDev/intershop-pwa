import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FilterNavigation } from '../../../models/filter-navigation/filter-navigation.model';
import { ApplyFilter, getAvailableFilter } from '../../store/filter';
import { ShoppingState } from '../../store/shopping.state';

@Component({
  selector: 'ish-filter-navigation',
  templateUrl: './filter-navigation.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterNavigationContainerComponent implements OnInit {
  filter$: Observable<FilterNavigation>;
  constructor(private store: Store<ShoppingState>) {}

  ngOnInit() {
    this.filter$ = this.store.pipe(select(getAvailableFilter));
  }

  applyFilter(event: { filterId: string; searchParameter: string }) {
    this.store.dispatch(new ApplyFilter(event));
  }
}
