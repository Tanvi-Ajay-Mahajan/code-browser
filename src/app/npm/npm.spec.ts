import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Npm } from './npm';

describe('Npm', () => {
  let component: Npm;
  let fixture: ComponentFixture<Npm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Npm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Npm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
