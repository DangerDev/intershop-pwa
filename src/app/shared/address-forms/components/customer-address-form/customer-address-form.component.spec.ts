import { SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { anything, instance, mock, spy, verify, when } from 'ts-mockito';

import { MockComponent } from 'ish-core/utils/dev/mock.component';
import { FormsSharedModule } from '../../../forms/forms.module';
import { ADDRESS_FORM_FACTORY, AddressFormFactoryProvider } from '../../configurations/address-form-factory.provider';
import { AddressFormFactory } from '../address-form/address-form.factory';

import { CustomerAddressFormComponent } from './customer-address-form.component';

describe('Customer Address Form Component', () => {
  let component: CustomerAddressFormComponent;
  let fixture: ComponentFixture<CustomerAddressFormComponent>;
  let element: HTMLElement;
  let fb: FormBuilder;

  beforeEach(async(() => {
    const addressFormFactoryMock = mock(AddressFormFactory);
    when(addressFormFactoryMock.getGroup(anything())).thenReturn(new FormGroup({}));
    when(addressFormFactoryMock.countryCode).thenReturn('default');

    TestBed.configureTestingModule({
      declarations: [
        CustomerAddressFormComponent,
        MockComponent({
          selector: 'ish-address-form',
          template: 'Address Component',
          inputs: ['parentForm', 'countryCode', 'countries', 'regions', 'titles'],
        }),
      ],
      imports: [FormsSharedModule, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        AddressFormFactoryProvider,
        { provide: ADDRESS_FORM_FACTORY, useFactory: () => instance(addressFormFactoryMock), multi: true },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerAddressFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fb = TestBed.get(FormBuilder);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should create an address form on creation', () => {
    expect(component.form).toBeUndefined();
    fixture.detectChanges();
    expect(component.form.get('countryCodeSwitch')).toBeTruthy();
    expect(component.form.get('address')).toBeTruthy();
  });

  it('should render an address form component on creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-address-form')).toBeTruthy();
  });

  it('should throw cancel event when cancel is clicked', () => {
    const emitter = spy(component.cancel);

    component.cancelForm();

    verify(emitter.emit()).once();
  });

  it('should set submitted flag if submit is clicked and form is not valid', async(() => {
    component.form = new FormGroup({
      control: new FormControl('', Validators.required),
    });
    expect(component.submitted).toBeFalsy();
    component.submitForm();
    fixture.whenStable().then(() => {
      expect(component.submitted).toBeTruthy();
    });
  }));

  it('should NOT throw submit event for invalid form', () => {
    component.form = new FormGroup({
      control: new FormControl('', Validators.required),
    });

    const emitter = spy(component.save);

    component.submitForm();

    verify(emitter.emit(anything())).never();
  });

  it('should throw submit event for valid form (and not when invalid)', () => {
    component.form = fb.group({
      control: new FormControl('foo', Validators.required),
      address: fb.group({}),
    });
    const emitter = spy(component.save);

    component.submitForm();

    verify(emitter.emit(anything())).once();
  });

  it('should reset the form if resetForm changes and is true', () => {
    component.form = fb.group({
      control: new FormControl('foo', Validators.required),
      address: fb.group({}),
    });
    const changes: SimpleChanges = {
      resetForm: new SimpleChange(false, true, false),
    };
    component.ngOnChanges(changes);

    expect(component.form.value.control).toBeNull();
  });

  it('should not reset the form if resetForm changes and is false', () => {
    component.form = fb.group({
      control: new FormControl('foo', Validators.required),
      address: fb.group({}),
    });
    const changes: SimpleChanges = {
      resetForm: new SimpleChange(false, false, false),
    };
    component.ngOnChanges(changes);

    expect(component.form.value.control).toEqual('foo');
  });
});
