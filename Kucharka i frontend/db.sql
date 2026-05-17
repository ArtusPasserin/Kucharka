CREATE DATABASE kucharka;
USE kucharka;


CREATE TABLE REC (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nazev VARCHAR(255) NOT NULL,
    postup TEXT NOT NULL
);
CREATE TABLE ING (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nazev VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE REC_ING (
    REC_id INT NOT NULL,
    ING_id INT NOT NULL,
    mnozstvi VARCHAR(50) NOT NULL,
    PRIMARY KEY (REC_id, ING_id)
);



**********************************************

use kucharka;
select * from REC;
select * from ING order by id;
select * from REC_ING;


SELECT REC.nazev, REC.postup FROM REC WHERE REC.id = 1;
SELECT ING.nazev, REC_ING.mnozstvi FROM ING, REC_ING WHERE ING.id = ING_id AND REC_id = 1;

SELECT REC.nazev, REC.postup FROM REC WHERE REC.nazev like "%chl%";

INSERT INTO ING (`nazev`) VALUES ("slanina");
INSERT INTO REC (`nazev`,`postup`) VALUES ("","");
INSERT INTO REC_ING (`REC_id`,`ING_id`,`mnozstvi`) VALUES (1,4, "15 g");

update REC set postup="Rozpusť máslo na pánvi, vlož uvařené brambory nakrájené na plátky. Nakonec posypej sýrem." where id=1;

/*
update REC_ING set ING_id=3 where REC_id=1 and ING_id = 2;
update REC_ING set ING_id=2 where REC_id=2 and ING_id = 3;
*/
delete from REC where id=3;
delete from REC_ING where REC_id=8;


*********************************************

{
	"nazev":"Chleba se sýrem",
	"postup":"Na plátek chleba položte sýr",
	"ingredience": [
		{"nazev": "Sýr", "mnozstvi": "20 g"},
		{"nazev":"Chleba", "mnozstvi": "1 plátek"}
	]
}


{
	"receptId":"7"
}


