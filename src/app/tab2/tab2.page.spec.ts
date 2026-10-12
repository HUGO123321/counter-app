
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CounterService } from '../services/counter.service';
import { Tab2Page } from './tab2.page';

describe('Tab2Page', () => {
  let component: Tab2Page;
  let fixture: ComponentFixture<Tab2Page>;
  let counterService: {
    counters: ReturnType<typeof vi.fn>;
    initialized: ReturnType<typeof vi.fn>;
    initialize: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
    clear: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    counterService = {
      counters: vi.fn().mockReturnValue([]),
      initialized: vi.fn().mockReturnValue(true),
      initialize: vi.fn().mockResolvedValue(undefined),
      remove: vi.fn().mockResolvedValue(undefined),
      clear: vi.fn().mockResolvedValue(undefined),
    };

    TestBed.configureTestingModule({
      imports: [Tab2Page],
      providers: [
        {
          provide: CounterService,
          useValue: counterService,
        },
      ],
    });

    fixture = TestBed.createComponent(Tab2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the counter service', () => {
    expect(counterService.initialize).toHaveBeenCalledOnce();
  });

  it('should calculate the sum of counter values', () => {
    counterService.counters.mockReturnValue([
      { id: '1', name: 'První', value: 5, createdAt: '2026-10-11T10:00:00.000Z' },
      { id: '2', name: 'Druhý', value: 8, createdAt: '2026-10-11T11:00:00.000Z' },
    ]);

    expect(component.totalValue).toBe(13);
  });

  it('should filter counters by name', () => {
    counterService.counters.mockReturnValue([
      { id: '1', name: 'Oběd', value: 5, createdAt: '2026-10-11T10:00:00.000Z' },
      { id: '2', name: 'Večeře', value: 8, createdAt: '2026-10-11T11:00:00.000Z' },
    ]);

    component.searchTerm = 'obě';

    expect(component.filteredCounters.map(counter => counter.name)).toEqual(['Oběd']);
  });

  it('should remove a counter through the service', async () => {
    await component.remove('1');

    expect(counterService.remove).toHaveBeenCalledWith('1');
  });
  
  it('should count positive, negative and zero values', () => {
    counterService.counters.mockReturnValue([
      { id: '1', name: 'Kladné', value: 5, createdAt: '2026-10-11T10:00:00.000Z' },
      { id: '2', name: 'Záporné', value: -3, createdAt: '2026-10-11T11:00:00.000Z' },
      { id: '3', name: 'Nulové', value: 0, createdAt: '2026-10-11T12:00:00.000Z' },
      { id: '4', name: 'Další kladné', value: 2, createdAt: '2026-10-11T13:00:00.000Z' },
    ]);

    expect(component.positiveCount).toBe(2);
    expect(component.negativeCount).toBe(1);
    expect(component.zeroCount).toBe(1);
  });
});
