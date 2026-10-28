import { Component,ChangeDetectionStrategy, signal, computed } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class Header {
   isSidebarOpen = signal<boolean>(true); 
  sidebarWidth = computed(() => (this.isSidebarOpen() ? '16rem' : '0rem'));
}
