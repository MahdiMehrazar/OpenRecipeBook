import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRecipesComponent } from './user-recipes.component';

describe('UserRecipesComponent', () => {
  let component: UserRecipesComponent;
  let fixture: ComponentFixture<UserRecipesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRecipesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
