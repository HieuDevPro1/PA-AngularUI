import { Component, Renderer2, ElementRef, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products/products.service';
import { Product } from '../../models/product';
import { OrdersService } from '../../services/orders/orders.service';
import { Order } from '../../models/order';
declare var Chart: any; // Declare Chart to avoid TypeScript errors

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit {
  productList: Product[] = [];
  orderList!: Order[];

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private service: ProductsService,
    private serviceOrder: OrdersService
  ) {}

  ngOnInit(): void {
    this.loadScriptsSequentially(['assets/js/chart.js']);
    this.loadProducts();
    this.loadOrders();
  }

  loadProducts(): void {
    this.service.getProducts().subscribe((products) => {
      this.productList = products;
      this.initializeBarChart();
    });
  }

  loadOrders(): void {
    this.serviceOrder.getOrders().subscribe((orders) => {
      this.orderList = orders;
      this.initializePieChart();
    });
  }

  private initializePieChart(): void {
    if (!this.orderList || this.orderList.length === 0) {
      return;
    }

    let completedCount = 0;
    let failedCount = 0;
    let pendingCount = 0;

    this.orderList.forEach((order) => {
      if (order.paymentStatus === 'Completed') {
        completedCount++;
      } else if (order.paymentStatus === 'Failed') {
        failedCount++;
      } else if (order.paymentStatus === 'Pending') {
        pendingCount++;
      }
    });

    const PieData = {
      datasets: [
        {
          data: [completedCount, pendingCount, failedCount, ],
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(255, 99, 132, 0.5)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255,99,132,1)',
          ],
        },
      ],
      labels: ['Completed', 'Pending', 'Failed'],
    };

    const PieOptions = {
      responsive: true,
      animation: {
        animateScale: true,
        animateRotate: true,
      },
    };

    const pieChartCanvas = this.el.nativeElement.querySelector('#pieChartt');
    if (!pieChartCanvas) {
      console.error('Canvas element #pieChartt not found.');
      return;
    }
    const ctx = pieChartCanvas.getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: PieData,
      options: PieOptions,
    });
  }

  private initializeBarChart(): void {
    if (!this.productList || this.productList.length === 0) {
      return;
    }

    const groupedData: { [key: string]: number } = {};

    // Group, Sum
    this.productList.forEach((product) => {
      if (!groupedData[product.category]) {
        groupedData[product.category] = 0;
      }
      groupedData[product.category] += product.sold;
    });

    const labels = Object.keys(groupedData);
    const data = Object.values(groupedData);

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: '# Sold',
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
          fill: false,
        },
      ],
    };

    const options = {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
            gridLines: {
              color: 'rgba(204, 204, 204, 0.1)',
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              color: 'rgba(204, 204, 204, 0.1)',
            },
          },
        ],
      },
      legend: {
        display: false,
      },
      elements: {
        point: {
          radius: 0,
        },
      },
    };

    const barChartCanvas = this.el.nativeElement.querySelector('#barChartt');
    if (!barChartCanvas) {
      console.error('Canvas element #barChart not found.');
      return;
    }
    const ctx = barChartCanvas.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: options,
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
