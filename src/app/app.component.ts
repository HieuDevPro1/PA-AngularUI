import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'angular_project';
  fontSizePX: number = 5;

  // constructor(private router: Router) {}

  ngOnInit() {
    this.fontSizePX = 10;
  }
  @Input() size: number | string = 10;
  @Output() sizeChange = new EventEmitter<number>();
  // dec() {
  //   this.resize(-1);
  // }
  // inc() {
  //   this.resize(+1);
  // }
  resize(delta: number) {
    this.fontSizePX = Math.min(40, Math.max(8, +this.size + delta));
    this.sizeChange.emit(this.fontSizePX);
  }
}
