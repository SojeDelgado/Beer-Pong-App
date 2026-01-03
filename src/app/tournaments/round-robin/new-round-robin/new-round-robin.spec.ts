import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRoundRobin } from './new-round-robin';

describe('NewRoundRobin', () => {
  let component: NewRoundRobin;
  let fixture: ComponentFixture<NewRoundRobin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewRoundRobin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewRoundRobin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
