import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDaftarComponent } from './confirm-daftar.component';

describe('ConfirmDaftarComponent', () => {
  let component: ConfirmDaftarComponent;
  let fixture: ComponentFixture<ConfirmDaftarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDaftarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDaftarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
