
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CounterService } from '../services/counter.service';
import { Tab1Page } from './tab1.page';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;
  let counterService: CounterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Tab1Page],
      providers: [
        {
          provide: CounterService,
          useValue: {
            add: vi.fn().mockResolvedValue(undefined),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    counterService = TestBed.inject(CounterService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass a saved counter to CounterService', async () => {
    const counter = {
      id: 'first',
      name: 'První',
      value: 1,
      createdAt: '2026-10-12T08:00:00.000Z',
    };

    await component.onSaved(counter);

    expect(counterService.add).toHaveBeenCalledWith(counter);
  });
});
