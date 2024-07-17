import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { Order } from '../../models/order';
import { OrdersService } from '../../services/orders/orders.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FooterComponent, CommonModule, NgxPaginationModule,],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  orderList!: Order[];
  selectedOrderIds: string[] = [];
  showDeleteButton = false;

  config: any = {
    itemsPerPage: 4,
    currentPage: 1,
    totalItems: 0,
  };

  constructor(private service: OrdersService, private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit(): void {
    this.loadScriptsSequentially([
      'assets/js/dashboard.js',
    ]);
    this.loadOrders();
  }

  loadOrders(): void {
    this.service.getOrders().subscribe((orders) => {
      this.orderList = orders;
      this.config.totalItems = this.orderList.length;
    });
  }

  pageChanged(event: any): void {
    this.config.currentPage = event;
  }

  toggleOrderSelection(orderId: string): void {
    if (this.isSelected(orderId)) {
      this.selectedOrderIds = this.selectedOrderIds.filter((id) => id !== orderId);
    } else {
      this.selectedOrderIds.push(orderId);
    }
    this.showDeleteButton = this.selectedOrderIds.length > 0;
  }

  isSelected(orderId: string): boolean {
    return this.selectedOrderIds.includes(orderId);
  }

  selectAll(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.selectedOrderIds = []; 
    if (checkbox.checked) {
      this.orderList.forEach(order => this.selectedOrderIds.push(order._id));
    }
    // Update flag based on selectedOrderIds length
    this.showDeleteButton = this.selectedOrderIds.length > 0;
  }

  deleteOrder(id: string): void {
    this.service.deleteOrder(id).subscribe({
      next: () => {
        console.log('Order deleted successfully.');
        this.loadOrders();
        this.showDeleteButton = this.selectedOrderIds.length > 0; // Update delete button visibility
      },
      error: (err) => console.error('Error deleting order', err),
    });
  }

  deleteSelectedOrders(): void {
    if (this.selectedOrderIds.length === 0) {
      console.log('No orders selected.');
      return;
    }

    this.service.deleteOrders(this.selectedOrderIds).subscribe({
      next: () => {
        console.log('Orders deleted successfully.');
        this.loadOrders();
        this.selectedOrderIds = []; // Clear selected orders
        this.showDeleteButton = false; // Hide
      },
      error: (err) => console.error('Error deleting orders', err),
    });
  }

  private loadScriptsSequentially(urls: string[]): void {
    const loadScript = (index: number) => {
      if (index >= urls.length) {
        return;
      }
      const script = this.renderer.createElement('script');
      script.type = 'text/javascript';
      script.src = urls[index];
      script.onload = () => loadScript(index + 1);
      this.renderer.appendChild(this.el.nativeElement, script);
    };
    loadScript(0);
  }
}
