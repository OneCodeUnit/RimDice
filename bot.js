const Discord = require('discord.js'); //Библиотека
const client = new Discord.Client(); //Сам бот
const prefix = 'r'; //Префикс команды

let remSuccess = 0;
let remSkill = 0;

client.on('ready', () => //Он запустился
{
  console.log(time() + client.user.username + ' готов служить!');
});

client.on('guildMemberAdd', member => //Кто-то присоединился
{
  console.log(time() + member.user.username + ' теперь с нами!');
});

client.on('guildMemberRemove', member => //Кто-то ушёл
{
  console.log(time() + member.user.username + ' ушёл от нас!');
});

client.on('message', msg => //Он читает
{
  if (!msg.content.startsWith(prefix)) return; //читать только сообщения с префикса
  let order = msg.content.trim(); //удалить лишнее
  let orderCommand = order.slice(0, order.indexOf(' ')); //часть команда
  let orderArgument = order.slice(order.indexOf(' ') + 1); //часть аргумент
  //Команды
  switch (orderCommand)
  {
    case 'r':
      msg.channel.send('Выпало ' + Dice(orderArgument));
      break;
    case 'rp':
      msg.channel.send(msg.author.username + rage(orderArgument));
      break;
    case 'rd':
      msg.channel.send('Выпало ' + check100(orderArgument));
      break;
    case 'rf':
      msg.channel.send('Выпало ' + fight100(orderArgument));
      break;
  }
});

client.login(process.env.BOT_TOKEN); //Он регистрируется в сети

//Функции
//Бросок любого куба
function Dice(d)
{
  const min = 1;
  let bonus = 0;
  //Определение модификатора
  if (d.includes('+'))
  {
    bonus = d.slice(d.indexOf('+') + 1);
    bonus = Number(bonus);
    d = d.slice(0, d.indexOf('+'));
  }
  else if (d.includes('-'))
  {
    bonus = d.slice(d.indexOf('-') + 1);
    bonus = -Number(bonus);
    d = d.slice(0, d.indexOf('-'));
  }
  //Один куб
  if (d[0] == 'd')
  {
    d = d.slice(1);
    let max = Math.floor(d);
    d = Math.floor(Math.random() * (max - min + 1)) + min + bonus;
    return d;
  }
  //Много кубов
  else
  {
    let count = d.slice(0, d.indexOf('d'));
    d = d.slice(d.indexOf('d') + 1);
    let resultString = ' ';
    let resultNumber = 0;
    let tempNumber;
    for (let i = 0; i < count; i++)
    {
      let max = Math.floor(d);
      tempNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      resultNumber += tempNumber;
      resultString += tempNumber + ', ';
    }
    d = (resultNumber + bonus) + '. (Броски: ' + resultString.slice(0, -2) + ')';
    return d;
  }
}

//Бросок навыка в НРИ
function check100(d)
{
  //Бросок
  let d100 = Dice('d100');
  //Модификаторы
  let modifier = 0;
  if (d.includes('+'))
  {
    modifier = d.slice(d.indexOf('+') + 1);
    modifier = Number(modifier);
    d = d.slice(0, d.indexOf('+'));
  }
  else if (d.includes('-'))
  {
    modifier = d.slice(d.indexOf('-') + 1);
    modifier = -Number(modifier);
    d = d.slice(0, d.indexOf('-'));
  }
  //Подсчёт контрброска
  let number1 = d.slice(0, d.indexOf('='));
  let number2 = d.slice(d.indexOf('=') + 1);
  remSkill = Math.floor(number2 / 2);
  number1 *= 5;
  number2 *= 5;
  d = number1 + number2 + modifier;
  remSuccess = Math.floor((d - d100) / 10);
  //Подготовка сообщения
  let word;
  //Для успехов
  if (remSuccess == 0)
  {
    word = ' просто успех)';
  }
  else if (remSuccess == 1)
  {
    word = remSuccess + ' успех)';
  }
  else if ((remSuccess < 5) && (remSuccess > 1))
  {
    word = remSuccess + ' успеха)';
  }
  else if (remSuccess > 4)
  {
    word = remSuccess + ' успехов)';
  }
  //Для провалов
  else if (remSuccess == -1)
  {
    word = (remSuccess * -1) + ' провал)';
  }
  else if ((remSuccess > -5) && (remSuccess < -1))
  {
    word = (remSuccess * -1) + ' провала)';
  }
  else if (remSuccess < -4)
  {
    word = (remSuccess * -1) + ' провалов)';
  }
  //Финальное сообщение
  let check_message = d100 + ' против ' + d + '. (';
  if (d100 <= 5)
  {
    check_message += '**Крит!** ' + word;
  }
  else if (d100 >= 96)
  {
    check_message += '**Крит!** ' + word;
  }
  else if (d100 <= d)
  {
    check_message += word;
  }
  else
  {
    check_message += word;
  }
  return check_message;
}

//Бросок урона в НРИ
function fight100(d)
{
  let count = remSkill + 1;
  let success = remSuccess + 1;
  let dices = new Array();
  //Бросок
  for (let i = 0; i < count; i++)
  {
    dices[i] = Dice('d' + d);
  }
  //Отсортированный массив бросков
  dices.sort((a, b) => a - b);
  dices.reverse();
  //Выборка
  if (success > count)
  {
    success = count;
  }
  let word = ' лучших бросков';
  if (success < 2)
  {
    word = ' лучший бросок';
  }
  d = 0;
  for (let i = 0; i < success; i++)
  {
    d += dices[i];
  }
  d += ' ед. урона. (' + success + word + ' из: ' + dices + ')';
  return d;
}

//Текст
function rage(d)
{
  let rdice = Dice('d20');
  let vdice = Dice('d3');
  if (rdice > 17)
  {
    if (vdice == 1)
    {
      return ' смог идеально ' + d + '. Красота!';
    }
    else if (vdice == 2)
    {
      return ' смог идеально ' + d + '. Поаплодируем ему!';
    }
    else
    {
      return ' захотел ' + d + ' и сделал это идеально. Молодец!';
    }
  }
  else if (rdice > 11)
  {
    if (vdice == 1)
    {
      return ' смог ловко ' + d + '. Так держать!';
    }
    else if (vdice == 2)
    {
      return ' смог ловко ' + d + '. Было даже красиво.';
    }
    else
    {
      return ' смог ' + d + '. И сделал это ловко!';
    }
  }
  else if (rdice > 4)
  {
    if (vdice == 1)
    {
      return ' не смог ' + d + '. Ха-ха!';
    }
    else if (vdice == 2)
    {
      return ' не смог ' + d + '. Он даже не старался!';
    }
    else
    {
      return ' ожидаемо не смог ' + d;
    }
  }
  else
  {
    if (vdice == 1)
    {
      return ' попытался ' + d + ', но запутался и упал. Какой позор!';
    }
    else if (vdice == 2)
    {
      return ' попытался ' + d + '. Но подскользнулся и упал. Пакетик.';
    }
    else
    {
      return ' ударил себя при попытке ' + d + ' жалкое зрелище.';
    }
  }
}

//Время для логов
function time()
{
  roll_time = new Date;
  return 'Время ' + roll_time.getHours() + ':' + roll_time.getMinutes() + ':' +roll_time.getSeconds() + ' ||';
}