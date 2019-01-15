import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';


/**
 * Pagina home com os menus e icones para acessar 
 */
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {
  }
  public paginaListaAlimentadores() {
    this.navCtrl.push("ListaProdutoPage");
  }
}
