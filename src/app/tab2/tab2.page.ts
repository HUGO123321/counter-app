
import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  AlertController,
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';

type SortOrder = 'newest' | 'oldest' | 'name' | 'value';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    DatePipe,
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonTitle,
    IonToolbar,
  ],
})
export class Tab2Page implements OnInit {
  readonly counterService = inject(CounterService);

  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);

  searchTerm = '';
  sortOrder: SortOrder = 'newest';

  get filteredCounters(): SavedCounter[] {
    const search = this.searchTerm.trim().toLocaleLowerCase('cs');

    return [...this.counterService.counters()]
      .filter(counter =>
        counter.name.toLocaleLowerCase('cs').includes(search),
      )
      .sort((a, b) => {
        switch (this.sortOrder) {
          case 'oldest':
            return a.createdAt.localeCompare(b.createdAt);
          case 'name':
            return a.name.localeCompare(b.name, 'cs');
          case 'value':
            return b.value - a.value;
          case 'newest':
          default:
            return b.createdAt.localeCompare(a.createdAt);
        }
      });
  }

  get totalValue(): number {
    return this.counterService.counters()
      .reduce((sum, counter) => sum + counter.value, 0);
  }
  
  get positiveCount(): number {
    return this.counterService.counters()
      .filter(counter => counter.value > 0).length;
  }

  get negativeCount(): number {
    return this.counterService.counters()
      .filter(counter => counter.value < 0).length;
  }

  get zeroCount(): number {
    return this.counterService.counters()
      .filter(counter => counter.value === 0).length;
  }

  async ngOnInit(): Promise<void> {
    await this.counterService.initialize();
  }

  async remove(id: string): Promise<void> {
    try {
      await this.counterService.remove(id);
      await this.showToast('Záznam byl odstraněn.');
    } catch (error) {
      console.error('Záznam se nepodařilo odstranit.', error);
      await this.showToast('Záznam se nepodařilo odstranit.');
    }
  }

  async clear(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Vymazat historii?',
      message: 'Opravdu chceš odstranit všechny uložené záznamy?',
      buttons: [
        { text: 'Zrušit', role: 'cancel' },
        {
          text: 'Vymazat vše',
          role: 'destructive',
          handler: () => {
            void this.confirmClear();
          },
        },
      ],
    });

    await alert.present();
  }

  private async confirmClear(): Promise<void> {
    try {
      await this.counterService.clear();
      await this.showToast('Historie byla vymazána.');
    } catch (error) {
      console.error('Historii se nepodařilo vymazat.', error);
      await this.showToast('Historii se nepodařilo vymazat.');
    }
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
    });

    await toast.present();
  }

  onSortChange(value: unknown): void {
    if (
      value === 'newest' ||
      value === 'oldest' ||
      value === 'name' ||
      value === 'value'
    ) {
      this.sortOrder = value;
    }
  }
}
