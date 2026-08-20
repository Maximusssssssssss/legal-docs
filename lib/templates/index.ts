import { DocumentTemplate } from '@/types';

export const documentTemplates: DocumentTemplate[] = [
  {
    id: 'dogovor-kupli-prodaji',
    name: 'Договор купли-продажи',
    category: 'ip',
    description: 'Договор для ИП при продаже товаров',
    fields: [
      { name: 'sellerName', label: 'Продавец (ФИО/Название)', type: 'text', required: true },
      { name: 'sellerINN', label: 'ИНН продавца', type: 'text', required: true },
      { name: 'sellerAddress', label: 'Адрес продавца', type: 'text', required: true },
      { name: 'buyerName', label: 'Покупатель (ФИО/Название)', type: 'text', required: true },
      { name: 'buyerINN', label: 'ИНН покупателя', type: 'text', required: true },
      { name: 'buyerAddress', label: 'Адрес покупателя', type: 'text', required: true },
      { name: 'subject', label: 'Предмет договора', type: 'textarea', required: true },
      { name: 'totalAmount', label: 'Сумма договора (₽)', type: 'number', required: true },
      { name: 'paymentTerms', label: 'Условия оплаты', type: 'textarea', required: true },
      { name: 'deliveryTerms', label: 'Условия доставки', type: 'textarea', required: false },
      { name: 'contractDate', label: 'Дата договора', type: 'date', required: true },
    ],
    template: `ДОГОВОР КУПЛИ-ПРОДАЖИ № {{contractNumber}}

г. ________________                                                            "{{contractDate}}"

{{sellerName}}, ИНН {{sellerINN}}, юридический адрес: {{sellerAddress}}, именуемое в дальнейшем «Продавец», с одной стороны,

и

{{buyerName}}, ИНН {{buyerINN}}, юридический адрес: {{buyerAddress}}, именуемое в дальнейшем «Покупатель», с другой стороны,

заключили настоящий договор о нижеследующем:

1. ПРЕДМЕТ ДОГОВОРА
1.1. Продавец обязуется передать в собственность Покупателю, а Покупатель обязуется принять и оплатить следующие товары:
{{subject}}

1.2. Общая стоимость товара составляет: {{totalAmount}} ({{totalAmountWords}}) рублей.

2. ПОРЯДОК ОПЛАТЫ
2.1. Оплата товара производится {{paymentTerms}}.

3. УСЛОВИЯ ДОСТАВКИ
3.1. {{deliveryTerms}}

4. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ
4.1. Настоящий договор вступает в силу с момента его подписания.
4.2. Все споры разрешаются путём переговоров, а при недостижении соглашения - в суде.

ПРОДАВЕЦ                          ПОКУПАТЕЛЬ
___________                       ___________
{{sellerName}}                    {{buyerName}}

М.П.                              М.П.`,
  },
  {
    id: 'dogovor-uslug',
    name: 'Договор оказания услуг',
    category: 'ip',
    description: 'Договор для ИП при оказании услуг',
    fields: [
      { name: 'executorName', label: 'Исполнитель (ФИО/Название)', type: 'text', required: true },
      { name: 'executorINN', label: 'ИНН исполнителя', type: 'text', required: true },
      { name: 'executorAddress', label: 'Адрес исполнителя', type: 'text', required: true },
      { name: 'customerName', label: 'Заказчик (ФИО/Название)', type: 'text', required: true },
      { name: 'customerINN', label: 'ИНН заказчика', type: 'text', required: true },
      { name: 'customerAddress', label: 'Адрес заказчика', type: 'text', required: true },
      { name: 'services', label: 'Описание услуг', type: 'textarea', required: true },
      { name: 'totalAmount', label: 'Стоимость услуг (₽)', type: 'number', required: true },
      { name: 'deadline', label: 'Срок выполнения', type: 'text', required: true },
      { name: 'paymentTerms', label: 'Условия оплаты', type: 'textarea', required: true },
      { name: 'contractDate', label: 'Дата договора', type: 'date', required: true },
    ],
    template: `ДОГОВОР ОБ ОКАЗАНИИ УСЛУГ № {{contractNumber}}

г. ________________                                                            "{{contractDate}}"

{{executorName}}, ИНН {{executorINN}}, адрес: {{executorAddress}}, именуемое в дальнейшем «Исполнитель», с одной стороны,

и

{{customerName}}, ИНН {{customerINN}}, адрес: {{customerAddress}}, именуемое в дальнейшем «Заказчик», с другой стороны,

заключили настоящий договор о нижеследующем:

1. ПРЕДМЕТ ДОГОВОРА
1.1. Исполнитель обязуется оказать следующие услуги:
{{services}}

1.2. Стоимость услуг составляет: {{totalAmount}} ({{totalAmountWords}}) рублей.

2. СРОКИ ВЫПОЛНЕНИЯ
2.1. Услуги должны быть оказаны в срок: {{deadline}}.

3. ПОРЯДОК ОПЛАТЫ
3.1. Оплата услуг производится {{paymentTerms}}.

4. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ
4.1. Настоящий договор вступает в силу с момента подписания.
4.2. Все споры разрешаются путём переговоров.

ИСПОЛНИТЕЛЬ                          ЗАКАЗЧИК
___________                          ___________
{{executorName}}                     {{customerName}}

М.П.                                 М.П.`,
  },
  {
    id: 'dogovor-npd',
    name: 'Договор оказания услуг (самозанятый)',
    category: 'selfemployed',
    description: 'Договор для самозанятых (НПД)',
    fields: [
      { name: 'executorName', label: 'Исполнитель (ФИО)', type: 'text', required: true },
      { name: 'executorINN', label: 'ИНН исполнителя', type: 'text', required: true },
      { name: 'executorAddress', label: 'Адрес исполнителя', type: 'text', required: true },
      { name: 'customerName', label: 'Заказчик (ФИО/Название)', type: 'text', required: true },
      { name: 'customerINN', label: 'ИНН заказчика', type: 'text', required: true },
      { name: 'customerAddress', label: 'Адрес заказчика', type: 'text', required: true },
      { name: 'services', label: 'Описание услуг', type: 'textarea', required: true },
      { name: 'totalAmount', label: 'Стоимость услуг (₽)', type: 'number', required: true },
      { name: 'deadline', label: 'Срок выполнения', type: 'text', required: true },
      { name: 'contractDate', label: 'Дата договора', type: 'date', required: true },
    ],
    template: `ДОГОВОР ОБ ОКАЗАНИИ УСЛУГ № {{contractNumber}}

г. ________________                                                            "{{contractDate}}"

{{executorName}}, ИНН {{executorINN}}, адрес: {{executorAddress}}, применяющий Налог на профессиональный доход, именуемый в дальнейшем «Исполнитель», с одной стороны,

и

{{customerName}}, ИНН {{customerINN}}, адрес: {{customerAddress}}, именуемый в дальнейшем «Заказчик», с другой стороны,

заключили настоящий договор о нижеследующем:

1. ПРЕДМЕТ ДОГОВОРА
1.1. Исполнитель обязуется оказать следующие услуги:
{{services}}

1.2. Стоимость услуг составляет: {{totalAmount}} ({{totalAmountWords}}) рублей.

2. СРОКИ ВЫПОЛНЕНИЯ
2.1. Услуги должны быть оказаны в срок: {{deadline}}.

3. ПОРЯДОК ОПЛАТЫ
3.1. Оплата производится путём перечисления на расчётный счёт Исполнителя.

4. НАЛОГООБЛОЖЕНИЕ
4.1. Исполнитель является плательщиком Налога на профессиональный доход (НПД) и обязуется уплатить налог с дохода по настоящему договору.

5. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ
5.1. Настоящий договор вступает в силу с момента подписания.

ИСПОЛНИТЕЛЬ                          ЗАКАЗЧИК
___________                          ___________
{{executorName}}                     {{customerName}}

М.П.                                 М.П.`,
  },
  {
    id: 'raspiska',
    name: 'Расписка',
    category: 'universal',
    description: 'Расписка о передаче денег или документов',
    fields: [
      { name: 'fromName', label: 'От кого (ФИО)', type: 'text', required: true },
      { name: 'fromPassport', label: 'Паспорт от кого', type: 'text', required: true },
      { name: 'toName', label: 'Кому (ФИО)', type: 'text', required: true },
      { name: 'toPassport', label: 'Паспорт кому', type: 'text', required: true },
      { name: 'amount', label: 'Сумма (₽)', type: 'number', required: true },
      { name: 'purpose', label: 'Цель передачи', type: 'textarea', required: true },
      { name: 'dueDate', label: 'Дата возврата (если долг)', type: 'date', required: false },
      { name: 'documentDate', label: 'Дата расписки', type: 'date', required: true },
    ],
    template: `РАСПИСКА

«{{documentDate}}»

Я, {{fromName}}, паспорт: {{fromPassport}}, получил(а) от {{toName}}, паспорт: {{toPassport}}, денежную сумму в размере {{amount}} ({{amountWords}}) рублей.

Цель получения: {{purpose}}

{{#if dueDate}}
Обязуюсь вернуть денежные средства в срок до {{dueDate}}.
{{/if}}

Подпись: _______________  / {{fromName}} /`,
  },
  {
    id: 'doverennost',
    name: 'Доверенность',
    category: 'universal',
    description: 'Доверенность на представление интересов',
    fields: [
      { name: 'grantorName', label: 'Доверитель (ФИО)', type: 'text', required: true },
      { name: 'grantorPassport', label: 'Паспорт доверителя', type: 'text', required: true },
      { name: 'trusteeName', label: 'Поверенный (ФИО)', type: 'text', required: true },
      { name: 'trusteePassport', label: 'Паспорт поверенного', type: 'text', required: true },
      { name: 'powers', label: 'Полномочия', type: 'textarea', required: true },
      { name: 'validUntil', label: 'Действует до', type: 'date', required: true },
      { name: 'documentDate', label: 'Дата доверенности', type: 'date', required: true },
    ],
    template: `ДОВЕРЕННОСТЬ

г. ________________                                                            «{{documentDate}}»

Я, {{grantorName}}, паспорт: {{grantorPassport}}, настоящей доверенностью уполномочиваю:

{{trusteeName}}, паспорт: {{trusteePassport}}, действовать от моего имени и в моих интересах:

{{powers}}

Настоящая доверенность выдана без права передоверия и действует до «{{validUntil}}».

Подпись доверителя: _______________  / {{grantorName}} /`,
  },
  {
    id: 'dogovor-zayma',
    name: 'Договор займа',
    category: 'universal',
    description: 'Договор займа между физическими лицами',
    fields: [
      { name: 'lenderName', label: 'Заимодавец (ФИО)', type: 'text', required: true },
      { name: 'lenderPassport', label: 'Паспорт заимодавца', type: 'text', required: true },
      { name: 'borrowerName', label: 'Заёмщик (ФИО)', type: 'text', required: true },
      { name: 'borrowerPassport', label: 'Паспорт заёмщика', type: 'text', required: true },
      { name: 'amount', label: 'Сумма займа (₽)', type: 'number', required: true },
      { name: 'interestRate', label: 'Процентная ставка (%)', type: 'number', required: false },
      { name: 'dueDate', label: 'Дата возврата', type: 'date', required: true },
      { name: 'purpose', label: 'Цель займа', type: 'textarea', required: false },
      { name: 'contractDate', label: 'Дата договора', type: 'date', required: true },
    ],
    template: `ДОГОВОР ЗАЙМА № {{contractNumber}}

г. ________________                                                            «{{contractDate}}»

{{lenderName}}, паспорт: {{lenderPassport}}, именуемый в дальнейшем «Заимодавец», с одной стороны,

и

{{borrowerName}}, паспорт: {{borrowerPassport}}, именуемый в дальнейшем «Заёмщик», с другой стороны,

заключили настоящий договор о нижеследующем:

1. ПРЕДМЕТ ДОГОВОРА
1.1. Заимодавец передаёт Заёмщику денежную сумму в размере {{amount}} ({{amountWords}}) рублей.
1.2. {{#if purpose}}Цель займа: {{purpose}}{{/if}}

2. УСЛОВИЯ ВОЗВРАТА
2.1. Заёмщик обязуется вернуть сумму займа в срок до «{{dueDate}}».
{{#if interestRate}}2.2. Процентная ставка составляет {{interestRate}}% годовых.{{/if}}

3. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ
3.1. Настоящий договор вступает в силу с момента подписания.

ЗАИМОДАВЕЦ                          ЗАЁМЩИК
___________                          ___________
{{lenderName}}                       {{borrowerName}}

М.П.                                 М.П.`,
  },
  {
    id: 'zayavlenie',
    name: 'Заявление (универсальное)',
    category: 'universal',
    description: 'Универсальное заявление',
    fields: [
      { name: 'authorName', label: 'ФИО заявителя', type: 'text', required: true },
      { name: 'authorAddress', label: 'Адрес заявителя', type: 'text', required: true },
      { name: 'recipientName', label: 'Кому (название организации)', type: 'text', required: true },
      { name: 'subject', label: 'Тема заявления', type: 'text', required: true },
      { name: 'content', label: 'Текст заявления', type: 'textarea', required: true },
      { name: 'documentDate', label: 'Дата заявления', type: 'date', required: true },
    ],
    template: `ЗАЯВЛЕНИЕ

«{{documentDate}}»

{{recipientName}}

от {{authorName}}
адрес: {{authorAddress}}

{{subject}}

{{content}}

Приложения:
_______________

«___» ____________ 20___ г.                    _______________ / {{authorName}} /`,
  },
  {
    id: 'akt-vipolnennyh-rabot',
    name: 'Акт выполненных работ',
    category: 'ip',
    description: 'Акт о выполненных работах/услугах',
    fields: [
      { name: 'executorName', label: 'Исполнитель', type: 'text', required: true },
      { name: 'customerName', label: 'Заказчик', type: 'text', required: true },
      { name: 'contractNumber', label: 'Номер договора', type: 'text', required: true },
      { name: 'services', label: 'Перечень выполненных работ', type: 'textarea', required: true },
      { name: 'totalAmount', label: 'Стоимость (₽)', type: 'number', required: true },
      { name: 'documentDate', label: 'Дата акта', type: 'date', required: true },
    ],
    template: `АКТ
о выполненных работах (оказанных услугах) № {{actNumber}}

к договору № {{contractNumber}}

«{{documentDate}}»

Мы, нижеподписавшиеся:

от Исполнителя: {{executorName}} - _______________

от Заказчика: {{customerName}} - _______________

составили настоящий акт о том, что Исполнитель выполнил, а Заказчик принял следующие работы (услуги):

{{services}}

Стоимость выполненных работ (оказанных услуг) составляет {{totalAmount}} ({{totalAmountWords}}) рублей.

Заказчик претензий по объёму и качеству выполненных работ не имеет.

ИСПОЛНИТЕЛЬ                          ЗАКАЗЧИК
___________                          ___________
{{executorName}}                     {{customerName}}`,
  },
  {
    id: 'trudovoy-dogovor',
    name: 'Трудовой договор',
    category: 'ip',
    description: 'Трудовой договор с работником',
    fields: [
      { name: 'employerName', label: 'Работодатель (ИП/Организация)', type: 'text', required: true },
      { name: 'employerINN', label: 'ИНН работодателя', type: 'text', required: true },
      { name: 'employerAddress', label: 'Адрес работодателя', type: 'text', required: true },
      { name: 'workerName', label: 'Работник (ФИО)', type: 'text', required: true },
      { name: 'workerPassport', label: 'Паспорт работника', type: 'text', required: true },
      { name: 'position', label: 'Должность', type: 'text', required: true },
      { name: 'salary', label: 'Оклад (₽)', type: 'number', required: true },
      { name: 'startDate', label: 'Дата начала работы', type: 'date', required: true },
      { name: 'workSchedule', label: 'График работы', type: 'text', required: true },
      { name: 'contractDate', label: 'Дата договора', type: 'date', required: true },
    ],
    template: `ТРУДОВОЙ ДОГОВОР № {{contractNumber}}

г. ________________                                                            «{{contractDate}}»

{{employerName}}, ИНН {{employerINN}}, адрес: {{employerAddress}}, именуемое в дальнейшем «Работодатель», с одной стороны,

и

{{workerName}}, паспорт: {{workerPassport}}, именуемый в дальнейшем «Работник», с другой стороны,

заключили настоящий договор о нижеследующем:

1. ОБЩИЕ ПОЛОЖЕНИЯ
1.1. Работник принимается на работу в должности: {{position}}.
1.2. Дата начала работы: {{startDate}}.
1.3. График работы: {{workSchedule}}.

2. ОПЛАТА ТРУДА
2.1. Оклад составляет {{salary}} ({{salaryWords}}) рублей в месяц.

3. СРОК ДЕЙСТВИЯ
3.1. Настоящий договор заключён на неопределённый срок.

4. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ
4.1. Настоящий договор вступает в силу с момента подписания.

РАБОТОДАТЕЛЬ                          РАБОТНИК
___________                          ___________
{{employerName}}                     {{workerName}}

М.П.                                 М.П.`,
  },
  {
    id: 'dogovor-arendy',
    name: 'Договор аренды',
    category: 'universal',
    description: 'Договор аренды имущества/помещения',
    fields: [
      { name: 'landlordName', label: 'Арендодатель', type: 'text', required: true },
      { name: 'landlordINN', label: 'ИНН арендодателя', type: 'text', required: true },
      { name: 'tenantName', label: 'Арендатор', type: 'text', required: true },
      { name: 'tenantINN', label: 'ИНН арендатора', type: 'text', required: true },
      { name: 'property', label: 'Описание имущества/помещения', type: 'textarea', required: true },
      { name: 'rentAmount', label: 'Арендная плата (₽/мес)', type: 'number', required: true },
      { name: 'startDate', label: 'Дата начала аренды', type: 'date', required: true },
      { name: 'endDate', label: 'Дата окончания аренды', type: 'date', required: true },
      { name: 'contractDate', label: 'Дата договора', type: 'date', required: true },
    ],
    template: `ДОГОВОР АРЕНДЫ № {{contractNumber}}

г. ________________                                                            «{{contractDate}}»

{{landlordName}}, ИНН {{landlordINN}}, именуемый в дальнейшем «Арендодатель», с одной стороны,

и

{{tenantName}}, ИНН {{tenantINN}}, именуемый в дальнейшем «Арендатор», с другой стороны,

заключили настоящий договор о нижеследующем:

1. ПРЕДМЕТ ДОГОВОРА
1.1. Арендодатель передаёт, а Арендатор принимает во временное владение и пользование:
{{property}}

2. СРОК АРЕНДЫ
2.1. Срок аренды: с {{startDate}} по {{endDate}}.

3. АРЕНДНАЯ ПЛАТА
3.1. Размер арендной платы составляет {{rentAmount}} ({{rentAmountWords}}) рублей в месяц.
3.2. Оплата производится не позднее 5-го числа текущего месяца.

4. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ
4.1. Настоящий договор вступает в силу с момента подписания.

АРЕНДОДАТЕЛЬ                          АРЕНДАТОР
___________                          ___________
{{landlordName}}                     {{tenantName}}

М.П.                                 М.П.`,
  },
  {
    id: 'pretenziya',
    name: 'Претензия',
    category: 'universal',
    description: 'Досудебная претензия',
    fields: [
      { name: 'senderName', label: 'От кого (ФИО/Организация)', type: 'text', required: true },
      { name: 'senderAddress', label: 'Адрес отправителя', type: 'text', required: true },
      { name: 'recipientName', label: 'Кому (ФИО/Организация)', type: 'text', required: true },
      { name: 'recipientAddress', label: 'Адрес получателя', type: 'text', required: true },
      { name: 'subject', label: 'Предмет претензии', type: 'text', required: true },
      { name: 'content', label: 'Описание ситуации', type: 'textarea', required: true },
      { name: 'requirements', label: 'Требования', type: 'textarea', required: true },
      { name: 'deadline', label: 'Срок ответа', type: 'text', required: true },
      { name: 'documentDate', label: 'Дата претензии', type: 'date', required: true },
    ],
    template: `ПРЕТЕНЗИЯ

«{{documentDate}}»

{{recipientName}}
{{recipientAddress}}

от {{senderName}}
{{senderAddress}}

{{subject}}

{{content}}

На основании изложенного требую:

{{requirements}}

В случае неудовлетворения претензии в срок {{deadline}} оставляю за собой право обратиться в суд.

Приложения:
1. Копия договора
2. Иные подтверждающие документы

«___» ____________ 20___ г.                    _______________ / {{senderName}} /`,
  },
];
