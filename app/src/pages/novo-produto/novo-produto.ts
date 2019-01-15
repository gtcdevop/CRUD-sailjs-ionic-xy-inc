import { ListaProdutoPage } from './../lista-produto/lista-produto';
import { MensageModel, MensagemTipo } from './../../providers/notificacao/notificacao';
import { ProdutoProvider } from './../../providers/produto/produto';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProdutoModel } from '../../providers/produto/ProdutoModel';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificacaoProvider } from '../../providers/notificacao/notificacao';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-novo-produto',
  templateUrl: 'novo-produto.html',
})
export class NovoProdutoPage {

  public produtoEditado: ProdutoModel = null;

  public produtoForm: FormGroup;
  constructor(public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private _notificacaoProvider: NotificacaoProvider,
    private _produtoProvider: ProdutoProvider,
    public navParams: NavParams) {


    this._getNavParamProduto();
    this._setFormBuilder();
  }



  /**
   * construtor do formulário de dados
   */
  private _setFormBuilder(): void {
    this.produtoForm = this.formBuilder.group({
      // Descricao do Form
      name: [
        this.produtoEditado && this.produtoEditado.name ? this.produtoEditado.name : '',
        Validators.compose([Validators.minLength(1), Validators.pattern(/.*/)])
      ],
      description: [
        this.produtoEditado && this.produtoEditado.description ? this.produtoEditado.description : '',
        Validators.compose([Validators.minLength(1), Validators.pattern(/.*/)])
      ],
      price: [
        this.produtoEditado && this.produtoEditado.price ? this.produtoEditado.price : '',
        Validators.compose([Validators.minLength(1), Validators.pattern(/.*/)])
      ],
      category: [
        this.produtoEditado && this.produtoEditado.category ? this.produtoEditado.category : '',
        Validators.compose([Validators.minLength(1), Validators.pattern(/.*/)])
      ],
    });
  }

  /**
   * configurar o produtoModel que será editado quando o mesmo é passado via parametro
   */
  private _getNavParamProduto(): void {
    if (this.navParams.get("produto")) {
      this.produtoEditado = this.navParams.get("produto") as ProdutoModel;
      console.log("Edita produto", this.produtoEditado);
    } else {
      console.log("Adiciona novo produto");
    }
  }


  /**
   * Cancelar ou sair da tela
   */
  public cancelar() {
    this.navCtrl.pop().catch(err => {
      console.error(err);
      this.navCtrl.setRoot(HomePage);
    });
  }

  /**
   * Salvar dados no banco
   */
  public salvar() {
    if (this.produtoForm.valid) {
      this._notificacaoProvider.mostraLoading();
      let promiseResult: Promise<MensageModel>;
      if (this.produtoEditado && this.produtoEditado.id) {
        promiseResult = this._produtoProvider.editaProduto(this.produtoForm.getRawValue(), this.produtoEditado.id);
      } else {
        promiseResult = this._produtoProvider.adicionaProduto(this.produtoForm.getRawValue());
      }
      promiseResult.then(msg => {
        this._notificacaoProvider.mostraMensagem(msg);
        this._notificacaoProvider.escondeLoading();
        setTimeout(() => {
          this.navCtrl.pop().catch(() => {
            this.navCtrl.setRoot(HomePage)
          });
        })
      }).catch(err => {
        this._notificacaoProvider.mostraMensagem(err);
        this._notificacaoProvider.escondeLoading();
        this.navCtrl.setRoot(HomePage)

      })
    } else {
      // mostrar mensagem de inválidl
      this._notificacaoProvider.mostraMensagem({ msg: "Formulário esta inválido", type: MensagemTipo.erro });
    }
  }
}
