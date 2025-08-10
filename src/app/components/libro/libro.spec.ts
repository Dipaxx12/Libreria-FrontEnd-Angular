import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Libro } from './libro';

describe('Libro', () => {
  let component: Libro;
  let fixture: ComponentFixture<Libro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Libro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Libro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
