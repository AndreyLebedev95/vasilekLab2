var
    Tourists = require('./Tourists'),
    fs = require('fs'),
    readLine = require('readline');

var TouristsView = function() {
    this._tourists = new Tourists();
    this._loadTourists();
};

TouristsView.prototype._loadTourists = function() {
    var self = this;

    fs.exists('./Tourist/data.json', function(exists) {
        if (exists) {
            fs.readFile('./Tourist/data.json', 'utf8', function (err, data){
                if (err){
                    console.log(err);
                } else {
                    console.log(data);
                    if (data) {
                        self._tourists.setTourists(JSON.parse(data));
                    }
                }});
        } else {

        }
    });
};

TouristsView.prototype._saveTourists = function() {
    fs.writeFile('./Tourist/data.json', JSON.stringify(this._tourists.getTouristsList()));
}

TouristsView.prototype.addTourist = function() {
    var
        readInterface = readLine.createInterface({
            input: process.stdin,
            output: process.stdout
        }),
        questions = [
            'Введите имя туриста \n',
            'Введите фамилию туриста \n',
            'Введите отчество туриста \n',
            'Введите страну или город куда хочет турист, если такой нет, просто намите enter \n',
            'Введите что хочет посмотреть турист, если такой нет, просто намите enter \n',
            'Введите чем хочет турист добраться до места \n (автобус, поезд, самолет, теплоход), если такой нет, просто намите enter \n',
            'Введите минимальную желательную стоимость, если такой нет, просто намите enter \n',
            'Введите максимальную желательную стоимость, если такой нет, просто намите enter \n'
        ],
        self = this,
        result = [],
        i = 0;

    console.log(questions[i]);
    readInterface.prompt();
    readInterface.on('line', function(line) {
        switch (i) {
            case 5:
                line = line.toLocaleLowerCase().trim();
                if (line !== 'автобус' && line !== 'поезд' && line !== 'теплоход' && line !== 'самолет') {
                    console.log('Такого транспорта нет, выберете другой');
                    readInterface.prompt();
                    return;
                }
                break;
            case 6:
            case 7:
                if (line === '') {
                    break;
                }
                line = parseInt(line);
                if (!line || line < 0 || (result[6] && result[6] > line)) {
                    console.log('Не допустимое значение цены, введите корректную цену');
                    readInterface.prompt();
                    return;
                }
                break;
        }
        result.push(line);
        i++;
        if (i < questions.length) {
            console.log(questions[i]);
            readInterface.prompt();
        } else {
            readInterface.close();
            self._tourists.addTourist({
                firstName: result[0],
                secondName: result[1],
                thirdName: result[2],
                place: result[3],
                showPlace: result[4],
                passage: result[5],
                minPrice: result[6],
                maxPrice: result[7]
            });
            self._saveTourists();
        }
    })
}

module.exports = TouristsView;