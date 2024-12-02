import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [SidebarComponent, RouterOutlet],
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css'] // Corregido: styleUrls
})
export default class LayoutComponent { }
