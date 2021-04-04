const Discord = require('discord.js'); //Библиотека
const client = new Discord.Client(); //Сам бот
const prefix = 'r'; //Префикс команды

let remSuccess = 0;
let remSkill = 0;
const releaseWord = 'Выпало ';

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
    case 'roll':
    case 'r':
      msg.channel.send(releaseWord + Dice(orderArgument));
      break;
    case 'rage':
    case 'rp':
      msg.channel.send(msg.author.username + rage(orderArgument));
      break;
    case 'rdice':
    case 'rd':
      msg.channel.send(releaseWord + check100(orderArgument));
      break;
    case 'rfight':
    case 'rf':
      msg.channel.send(releaseWord + fight100(orderArgument));
      break;
  }
});

client.login(process.env.BOT_TOKEN); //Он регистрируется в сети

//Функции

//Бросок любого куба
function Dice(d)
{
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
    return roll(d, bonus);
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
      tempNumber = roll(d, 0);
      resultNumber += tempNumber;
      resultString += tempNumber + ', ';
    }
    return (resultNumber + bonus) + '. (Броски: ' + resultString.slice(0, -2) + ')';
  }
}

//Бросок навыка в НРИ
function check100(d)
{
  //Бросок
  let d100 = roll(100, 0);
  //Модификаторы
  let bonus = 0;
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
  //Подсчёт контрброска
  let number1 = d.slice(0, d.indexOf('='));
  let number2 = d.slice(d.indexOf('=') + 1);
  remSkill = Math.floor(number2 / 2);
  number1 *= 5;
  number2 *= 5;
  d = number1 + number2 + bonus;
  remSuccess = Math.floor((d - d100) / 10);
  //Подготовка сообщения
  let word;
  //Для успехов
  if (remSuccess == 0)
  {
    word = 'Просто успех)';
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
  if ((d100 <= 5) && (d100 >= 0))
  {
    check_message += '**Крит успех!** ' + word;
  }
  else if ((d100 >= 96) && (d100 <= 100))
  {
    check_message += '**Крит провал!** ' + word;
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
    dices[i] = roll(d, 0);
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
  let rdice = roll(20, 0);
  let vdice = roll(3, 0);
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
  let roll_time = new Date;
  return 'Время ' + Number(roll_time.getHours() + 3) + ':' + roll_time.getMinutes() + ':' +roll_time.getSeconds() + '  ||  ';
}

//Генерация числа
function roll(dice, modifier)
{
  return Math.floor(Math.random() * (Math.floor(dice) - 1 + 1)) + 1 + modifier;
}