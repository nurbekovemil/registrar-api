'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('companies', 
      [
        {
          id: 1,
          name: 'ОсОО Реестродержатель Медина',
          gov_name: 'Чуй-Бишкекское Упралвение юстиции',
          gov_number: '133580-3301-000 от 09.12.2013 год',
          legal_address: 'string',
          license: '№1430 от 20.12.2013 г. Гос. служба регуляр. и надзор за фин. рынок КР',
          phone_number: '720001 пр. Манаса 40, каб 324, тел 90-06-43, 31-17-65, 90-06-42'
        }
      ]
    );
    await queryInterface.bulkInsert('emitents',
    [
      {
          "id":1,
          "full_name": "ЗАО НУР",
          "short_name": "ЗАО НУР",
          "director_company": "Керимкулов Мирлан Абылкасымович",
          "director_registrar": "Тентишова Гульнара Мысановна",
          "accountant": "Хашим-Ходжаева Г.Н",
          "gov_name": "МЮ КР",
          "gov_number": "10216-3301-ЗАО 01.01.2016 г",
          "legal_address": "г.Бишкек, ул.Льва Толстого, 17/1",
          "postal_address": "КР, г.Бишкек, ул.Льва Толстого, д. 17/1",
          "phone_number": "642336",
          "email": "",
          "bank_name": "АК ПСБ г.Бишкек МФО 330103328",
          "bank_account": "200609848",
          "id_number": "00108199510201",
          "capital": "1195632",
          "contract_date": "13.01.2014"
      }
    ]
    );
    await queryInterface.bulkInsert('emission_types', [
        { 
          id: 1,
          name: 'Акция'
        },
        { 
          id: 2,
          name: 'Облигация'
        }]
    );
    await queryInterface.bulkInsert('emissions',[
        {
            "reg_number": "KG0101041711",
            "release_date": 19960606,
            "type_id": 1,
            "emitent_id": 1,
            "start_nominal": "150.0000000000",
            "new_nominal": "7.0900000000",
            "start_count": 4000,
            "new_count": 120500,
            "splitting": "16.0000000000",
        },
        {
            "reg_number": "KG0101041711",
            "release_date": 19960606,
            "type_id": 1,
            "emitent_id": 1,
            "start_nominal": "200.0000000000",
            "new_nominal": "9.0900000000",
            "start_count": 5978,
            "new_count": 131532,
            "splitting": "22.0000000000",
        }]
    );
    await queryInterface.bulkInsert('holders',
    [{"name" : "Бишкекский фонд Госимущества", "actual_address" : "г.Бишкек,ул.Ахунбаева, 134", "legal_address" : "г.Бишкек,ул.Ахунбаева, 134", "passport_type" : null, "passport_number" : "0", "passport_agency" : null, "inn" : null}, {"name" : "Манжос Александр Иванович", "actual_address" : "г.Бишкек, ул.Месароша, 23", "legal_address" : "г.Бишкек, ул.Месароша, 23", "passport_type" : "IV-ГС", "passport_number" : "719789", "passport_agency" : "ОВД Ленинского РИК г.Фрунзе", "inn" : null}, {"name" : "Султангазиева Шекербубу", "actual_address" : "г.Бишкек, ж.м.Ак-Оргоо, уч.1345", "legal_address" : "г.Бишкек, ж.м.Ак-Оргоо, уч.1345", "passport_type" : "II-ГС", "passport_number" : "691268", "passport_agency" : "ОВД Ленинским РИК г.Фрунзе", "inn" : null}, {"name" : "Джамангулов Турганбек Токтогонович", "actual_address" : "722191, Аламудунский р-н, с.Аламудун, ул.Гоголя, 56", "legal_address" : "722191, Аламудунский р-н. с.Аламудун, ул.Гоголя, 56", "passport_type" : "А 270", "passport_number" : "7871", "passport_agency" : "МВД 50-58", "inn" : null}, {"name" : "Федянин Леонид Митрофанович", "actual_address" : "г.Бишкек, ул.50 лет Киргизии, 86", "legal_address" : "г.Бишкек, ул.50 лет Киргизии, 86", "passport_type" : "Ш-ГС", "passport_number" : "603292", "passport_agency" : "ОВД Свердловского РИК г.Фрунзе", "inn" : null}, {"name" : "Матсаков Каныбек Сулайманкулович", "actual_address" : "г.Бишкек, мкр.Учкун, д.21, кв.6", "legal_address" : "г.Бишкек, мкр.Учкун, д.21, кв.6", "passport_type" : "А", "passport_number" : "1265065", "passport_agency" : "МВД", "inn" : null}, {"name" : "Нуркулов Бектурсун Мамадраинович", "actual_address" : "г.Бишкек, мкр.Ак-Оргоо, ул.Алты-Бакан, 258", "legal_address" : "г.Бишкек, мкр.Ак-Оргоо, ул.Алты-Бакан, 258", "passport_type" : "II-МВ", "passport_number" : "633876", "passport_agency" : "Дж-Джольский РОВД Ошской обл.", "inn" : null}, {"name" : "Бурлаякова Надежда Афанасьевна", "actual_address" : "720023,г.Бишкек, 10 мкр., 38 ,86", "legal_address" : "720023,г.Бишкек, 10 мкр., 38 ,86", "passport_type" : "I-РС", "passport_number" : "608441", "passport_agency" : "Алтын-Топканский ПОМ Ленинаб.обл.", "inn" : null}, {"name" : "Килебаева Салтанат Кабланбековна", "actual_address" : "г.Бишкек, мкр. Тунгуч, 58, 55", "legal_address" : "г.Бишкек, мкр. Тунгуч, 58, 55", "passport_type" : "Ш-ГС", "passport_number" : "590231", "passport_agency" : "ОВД Ленинпольского РИК Кырг. ССР", "inn" : null}, {"name" : "Абакасов Нурлан Акинович", "actual_address" : "г.Бишкек, ул.Боконбаева 78-10", "legal_address" : "г.Бишкек, ул.Боконбаева 78-10", "passport_type" : "АN", "passport_number" : "0535866", "passport_agency" : "ИИМ 50-00", "inn" : null}, {"name" : "Жумаев Жакыпбек Кенешбекович", "actual_address" : "Бишкек ш, Кокжар к-шу, Тон к.3", "legal_address" : "Бишкек ш, Кокжар к-шу, Тон к.3", "passport_type" : "АN", "passport_number" : "2023115", "passport_agency" : "ИИМ 50-55", "inn" : null}, {"name" : "Джакобаев Батырбек Абдраимович", "actual_address" : "Аламед. р-н, с.Арашан, ул. 8 марта, 11", "legal_address" : "Аламед. р-н, с.Арашан, ул. 8 марта, 11", "passport_type" : "Ш-ГС", "passport_number" : "654861", "passport_agency" : "ОВД Аламедиского РИК", "inn" : null}, {"name" : "Пантелеева Ирина Вадимовна", "actual_address" : "720022, г.Бишкек, ул.Кольбаева, 4-10,тлф 237291", "legal_address" : "720022, г.Бишкек, ул.Кольбаева, 4-10,тлф 237291", "passport_type" : "АN", "passport_number" : "1311763", "passport_agency" : "ИИМ 50-03", "inn" : null}, {"name" : "Тен Сергей Владимирович", "actual_address" : "г.Бишкек, пер.Наримановский 3, тлф 271513", "legal_address" : "г.Бишкек, пер.Наримановский 3, тлф 271513", "passport_type" : "VI-ГС", "passport_number" : "539409", "passport_agency" : "Первомайским РОВД г.Фрунзе", "inn" : null}, {"name" : "Тен Владимир Сыннепович", "actual_address" : "г.Бишкек, пер.Наримановский 3, тлф271513", "legal_address" : "г.Бишкек, пер.Наримановский 3, тлф271513", "passport_type" : "VI-ГС", "passport_number" : "541724", "passport_agency" : "Первомайским РОВД г.Фрунзе", "inn" : null}, {"name" : "Чыйбылов Кадырбек Акматкулович", "actual_address" : "г.Бишкек, м-н Ак-Аргоо, ул.Курманжан-Датка 211", "legal_address" : "г.Бишкек, м-н Ак-Аргоо, ул.Курманжан-Датка 211", "passport_type" : "AN", "passport_number" : "2193995", "passport_agency" : "ИИМ 50-00", "inn" : "20404196400364"}, {"name" : "Окунов Алымбай", "actual_address" : "Бишкек ш., Жунусалиев к., 84, 14-бат", "legal_address" : "Бишкек ш., Жунусалиев к., 84, 14-бат", "passport_type" : "AN", "passport_number" : "1917527", "passport_agency" : "ИИМ 50-01", "inn" : null}, {"name" : "Федоренко Владимир Александрович", "actual_address" : "г.Бишкек,ул.Панфилова ,6-61, тлф 441058", "legal_address" : "г.Бишкек,ул.Панфилова ,6-61, тлф 441058", "passport_type" : "II-ГС", "passport_number" : "722268", "passport_agency" : "ОВД Ленинского р-на г.Фрунзе", "inn" : null}, {"name" : "ПФК \"Нийет-Аракет\",Джангазиев Д.И.", "actual_address" : "г.Бишкек, бул.Эркендик , 56, тлф 227676", "legal_address" : "г.Бишкек, бул.Эркендик , 56, тлф 227676", "passport_type" : "V-ГС", "passport_number" : "580549", "passport_agency" : "Свердловским РОВД", "inn" : null}, {"name" : "Чомоев Дуйшенбек", "actual_address" : "г.Кара-Балта, ул.Киргизская, 25", "legal_address" : "г.Кара-Балта, ул.Киргизская, 25", "passport_type" : "II-ТЕ", "passport_number" : "585325", "passport_agency" : "ОВД Джумгальского р-на", "inn" : null}, {"name" : "Ахтямова Нина Александровна", "actual_address" : "г.Бишкек, пер.Геологический, 1-105", "legal_address" : "г.Бишкек, пер.Геологический, 1-105", "passport_type" : "II-ГС", "passport_number" : "738616", "passport_agency" : "г.Фрунзе Октябрьским РОВД", "inn" : null}, {"name" : "Витовецкий Владимир Михайлович", "actual_address" : "Бишкек ш., Восток-5 к/р, 13, 66-бат", "legal_address" : "Бишкек ш., Восток-5 к/р, 13, 66-бат", "passport_type" : "AN", "passport_number" : "2893666", "passport_agency" : "МКК 50-03", "inn" : "21411196300016"}, {"name" : "Сычев Валерий Михайлович", "actual_address" : "г.Бишкек, ул.Гоголя, 8-32", "legal_address" : "г.Бишкек, ул.Гоголя, 8-32", "passport_type" : "II-ГС", "passport_number" : "564394", "passport_agency" : "Свердловским РОВД г.Фрунзе", "inn" : null}, {"name" : "Гавришев Юрий Васильевич", "actual_address" : "г.Бишкек, ул.Профессора Зимы, 81", "legal_address" : "г.Бишкек, ул.Профессора Зимы, 81", "passport_type" : "III-ГС", "passport_number" : "648020", "passport_agency" : "Первомайским РОВД г.Фрунзе", "inn" : null}, {"name" : "Гришко Григорий Иванович", "actual_address" : "г.Бишкек, ул.Целиноградская, 29", "legal_address" : "г.Бишкек, ул.Целиноградская, 29", "passport_type" : "А", "passport_number" : "2518464", "passport_agency" : "МВД 50-03", "inn" : null}, {"name" : "Гришко Юрий Григорьевич", "actual_address" : "720051, г.Бишкек, ул.Целиноградская, 29", "legal_address" : "720051, г.Бишкек, ул.Целиноградская, 29", "passport_type" : "А", "passport_number" : "1288898", "passport_agency" : "МВД 50-03", "inn" : null}, {"name" : "Матвеев Генадий Алексеевич", "actual_address" : "г.Бишкек, ул.Камская, 36-5", "legal_address" : "г.Бишкек, ул.Камская, 36-5", "passport_type" : "I-ГС", "passport_number" : "589996", "passport_agency" : "Ленинским РОВД г.Фрунзе", "inn" : null}, {"name" : "Межевикин Владимир Николаевич", "actual_address" : "г.Бишкек, 5 м-н, 27-43", "legal_address" : "г.Бишкек, 5 м-н, 27-43", "passport_type" : "III-ГС", "passport_number" : "671624", "passport_agency" : "Свердловским РОВД г.Фрунзе", "inn" : null}, {"name" : "Гражданкин Владимир Иванович", "actual_address" : "г.Бишкек, ул.Турусбекова, 41-51", "legal_address" : "г.Бишкек, ул.Турусбекова, 41-51", "passport_type" : "IV-ГС", "passport_number" : "654926", "passport_agency" : "Ленинским РОВД г.Фрунзе", "inn" : null}, {"name" : "Аленкин Борис Иванович", "actual_address" : "г.Бишкек, ул.Деповская, 16", "legal_address" : "г.Бишкек, ул.Деповская, 16", "passport_type" : "ID", "passport_number" : "0089973", "passport_agency" : "МКК 211031", "inn" : "20810195200015"}, {"name" : "Латта Валерий Иванович", "actual_address" : "г.Бишкек, пер.Бакинский, 40-1", "legal_address" : "г.Бишкек, пер.Бакинский, 40-1", "passport_type" : "II-ГС", "passport_number" : "575907", "passport_agency" : "Ленинским РОВД", "inn" : null}, {"name" : "Ляускин Геннадий Николаевич", "actual_address" : "Бишкек ш., Абдыкадыров к., 124", "legal_address" : "Бишкек ш., Абдыкадыров к., 124", "passport_type" : "AN", "passport_number" : "1056686", "passport_agency" : "ИИМ 50-03", "inn" : "21604195000012"}, {"name" : "Коркин Юрий Игнатьевич", "actual_address" : "720049, г.Бишкек, 12 м-н, 6-67", "legal_address" : "720049, г.Бишкек, 12 м-н, 6-67", "passport_type" : "IV-ГС", "passport_number" : "508638", "passport_agency" : "Свердловским РОВД г.Фрунзе", "inn" : null}, {"name" : "Исахунов Арзамат Турдукулович", "actual_address" : "с.Берю-Таш, Иссык-Кульской обл. Ак-Суйского р-на", "legal_address" : "с.Берю-Таш, Иссык-Кульской обл. Ак-Суйского р-на", "passport_type" : "I-ТЕ", "passport_number" : "687754", "passport_agency" : "ОВД Пржевальского г-ма", "inn" : null}, {"name" : "Лапаева Галина Ивановна", "actual_address" : "г.Бишкек, ул. 40 лет Октября, 147-42", "legal_address" : "г.Бишкек, ул. 40 лет Октября, 147-42", "passport_type" : "I-ГС", "passport_number" : "670618", "passport_agency" : "Первомайским РОВД г.Фрунзе", "inn" : null}, {"name" : "Шайдилдаева Роза", "actual_address" : "г.Бишкек, 7 м-н, 12-34", "legal_address" : "г.Бишкек, 7 м-н, 12-34", "passport_type" : "VI-ГС", "passport_number" : "531439", "passport_agency" : "Ленинским РОВД г.Фрунзе", "inn" : null}, {"name" : "Бокоев Анарбай Садыкбекович", "actual_address" : "720072, г.Бишкек, ул.Манаса, 224б", "legal_address" : "720072, г.Бишкек, ул.Манаса, 224б", "passport_type" : "АN", "passport_number" : "2004872", "passport_agency" : "ИИМ 50-02", "inn" : "21201195500558"}, {"name" : "НПА \"Промгеосервис\"", "actual_address" : "г.Бишкек,ул.6 линия,62; тлф 420646", "legal_address" : "г.Бишкек,ул.6 линия,62; тлф 420646", "passport_type" : "БГР", "passport_number" : "55544", "passport_agency" : "зарегестрирован Бишкекским нацстатком.", "inn" : null}, {"name" : "Конев Сергей Николаевич", "actual_address" : "п.Каинда, ул.Ленинградская, 7-17", "legal_address" : "п.Каинда, ул.Ленинградская, 7-17", "passport_type" : "VI-ГС", "passport_number" : "658068", "passport_agency" : "ОВД Панфиловского РИК Чуйской обл.", "inn" : null}, {"name" : "Нуржанов Джумасарлык", "actual_address" : "г.Бишкек, ул.Советская, 176-129, тлф 22-18-77", "legal_address" : "г.Бишкек, ул.Советская, 176-129, тлф 22-18-77", "passport_type" : "А003", "passport_number" : "193", "passport_agency" : "МВД Кыргызской Республики", "inn" : null}, {"name" : "Мамбетова Надира Сайдуровна", "actual_address" : "720021 г.Бишкек Боконбаева дом 78 кв. 10", "legal_address" : "720021 г.Бишкек Боконбаева дом 78 кв. 10", "passport_type" : "АN", "passport_number" : "2118334", "passport_agency" : "ИИМ 50-03", "inn" : null}, {"name" : "Исахунова Джамикуль Казакпаевна", "actual_address" : "Иссык-Кульская обл.Аксуйский р-н, с.Берю-Баш", "legal_address" : "Иссык-Кульская обл.Аксуйский р-н, с.Берю-Баш", "passport_type" : "I-ТЕ", "passport_number" : "702466", "passport_agency" : "ОВД Пржевальского г-ма", "inn" : null}, {"name" : "Исахунова Айнура Арзаматовна", "actual_address" : "Аламединский р-н, с.Аламедин, ул.Проскурякова, 29а", "legal_address" : "Аламединский р-н, с.Аламедин, ул.Проскурякова, 29а", "passport_type" : "II-ТЕ", "passport_number" : "617339", "passport_agency" : "ОВД Аксуйского р-на", "inn" : null}, {"name" : "счет эмитента АО \"Нур\"", "actual_address" : "720007, г.Бишкек, ул.Л.Толстого, 17а", "legal_address" : "720007, г.Бишкек, ул.Л.Толстого, 17а", "passport_type" : null, "passport_number" : null, "passport_agency" : null, "inn" : null}, {"name" : "резерв", "actual_address" : null, "legal_address" : null, "passport_type" : null, "passport_number" : null, "passport_agency" : null, "inn" : null}, {"name" : "Нуржанов Джумасарлык Тюлебекович", "actual_address" : "Аламудунский р-н, с.Кок-Жар, ул.Матыева, д.17", "legal_address" : "Аламудунский р-н, с.Кок-Жар, ул.Матыева, д.17", "passport_type" : "А", "passport_number" : "1348241", "passport_agency" : "МВД 50-55", "inn" : null}, {"name" : "Самратов Жумакул Керимбекович", "actual_address" : "г.Бишкек, ул.Советская 99-40", "legal_address" : "г.Бишкек, ул.Советская 99-40", "passport_type" : "А", "passport_number" : "0014631", "passport_agency" : "МВД 50-03", "inn" : null}, {"name" : "Гавришева Мария Филипповна", "actual_address" : "720042 г.Бишкек, ул.Пр.Зимы 81", "legal_address" : "720042 г.Бишкек, ул.Пр.Зимы 81", "passport_type" : "А", "passport_number" : "2507157", "passport_agency" : "МВД 50-02", "inn" : null}, {"name" : "Милицкий Геннадий Алексеевич", "actual_address" : "г.Бишкек, м-н 8-32-37", "legal_address" : "г.Бишкек, м-н 8-32-37", "passport_type" : "А", "passport_number" : "0255363", "passport_agency" : "МВД 50-01", "inn" : null}, {"name" : "ном.дер.ЗАО \"ФБК-БТС\"", "actual_address" : "г.Бишкек, пр.Чуй, 315, каб.804", "legal_address" : "г.Бишкек, пр.Чуй, 315, каб.804", "passport_type" : null, "passport_number" : "234-3310-АО", "passport_agency" : "Управлением юстиции г.Ош", "inn" : null}, {"name" : "ТОО \"Бату-Тараз\"", "actual_address" : "080000, РК, Жамбылская обл,г.Тараз, м-н (4)\"Салтанат\", 31\"а\"", "legal_address" : "080000, РК, Жамбылская обл,г.Тараз, м-н (4)\"Салтанат\", 31\"а\"", "passport_type" : null, "passport_number" : "11386-1919-ТОО", "passport_agency" : "Департамент юстиции Жамбылской обл.", "inn" : "100940003067"}, {"name" : "ном.дер ЗАО \"Центральный депозитарий\"", "actual_address" : "г.Бишкек, ул.Московская 172", "legal_address" : "г.Бишкек, ул.Московская 172", "passport_type" : "№", "passport_number" : "3407-3300-АО(ИУ", "passport_agency" : ") ГПР №074072 мин.юст.КР", "inn" : null}, {"name" : "Алаев Руслан Деканбаевич", "actual_address" : "Аламед.р., с.Кок-Джар, ул.Конур Осмона, 130", "legal_address" : "Аламед.р., с.Кок-Джар, ул.Конур Осмона, 130", "passport_type" : "AN", "passport_number" : "2559777", "passport_agency" : "МКК 50-58", "inn" : null}]
    );
    await queryInterface.bulkInsert('security_attitudes', [
        {id: 1, name: 'Владелец акций'},
        {id: 2, name: 'Доверительное лицо'},
        {id: 3, name: 'Номинальн. держатель'}]
    );
    await queryInterface.bulkInsert('security_types', [
        {id: 1, name: 'Акция'},
        {id: 2, name: 'Облигация'}]
    );
    await queryInterface.bulkInsert('security_status', [
        {name: 'Активные'},
        {name: 'Заблокированные'},
        {name: 'Погашенные'},
        {name: 'Приостановленные'},
        {name: 'Испорченные'},
        {name: 'Проданные'},
        {name: 'Переданные в дар'},
        {name: 'Утерянные'}]
    );
    await queryInterface.bulkInsert('users', [
        { 
          login: 'admin', 
          password: '$2a$05$Jj1FBJ1FvlYB3IU4yRiVLus1.0UjmQ09tUAQsrGkkokVtKqPTumVy', // admin
          first_name: 'admin',
          last_name: 'admin',
          company_id: 1
        }]
    );
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('emissions', null, {});
    await queryInterface.bulkDelete('emission_types', null, {});
    await queryInterface.bulkDelete('emitents', null, {});
    await queryInterface.bulkDelete('holders', null, {});
    await queryInterface.bulkDelete('security_attitudes', null, {});
    await queryInterface.bulkDelete('security_types', null, {});
    await queryInterface.bulkDelete('security_status', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('companies', null, {});
  }
};
