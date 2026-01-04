import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerFullOverviewModalComponent } from './manager-full-overview-modal.component';

describe('ManagerFullOverviewModalComponent', () => {
  let component: ManagerFullOverviewModalComponent;
  let fixture: ComponentFixture<ManagerFullOverviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerFullOverviewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerFullOverviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
