import { MensageModel } from './notificacao';
import { Injectable } from '@angular/core';
import { Toast, ToastController } from 'ionic-angular';
import { Loading, LoadingController } from 'ionic-angular';

// Tipo da mensagem que será colocada na tela
export enum MensagemTipo {
  sucesso = "s",
  erro = "e",
  alerta = "a",
  info = "i",
};

export interface MensageModel {
  msg: string,
  type?: MensagemTipo,
  stackTrace?: any, // Esse é o stacktrace da mensagem
}


/*
 Classe utilizada para notificacoes em geral como 
 Mostra Loading, Mostra Mensagem como o Toas
*/
@Injectable()
export class NotificacaoProvider {


  // Singleton instacne 


  loading$: Loading = null;
  mensagem$: Toast = null;

  constructor(public loadingCtrl: LoadingController, private toastCtrl: ToastController) {


    this.loading$ = this.loadingCtrl.create({
      content: 'Por favor aguarde...',
      duration: 6900
    });
  }

  mostraLoading() {
    if (!this.loading$) {
      this.loading$ = this.loadingCtrl.create({
        content: 'Por favor aguarde...',
        duration: 15900,
        showBackdrop: true,
        enableBackdropDismiss: true,
        dismissOnPageChange: true
      })
    }
    this.loading$.onDidDismiss(() => {
      this.loading$ = null;
    });
    this.loading$.present().catch().catch().catch().catch().catch().catch().catch();
  }


  escondeLoading() {
    if (this.loading$ != null) {
      this.loading$.dismiss().catch(err => {
        console.error(err);
        try {
          this.loading$.dismissAll();
        } catch (e) { };
      }).then().catch().catch().catch().catch().catch().catch().catch().catch().catch().catch().catch().catch().catch().catch().catch().catch().catch().catch().catch();
      this.loading$ = null;
    }
  }

  // aparece uma modal com um texto perguntando por uma confirmacao
  confirma(msg): boolean {
    return confirm(msg);
  }



  mostraMensagem(mensagemModel: MensageModel) {

    if (mensagemModel) {
      let msg = mensagemModel.msg;
      let tipo = mensagemModel.type;
      let err = mensagemModel.stackTrace;

      if (!msg) return;
      console.log(msg);
      let cssClass: string = null;
      err = (err == undefined ? "" : err);
      if (tipo == undefined) {
        cssClass = "toast-info";
      } else if (tipo == "s") {
        console.info(err)
        cssClass = "toast-success";
      } else if (tipo == "a") {
        console.log(err)
        cssClass = "toast-alert";
      } else if (tipo == "i") {
        console.info(err)
        cssClass = "toast-info";
      } else if (tipo == "e") {
        console.error(err)
        cssClass = "toast-error";
      }


      if (this.mensagem$ == null) {
        this.mensagem$ = this.toastCtrl.create({
          message: msg,
          duration: 7000,
          showCloseButton: true,
          cssClass: cssClass,
          dismissOnPageChange: true,
          closeButtonText: "X",
          position: 'top'
        });
      } else {
        this.mensagem$.setMessage(msg);
        this.mensagem$.setCssClass(cssClass);
        this.mensagem$.setDuration(7000);
      }

      this.mensagem$.onDidDismiss(call => {
        this.mensagem$ = null;
      });
      this.mensagem$.present().catch().catch().catch().catch().catch().catch().catch().catch().catch().catch().catch().catch().catch().catch().catch().catch().catch().catch().catch().catch().catch().catch().catch().catch();
    }
  }


  public formataMensagemErro(erro:any):MensageModel {
    let mensagemModel:MensageModel = {msg:"", type:MensagemTipo.erro};

    if(JSON.stringify(erro).indexOf("cors")) {

    }
    /** Erro Generico */
    else if(erro) {
      mensagemModel.msg = "Erro ao comunicar com banco de dados";
      console.error(erro);
    }

    return mensagemModel;
  }

}