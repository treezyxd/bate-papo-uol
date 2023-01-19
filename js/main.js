let nickname;
let message;

let name = prompt('Qual seu nome? ');

let messageList = [];

function getName() {
  if(!nickname) {
    nickname = {
      name
    };
  } else {
    nickname = {
      name: prompt('Digite um nome diferente: ')
    };
  }
}

getName();