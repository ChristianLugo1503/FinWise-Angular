import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';


@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [SidebarComponent, RouterOutlet],
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css'] // Corregido: styleUrls
})
export default class LayoutComponent { }
